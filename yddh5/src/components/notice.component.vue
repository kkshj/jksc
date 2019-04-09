<template>
  <div class="mask">
    <span v-html="message"></span>
  </div>
</template>

<script>
  export default {
    name: "notice",
    props: [
      'message'
    ]
  }
</script>

<style scoped>
  div.mask{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }
  div.mask>span{
    position: absolute;
    box-sizing: border-box;
    text-align: center;
    width: 80vw;
    padding: 2vw 4vw;
    border-radius: 1.06vw;
    background-color: rgba(0, 0, 0, .6);
    top: 40%;
    left: 50%;
    margin-left: -40vw;
    color: #ffffff;
    white-space: normal;
    word-wrap: break-word;
  }
</style>
