<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
    <nav-component v-if="pageType === 'main-page'"></nav-component>
  </div>
</template>

<script>
  import NavComponent from './components/nav.component';

  export default {
    name: 'App',
    components: {
      NavComponent
    },
    mounted () {
      const path = location.hash.slice(location.hash.indexOf('#')+2);
      let home = /home/g;
      let consultation = /consultation/g;
      let personal = /personal/g;
      if (!home.exec(path) && !consultation.exec(path) && !personal.exec(path)) {
        console.log(1)
        this.$store.commit('changePageType', 'package-page');
      } else {
        console.log(2)
        this.$store.commit('changePageType', 'main-page');
      }
    },
    computed: {
      pageType () {
        return this.$store.state.pageType
      }
    }
  }
</script>

<style lang="scss">
#app {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  overflow: hidden;
}
</style>