<template>
    <nav class="main-navigator row">
      <button type="button" class="col-8" :class="point === 'home' ? 'chosen' : ''" @click="jumpTo('home')">首页</button>
      <button type="button" class="col-8" :class="point === 'consultation' ? 'chosen' : ''" @click="jumpTo('consultation')">咨询</button>
      <button type="button" class="col-8" :class="point === 'personal' ? 'chosen' : ''" @click="jumpTo('personal')">我的</button>
    </nav>
</template>

<script>
  export default {
    name: "navigator",
    data () {
      return {
        point: ''
      }
    },
    mounted () {
      const path = location.hash.slice(location.hash.indexOf('#')+2);
      let home = /home/g;
      let consultation = /consultation/g;
      let personal = /personal/g;
      let point = home.exec(path) ? 'home'
        : consultation.exec(path) ? 'consultation'
          : personal.exec(path) ? 'personal' : '';
      this.point = point;
    },
    methods: {
      jumpTo (route) {
        this.point = route;
        this.$router.push(`/${route}`);
      }
    }
  }
</script>

<style scoped>
  nav.main-navigator{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 13.06vw;
    background-color: #ffffff;
  }
  nav.main-navigator>button{
    box-sizing: border-box;
    height: 13.06vw;
    padding-top: 8vw;
    font-size: 2.66vw;
    color: #737E81;
    border-top: #E2E2E2 0.26vw solid;
    background-size: 6.4vw;
    background-position: center 1.5vw ;
    background-repeat: no-repeat;
  }
  nav.main-navigator>button.chosen{
    color: #16A9F6;
  }
  nav.main-navigator>button:nth-child(1){
    background-image: url("../../static/images/icon-home.png");
  }
  nav.main-navigator>button.chosen:nth-child(1){
    background-image: url("../../static/images/icon-home-selected.png");
  }
  nav.main-navigator>button:nth-child(2){
    background-image: url("../../static/images/icon-consultation.png");
  }
  nav.main-navigator>button.chosen:nth-child(2){
    background-image: url("../../static/images/icon-consultation-selected.png");
  }
  nav.main-navigator>button:nth-child(3){
    background-image: url("../../static/images/icon-personal.png");
  }
  nav.main-navigator>button.chosen:nth-child(3){
    background-image: url("../../static/images/icon-personal-selected.png");
  }
</style>
