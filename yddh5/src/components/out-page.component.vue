<template>
    <div>
      <iframe name="frame" v-if="linkUrl" :src="linkUrl" frameborder="0" @click="getData"></iframe>
    </div>
</template>

<script>
  export default {
    name: "out-page",
    data () {
      return {
        linkUrl: ''
      }
    },
    activated () {
      console.log(this.$route.query)
      this.linkUrl = this.$route.query.url;
    },
    beforeRouteLeave (to, from, next) {

      console.log()
    },
    methods: {
      getData (e) {
        console.log(window.frames['frame'].contentWindow.getData());
        window.frames['frame'].contentWindow.getData()
      }
    }
  }
</script>

<style scoped>
  iframe{
    width: 100vw;
    height: 100vh;
  }
</style>
