<template>
  <div class="mask">
    <div>
      <span v-for="item in chrysanthemum" :class="`m${item.id} ${item.brightness}`"></span>
      <div class="circlebg"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loading",
    data () {
      return {
        chrysanthemum: [
          {id: 0, brightness: 'p0'},
          {id: 1, brightness: 'p100'},
          {id: 2, brightness: 'p80'},
          {id: 3, brightness: 'p60'},
          {id: 4, brightness: 'p40'},
          {id: 5, brightness: 'p20'}
        ]
      }
    }
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
  div.mask>div{
    width: 20vw;
    height: 20vw;
    border-radius: 1.06vw;
    background-color: #535353;
    margin: 60vw auto;
    position: relative;
  }
 .mask div span{position:absolute; left:50%; margin-left: -0.5vw; top:2.5vw; width:1vw; height:15vw;}
 .mask div span:before,.mask div span:after{content:'';display:block;height:50%;background:#fcfcfc;border-radius:2.5vw;}
 .mask div span:nth-child(2){-webkit-transform:rotate(30deg);}
 .mask div span:nth-child(3){-webkit-transform:rotate(60deg);}
 .mask div span:nth-child(4){-webkit-transform:rotate(90deg);}
 .mask div span:nth-child(5){-webkit-transform:rotate(120deg);}
 .mask div span:nth-child(6){-webkit-transform:rotate(150deg);}
 .mask .circlebg{position:absolute;left:50%; top:50%; width:9.5vw; height:9.5vw; margin:-4.75vw 0 0 -4.75vw; background:#535353; border-radius:50%;}

 /** 加载动画 **/
 @-webkit-keyframes load{
     0%{opacity:0;}
     100%{opacity:1;}
 }
 .mask div span:nth-child(1):before{-webkit-animation:load 1.2s linear 0s infinite;}
 .mask div span:nth-child(2):before{-webkit-animation:load 1.2s linear 0.1s infinite;}
 .mask div span:nth-child(3):before{-webkit-animation:load 1.2s linear 0.2s infinite;}
 .mask div span:nth-child(4):before{-webkit-animation:load 1.2s linear 0.3s infinite;}
 .mask div span:nth-child(5):before{-webkit-animation:load 1.2s linear 0.4s infinite;}
 .mask div span:nth-child(6):before{-webkit-animation:load 1.2s linear 0.5s infinite;}
 .mask div span:nth-child(1):after{-webkit-animation:load 1.2s linear 0.6s infinite;}
 .mask div span:nth-child(2):after{-webkit-animation:load 1.2s linear 0.7s infinite;}
 .mask div span:nth-child(3):after{-webkit-animation:load 1.2s linear 0.8s infinite;}
 .mask div span:nth-child(4):after{-webkit-animation:load 1.2s linear 0.9s infinite;}
 .mask div span:nth-child(5):after{-webkit-animation:load 1.2s linear 1s infinite;}
 .mask div span:nth-child(6):after{-webkit-animation:load 1.2s linear 1.1s infinite;}
</style>
