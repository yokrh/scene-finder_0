<template>
  <div class="canvas-image">
    <!-- select an image -->
    Image
    <input type="file" @change="updateImageSrc">
    <img style="display:none;"
      :src="imageSrc"
      :width = "imageWidth"
      :height = "imageHeight"
      @load="updateCanvas"
    >

    <!-- display an image -->
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
      default: 'opencv-canvas-image',
      type: String,
    },
  },
  data() {
    return {
      // opencv.js script tag's parent tag Id
      opencvjsParentTagId: 'opencv-script',

      // canvas id
      canvasId: '',
      // image source
      imageSrc: '',
      // image height
      imageHeight: 'auto',
      // image width
      imageWidth: 480,
    };
  },
  computed: {},
  mounted() {
    this.canvasId = this.id;
    OpenCV.loadOpenCVjs(this.opencvjsParentTagId);
  },
  methods: {
    /**
     * Update the canvas image src.
     */
    updateImageSrc(event) {
      if (!event.target) return;
      if (!event.target.files) return;
      if (!event.target.files[0]) return;

      this.imageSrc = URL.createObjectURL(event.target.files[0]);
    },

    /**
     * Update the canvas.
     */
    updateCanvas(event) {
      if (!OpenCV.isOpenCVready()) return;
      if (!event.target) return;

      const imgElement = event.target;

      const cv = new OpenCV(this.canvasId);
      cv.imshowGray(imgElement);
    }
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
