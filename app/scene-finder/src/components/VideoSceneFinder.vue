<template>
  <div class="video-scene-finder" style="margin:40px 2% 80px 2%;">
    <div style="font-size:32px;">
      <a href="/" style="text-decoration:none; color:#0fafff">Video scene finder</a>
    </div>
    <p>Find the scene in the video from an image.</p>

    <div style="display:flex; justify-content:center; flex-wrap:wrap;">
      <!-- select an image -->
      <div style="margin:0 2%;">
        <div style="margin-top:24px; padding-right:8px; font-weight:bold;">
          1. Select an image
        </div>
        <ImageFileImageMat v-model="comparedImageMat" />
      </div>

      <!-- select a video -->
      <div style="margin:0 2%;">
        <div style="margin-top:24px; padding-right:8px; font-weight:bold;">
          2. Select a video
        </div>
        <input type="file" accept="video/*" @change="updateVideoSrc">
        <!-- preview video while processing -->
        <div style="display:flex; justify-content:center;">
          <video
            style="display:block; max-width:100%;"
            :src="videoSrc"
            @loadeddata="adjustVideoSize($event);"
          ></video>
        </div>
      </div>
    </div>

    <!-- start processing button -->
    <div v-if="!isProcessing && !hasVideoImageList && videoSrc && comparedImageMat">
      <div style="margin-top:24px; padding-right:8px; font-weight:bold;">
        3. Find the scene!
      </div>
      <input class="input-button" type="button" value="Find 🔎" @click="updateCanvasList">
    </div>

    <div v-show="!isProcessing && hasVideoImageList"
      style="margin-top:40px;">

      <!-- video image list sort type -->
      <div>
        <div>{{canvasImageMats.length}} frame captured</div>
        <div>
          <span>Order:</span>
          <label style="margin-left:4%;"><input type="radio" value="0" v-model="order">Time</label>
          <label style="margin-left:2%;"><input type="radio" value="1" v-model="order">Similarity</label>
        </div>
      </div>

      <!-- video image list-->
      <div style="margin-top:12px; padding:24px 0 12px 0; display:flex;
        flex-wrap:nowrap; overflow-x:scroll; background-color:#0fafff22">
        <span v-for="(canvasImageMat, index) in canvasImageMats"
          :key="getCanvasId(canvasIdPrefix, index)"
          style="margin:0 2%;"
          :style="{ 'order': (order == 1 ? similarityRanking[index] : '') }"
        >
          <!-- image -->
          <canvas :id="getCanvasId(canvasIdPrefix, index)"></canvas>
          <!-- index -->
          <span style="margin-right:8px;">
            ({{index + 1}}/{{canvasImageMats.length}})
          </span>
          <!-- similarity -->
          <span v-if="canvasImageSimilarities.length > 0"
            style="margin-right:16px;">
            Similarity: {{getSimilarityString(canvasImageSimilarities[index])}}
          </span>
        </span>
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
    canvasIdPrefix: {
      default: 'video-scene-finder-image-canvas',
      type: String,
    },
  },
  data() {
    return {
      // opencv.js script tag's parent tag Id
      opencvjsParentTagId: 'opencv-script',

      // video source
      videoSrc: '',
      // video tag element
      videoElement: null,
      // compared image mat in opencv
      comparedImageMat: null,

      // canvas images
      canvasImageMats: [],
      // similarity list between the compared image and canvas images
      canvasImageSimilarities: [],
      // similarity ranking
      similarityRanking: [],
      // list order (0: time, 1: ranking)
      order: 0,

      // is processing
      isProcessing: false,
    };
  },
  computed: {
    hasVideoImageList() {
      return this.canvasImageMats.length > 0;
    },
  },
  watch: {},
  mounted() {
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
      const VIDEO_WIDTH = 400;

      const ratio = VIDEO_WIDTH / videoElement.videoWidth;
      videoElement.width = ratio * videoElement.videoWidth;
      videoElement.height = ratio * videoElement.videoHeight;

      console.log(
        `width: ${videoElement.videoWidth}->${videoElement.width},`,
        `height: ${videoElement.videoHeight}->${videoElement.height}`
      );

      this.videoElement = videoElement;
    },

    /**
     * Update the canvas list.
     */
    updateCanvasList() {
      if (!OpenCV.isOpenCVready()) {
        alert ('No opencv!');
        return;
      }
      if (!this.videoSrc) {
        alert('No video!');
        return;
      }

      this.isProcessing = true;
      console.log('process begin.');

      const videoElement = this.videoElement;
      OpenCV.vdextractImageMats(videoElement)
      .then(res => {
        this.canvasImageMats = res;

        // wait for the canvas tags rendering.
        setTimeout(async () => {
          await this.showCanvasList();
          console.log('showCanvasList done.');
          await this.calcImageSimilarity();
          console.log('calcImageSimilarity done.');

          const similarityRanking = this.canvasImageSimilarities
          .map((similarity, index) => {
            return { similarity, index };
          })
          .sort((a, b) => {
            if (a.similarity == b.similarity) return 0;
            return a.similarity > b.similarity ? -1 : 1;
          })
          .map((e, newIndex) => {
            const similarity = e.similarity;
            const index = e.index;
            return { similarity, index, newIndex };
          })
          .sort((a, b) => a.index < b.index ? -1 : 1)
          .map(e => e.newIndex);
          this.similarityRanking = similarityRanking;

          this.canvasImageMats.forEach(e => e.delete());
          this.comparedImageMat.delete();

          this.isProcessing = false;
          console.log('process end.');
        }, 100);
      });
    },

    /**
     * Show the canvas list.
     */
    async showCanvasList() {
      this.canvasImageMats.map((canvasImageMat, index) => {
        const canvasId = this.getCanvasId(this.canvasIdPrefix, index);
        const cvTmp = new OpenCV(canvasId);
        cvTmp.imshowFromMat(canvasImageMat, {}, false);
      });
    },

    /**
     * Get Image Similarities
     */
    async calcImageSimilarity() {
      const a = this.comparedImageMat;
      this.canvasImageSimilarities = this.canvasImageMats.map((canvasImageMat) => {
        const b = canvasImageMat;
        const similarity = OpenCV.calcImageSimilarity(a, b);
        return similarity;
      });
    },

    /**
     * Get canvas id.
     */
    getCanvasId(canvasIdPrefix, index) {
      return canvasIdPrefix + '-' + index;
    },

    /**
     * Get similarity string to display.
     */
     getSimilarityString(similarity) {
       const a = Math.ceil(10000 * similarity);
       return a / 100;
     },
  },
}
</script>

<style scoped>
.input-button {
  margin-top: 4px;
  padding: 4px 2%;
  border-radius: 2px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
@media screen and (max-width:480px) {
}
</style>
