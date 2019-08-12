<template>
  <div class="image-file-image-mat">
    <!-- select an image -->
    <input type="file" accept="image/*" @change="updateImageSrc">

    <!-- image preview -->
    <div v-if="showImage && imageSrc">
      <img :src="imageSrc" @load="setImageMat($event);">
    </div>

    <!-- load opencv.js -->
    <div :id="opencvjsParentTagId"></div>
  </div>
</template>

<script>
import OpenCV from '../../models/OpenCV.js';

export default {
  props: {
    // image mat  // for v-model
    mat: {
      default: null,
    },
    // to gray or not
    gray: {
      default: false,
      type: Boolean,
    },
    // image width
    imageWidth: {
      default: 400,
      type: Number,
    },
    // show the image preview or not
    showImage: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      // opencv.js script tag's parent tag Id
      opencvjsParentTagId: 'opencv-script',

      // image source
      imageSrc: '',
    };
  },
  computed: {},
  mounted() {
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

    /*
     * Get an image mat.
     */
    setImageMat(event) {
      if (!event.target) return;

      const imgElement = event.target;
      this.adjustImageSize(imgElement);

      const option = { gray: this.gray };
      const mat = OpenCV.getImageMat(imgElement, option);

      this.$emit('input', mat);  // for v-model
    },

    /**
     * Adjust the image size.
     */
     adjustImageSize(imgElement) {
      const ratio = this.imageWidth / imgElement.width;
      imgElement.width = ratio * imgElement.width;
      // imgElement.height = ratio * imgElement.height;  // will be done automatically

      console.log(
        `width: ${imgElement.width / ratio}->${imgElement.width},`,
        `height: ${imgElement.height / ratio}->${imgElement.height}`
      );
    },
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
