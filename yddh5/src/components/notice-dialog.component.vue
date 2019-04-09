<template>
    <div class="mask">
      <div>
        <div>
          <span v-html="message"></span>
        </div>
        <div>
          <button @click="buttonCancel">{{buttonCancelText}}</button>
          <button @click="buttonConfirm">{{buttonConfirmText}}</button>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "notice-dialog",
      props: [
        'message',
        'buttonConfirmText',
        'buttonCancelText'
      ],
      methods: {
        buttonConfirm () {
          this.$emit("touchConfirm", true);
        },
        buttonCancel () {
          this.$emit("touchConfirm", false);
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
    background-color: rgba(0, 0, 0, .5);
    z-index: 1000;
  }
  div.mask>div{
    width: 75vw;
    height: 34vw;
    border-radius: 1.06vw;
    background-color: #ffffff;
    margin: 40vw auto;
    overflow: hidden;
  }
  div.mask>div>div:first-child{
    height: 24vw;
    text-align: center;
    padding-top: 5.3vw;
    box-sizing: border-box;
    font-size: 4.8vw;
  }
  div.mask>div>div:last-child{
    display: flex;
    height: 10vw;
  }
  div.mask>div>div:last-child>button{
    width: 50%;
    height: 10vw;
    border-top: 1px solid #e3e3e3;
    font-size: 4vw;
    line-height: 10vw;
  }
  div.mask>div>div:last-child>button:last-child{
    color: #16A9F6;
  }
</style>
