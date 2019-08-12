<template>
  <div class="canvas">
    <div>Video scene finder</div>

    <!-- select an video -->
    <input type="file" accept="video/*" @change="updateVideoSrc">

    <div v-show="videoSrc">
      <!-- preview video -->
      <div style="display:flex; justify-content:center;">
        <video
          style="display:block;"
          :src="videoSrc"
          @loadeddata="adjustVideoSize($event); updateCanvasList($event);"
        ></video>
      </div>

      <div>
        <div style="margin-top:24px;">Canvas List</div>

        <!-- canvas list for video images-->
        <div v-show="isShowingCanvasList"
          style="margin-top:24px; padding:24px 2%; display:flex;
            flex-wrap:nowrap; overflow-x:scroll; background-color:#0fafff22">
          <span v-for="(canvasImageMat, index) in canvasImageMats"
            :key="getCanvasIdFromIndex(index)"
            style="margin:0 2%;">
            <canvas :id="getCanvasIdFromIndex(index)"></canvas>
            <span style="font-weight:bold;">[{{index}}]</span>
            <span v-if="comparedImageSimilarities.length > 0">
              {{comparedImageSimilarities[index]}}
            </span>
          </span>
        </div>

        <div v-if="isShowingCanvasList">
          <div style="margin-top:24px;">Image Similarity</div>
          <ImageFileImageMat v-model="comparedImageMat" />
        </div>
      </div>
    </div>

    <!-- load opencv.js -->
    <div :id="opencvjsParentTagId"></div>
  </div>
</template>

<script>
import OpenCV from '../models/OpenCV.js';
import ImageFileImageMat from './opencv/ImageFileImageMat.vue'

export default {
  components: {
    ImageFileImageMat,
  },
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

      // compared image mat in opencv
      comparedImageMat: null,
      // similarity list between the compared image and canvas images
      comparedImageSimilarities: [],

      // is processing
      isProcessingExtractingImageMats: false,
      // is showing canvas list
      isShowingCanvasList: false,
    };
  },
  computed: {},
  watch: {
    comparedImageMat: function() { this.calcImageSimilarity(); },
  },
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
      this.isShowingCanvasList = false;

      const videoElement = event.target;
      OpenCV.vdextractImageMats(videoElement)
      .then(res => {
        this.canvasImageMats = res;
        this.isProcessingExtractingImageMats = false;

        // wait for the canvas tags rendering.
        setTimeout(() => {
          this.showCanvasList();
        }, 100);
      });
    },

    /**
     * Show the canvas list.
     */
    showCanvasList() {
      this.canvasImageMats.map((canvasImageMat, index) => {
        const canvasId = this.getCanvasIdFromIndex(index);
        const cvTmp = new OpenCV(canvasId);
        cvTmp.imshowFromMat(canvasImageMat, {}, false);
      });
      this.isShowingCanvasList = true;
    },

    /**
     * Get Image Similarities
     */
    calcImageSimilarity() {
      const a = this.comparedImageMat;
      this.comparedImageSimilarities = this.canvasImageMats.map((canvasImageMat) => {
        const b = canvasImageMat;
        const similarity = OpenCV.calcImageSimilarity(a, b);
        return similarity;
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
