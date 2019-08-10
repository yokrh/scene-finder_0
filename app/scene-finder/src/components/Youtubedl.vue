<template>
  <div class="youtubedl">
    <div>YoutubeDL</div>

    <!-- youtube video url -->
    <div>
      <input style="width:400px;"
        type="text" placeholder="https://www.youtube.com/watch?v="  
        v-model="url"
      >
    </div>
    <!-- download video file name -->
    <div>
      <input style="width:400px;"
        type="text" placeholder="video"
        v-model="name"
      >
    </div>

    <a :href="href" download>Download</a>
  </div>
</template>

<script>

export default {
  props: {},
  data() {
    return {
      apiDomain: 'http://localhost:3000',  //
      apiPath: '/download',
      url: 'https://www.youtube.com/watch?v=bieXaLih1f4',
      name: '',
    };
  },
  computed: {
    href() {
      return `${this.apiDomain}${this.apiPath}?url=${this.urlParam}&name=${this.nameParam}`;
    },
    urlParam() {
      const str = encodeURIComponent(this.url)
      .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
      return str;
    },
    nameParam() {
      const str = encodeURIComponent(this.name)
      .replace(/ /g, '_')
      .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
      return str;
    },
  },
  mounted() {},
  methods: {
  },
}

</script>

<style scoped>
</style>