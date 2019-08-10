<template>
  <div class="canvas-image">
    <!-- select an image -->
    <div>Image</div>
    <input type="file" @change="updateImageSrc">

    <div v-show="imageSrc">
      <img :src="imageSrc"
        @load="adjustImageSize($event); updateCanvas($event);"
      >
      <!-- display an image -->
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
      default: 'opencv-canvas-image',
      type: String,
    },
  },
  data() {
    return {
      // opencv.js script tag's parent tag Id
      opencvjsParentTagId: 'opencv-script',

      // image source
      imageSrc: '',
      // image width
      IMAGE_WIDTH: 400,

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
     * Update the canvas image src.
     */
    updateImageSrc(event) {
      if (!event.target) return;
      if (!event.target.files) return;
      if (!event.target.files[0]) return;

      this.imageSrc = URL.createObjectURL(event.target.files[0]);
    },

    /**
     * Adjust the image size.
     */
     adjustImageSize(event) {
      if (!event.target) return;

      const imgElement = event.target;
      const ratio = this.IMAGE_WIDTH / imgElement.width;
      imgElement.width = ratio * imgElement.width;
      // imgElement.height = ratio * imgElement.height;  // will be done automatically

      console.log(
        `width: ${imgElement.width / ratio}->${imgElement.width},`,
        `height: ${imgElement.height / ratio}->${imgElement.height}`
      );
    },

    /**
     * Update the canvas.
     */
    updateCanvas(event) {
      if (!OpenCV.isOpenCVready()) return;
      if (!event.target) return;

      const imgElement = event.target;

      const cv = new OpenCV(this.canvasId);
      const option = { gray: true };
      cv.imshowFromElement(imgElement, option);
    }
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
