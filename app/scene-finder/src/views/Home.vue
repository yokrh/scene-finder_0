<template>
  <div class="home">
    <CanvasImage />
    <CanvasVideo />

    <Canvas />
</div>
</template>

<script>
import CanvasImage from '@/components/canvas/CanvasImage.vue'
import CanvasVideo from '@/components/canvas/CanvasVideo.vue'
import Canvas from '@/components/Canvas.vue'

export default {
  components: {
    CanvasImage,
    CanvasVideo,
    Canvas,
  }
}
</script>
