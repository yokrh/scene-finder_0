<template>
  <div class="canvas-video">
    <!-- select an video -->
    Video
    <input type="file" @change="updateVideoSrc">
    <video style=""
      :src="videoSrc"
      @loadeddata="adjustVideoSize($event); updateCanvas($event);"
    ></video>

    <!-- display a video -->
    <canvas :id="canvasId"></canvas>

    <!-- load opencv.js -->
    <div :id="opencvjsParentTagId"></div>
  </div>
</template>

<script>
import OpenCV from '../../models/OpenCV.js';

export default {
  props: {
    id: {
      default: 'opencv-canvas-video',
      type: String,
    },
  },
  data() {
    return {
      // opencv.js script tag's parent tag Id
      opencvjsParentTagId: 'opencv-script',

      // canvas id
      canvasId: '',
      // video source
      videoSrc: '',
      // max video width
      MAX_VIDEO_WITDH: 480,
    };
  },
  computed: {},
  mounted() {
    this.canvasId = this.id;
    OpenCV.loadOpenCVjs(this.opencvjsParentTagId);
  },
  methods: {
    /**
     * Update the video src.
     */
    updateVideoSrc(event) {
      if (!event.target) return;
      if (!event.target.files) return;
      if (!event.target.files[0]) return;

      this.videoSrc = URL.createObjectURL(event.target.files[0]);
    },

    /**
     * Update the canvas.
     */
    updateCanvas(event) {
      if (!OpenCV.isOpenCVready()) return;
      if (!event.target) return;

      const videoElement = event.target;

      const cv = new OpenCV(this.canvasId);
      cv.vdshow(videoElement);
    },

    /**
     * Adjust the video size.
     */
    adjustVideoSize(event) {
      if (!event.target) return;

      const videoElement = event.target;
      const ratio = this.MAX_VIDEO_WITDH / videoElement.videoWidth;
      videoElement.width = ratio * videoElement.videoWidth;
      videoElement.height = ratio * videoElement.videoHeight;

      console.log(
        `width: ${videoElement.videoWidth}->${videoElement.width},`,
        `height: ${videoElement.videoHeight}->${videoElement.height}`
      );
    }
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
