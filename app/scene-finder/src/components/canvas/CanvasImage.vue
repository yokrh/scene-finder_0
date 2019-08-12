<template>
  <div class="canvas-image">
    <!-- select an image -->
    <div>Image</div>
    <ImageFileImageMat
      v-model="mat"
      :gray="gray"
      style="display:inline-block;"
    />

    <!-- display an image -->
    <div v-show="mat" style="display:inline-block; margin-left:2%;">
      <canvas :id="canvasId"></canvas>
    </div>
  </div>
</template>

<script>
import OpenCV from '../../models/OpenCV.js';
import ImageFileImageMat from '../opencv/ImageFileImageMat.vue'

export default {
  components: {
    ImageFileImageMat,
  },
  props: {
    canvasId: {
      default: 'opencv-canvas-image',
      type: String,
    },
  },
  data() {
    return {
      // mat in opencv
      mat: null,
      // to gray or not in opencv process
      gray: false,
    };
  },
  computed: {},
  watch: {
    mat: function() { this.updateCanvas(); },
  },
  mounted() {},
  methods: {
    /**
     * Update the canvas.
     */
    updateCanvas() {
      if (!OpenCV.isOpenCVready()) return;

      const cv = new OpenCV(this.canvasId);
      const option = { gray: true };
      cv.imshowFromMat(this.mat, option);
    }
  },
}
</script>

<style scoped>
@media screen and (max-width:480px) {
}
</style>
