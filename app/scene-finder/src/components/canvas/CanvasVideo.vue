<template>
  <div class="canvas-video">
    <!-- select an video -->
    <div>Video</div>
    <input type="file" @change="updateVideoSrc">

    <div v-show="videoSrc">
      <video :src="videoSrc"
        @loadeddata="adjustVideoSize($event); updateCanvas($event);"
      ></video>

      <!-- display a video -->
      <canvas :id="canvasId"></canvas>
    </div>

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

      // video source
      videoSrc: '',
      // video width
      VIDEO_WIDTH: 480,

      // canvas id
      canvasId: '',
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
     * Adjust the video size.
     */
     adjustVideoSize(event) {
      if (!event.target) return;

      const videoElement = event.target;
      const ratio = this.VIDEO_WIDTH / videoElement.videoWidth;
      videoElement.width = ratio * videoElement.videoWidth;
      videoElement.height = ratio * videoElement.videoHeight;

      console.log(
        `width: ${videoElement.videoWidth}->${videoElement.width},`,
        `height: ${videoElement.videoHeight}->${videoElement.height}`
      );
    },

    /**
     * Update the canvas.
     */
    updateCanvas(event) {
      if (!OpenCV.isOpenCVready()) return;
      if (!event.target) return;

      const videoElement = event.target;

      const cv = new OpenCV(this.canvasId);
      const option = { gray: true };
      cv.vdshowFromElement(videoElement, option);
    },
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
