<template>
  <div class="mask">
    <img id="shownImg" :src="imgUrl"  alt="" :style="`width:  ${touch.scaleWidth}vw ; ${touch.scaleHeight > screenHeight ? 'height: ' + touch.scaleHeight + 'vw'  : 'max-height: 100vh' }; top: ${moving.y}vw; left: ${ moving.x }vw;`">
  </div>
</template>

<script>
  export default {
    name: "show-pic",
    props: ["imgUrl"],
    data () {
      return {
        screenWidth: 0,
        screenHeight: 0,
        touch: {
          distance: 0,
          scale: 1,
          baseWidth: 0,
          baseHeight: 0,
          scaleWidth: null,
          scaleHeight: null,
        },
        moving: {
          lastX: 0,
          lastY: 0,
          x: 0,
          y: 0,
        }
      }
    },
    mounted(){
      let img = document.getElementById('shownImg');
      // this.screenWidth = 100;
      // this.screenHeight = 100 /  document.body.clientWidth * document.body.clientHeight;
      this.moving.y = ((document.body.clientHeight / 750 * 100) - (img.offsetHeight / 750 * 100)) / 2;
      console.log(img.offsetHeight)
      console.log(document.body.clientHeight)
      console.log(this.moving.y)
    }
  }
</script>

<style scoped>
  .mask{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #000000;
    z-index: 1000;
    line-height: 100vh;
  }
  img{
    position: absolute;
    display: inline;
    width: 100vw;
    max-height: 100vh;
    line-height: 100vh;
  }
</style>
