<template>
  <div class="canvas">
    <!-- select an video -->
    <div>Video</div>
    <input type="file" @change="updateVideoSrc">

    <div v-show="videoSrc">
      <div style="display:flex; justify-content:center;">
        <video
          style="display:block;"
          :src="videoSrc"
          @loadeddata="adjustVideoSize($event); updateCanvasList($event);"
        ></video>
      </div>

      <div>Canvas List</div>
      <div v-if="!isProcessingExtractingImageMats && canvasImageMats.length > 0">
        <input type="button" value="Show canvas list" @click="showCanvasList">
      </div>
      <!-- canvas list for video images-->
      <canvas v-for="(canvasImageMat, index) in canvasImageMats"
        :key="getCanvasIdFromIndex(index)"
        :id="getCanvasIdFromIndex(index)"
        style="width:30%; margin:8px 1%;">
      </canvas>
    </div>

    <!-- load opencv.js -->
    <div :id="opencvjsParentTagId"></div>
  </div>
</template>

<script>
import OpenCV from '../models/OpenCV.js';

export default {
  props: {
    id: {
      default: 'opencv-canvas-main',
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

      // image canvas id prefix
      canvasIdPrefix: '',
      // canvas images
      canvasImageMats: [],

      // is processing
      isProcessingExtractingImageMats: false,
    };
  },
  computed: {},
  mounted() {
    this.canvasIdPrefix = this.id;
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
     * Update the canvas list.
     */
    updateCanvasList(event) {
      if (!OpenCV.isOpenCVready()) return;
      if (!event.target) return;

      this.isProcessingExtractingImageMats = true;

      const videoElement = event.target;
      OpenCV.vdextractImageMats(videoElement)
      .then(res => {
        this.canvasImageMats = res;
        this.isProcessingExtractingImageMats = false;
      });
    },

    /**
     * Show the canvas list.
     */
    showCanvasList() {
      this.canvasImageMats.map((canvasImageMat, index) => {
        const canvasId = this.getCanvasIdFromIndex(index);
        const cvTmp = new OpenCV(canvasId);
        cvTmp.imshowFromMat(canvasImageMat);
      });
    },

    /**
     * Get canvas id.
     */
    getCanvasIdFromIndex(index) {
      const str = this.canvasIdPrefix + index;
      return str;
    },
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
