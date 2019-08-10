<template>
  <div class="home">
    <Youtubedl />
    <CanvasImage />
    <CanvasVideo />
  </div>
</template>

<script>
// @ is an alias to /src
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
