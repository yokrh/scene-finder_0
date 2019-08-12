<template>
  <div class="about">
    <CanvasImage />
    <CanvasVideo />
    <Youtubedl />
  </div>
</template>

<script>
import CanvasImage from '@/components/canvas/CanvasImage.vue'
import CanvasVideo from '@/components/canvas/CanvasVideo.vue'
import Youtubedl from '@/components/Youtubedl.vue'

export default {
  components: {
    CanvasImage,
    CanvasVideo,
    Youtubedl,
  }
}
</script>