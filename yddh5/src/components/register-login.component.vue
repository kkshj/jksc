<template>
  <div class="page">
    <div class='logo-box'>
      <img src='../../static/images/logo.png'>
    </div>
    <img src='../../static/images/decorate-register.png'>
    <form>
      <input  :class='phoneErr === "error" || accountErr === "error" ? "error" : phoneErr === "success" && accountErr === "success" ? "success" : ""' placeholder='请输入手机号' v-model="name" type='tel' maxlength='11' @input="enterPhone" @focusout="checkPhone" >
      <input type="password" :class='passLength === "error" ? "error" : passLength === "success" ? "success" : ""' placeholder='请输入你的密码' v-model="password" @focusout="checkPassword">
      <input v-if="!accountExist" type="password" :class='passErr === "error" ? "error" : passErr === "success" ? "success" : ""' v-model="confirmPassword" placeholder='请确认你的密码'>
    </form>
    <button type="button" @click='onTapBtn(accountExist)'>{{accountExist ? '登  陆' : '注册并登陆'}}</button>
    <span class='change-bind' @click='changeLoginType()' v-if="!accountExist">已有账号？前往登陆</span>
    <span class='change-bind' @click='changeLoginType()' v-if="accountExist">暂无账号？前往注册</span>
    <notice v-if="notice" :message="notice"></notice>
  </div>
</template>

<script>
  import NoticeDialog from './notice-dialog.component'
  import Notice from './notice.component'
  import Loading from './loading.component'
  export default {
    name: "register-login",
    components: {
      NoticeDialog,
      Notice,
      Loading
    },
    data () {
        return {
          accountExist: true,
          phoneErr: 'unknown',
          accountErr: 'unknown',
          passLength: 'unknown',
          passErr: 'unknown',
          name: '',
          password: '',
          confirmPassword: '',
          notice: ''
        }
    },
    methods: {
      changeLoginType () {
        this.phoneErr = 'unknown';
        this.accountErr = 'unknown';
        this.passLength = 'unknown';
        this.passErr = 'unknown';
        this.accountExist = !this.accountExist
      },
      enterPhone () {
        if (this.name.length === 11) {
          const url = `${this.$conf.url}/users/channels/internet-hospital/micro-app/action/check-user-has-created?phone=${this.name}`;
          this.$axios.post(url, {}).then(res => {
            console.log(res.data)
            if (res.data && !this.accountExist) {
              this.notice = '账号已注册';
              this.accountErr = 'error';
              setTimeout(() => {
                this.notice =''
              }, 2000);
              return;
            }
            if (!res.data && this.accountExist){
              this.notice = '尚未注册';
              this.accountErr = 'error';
              setTimeout(() => {
                this.notice =''
              }, 2000);
              return;
            }
            if (!this.accountExist)
              this.accountErr = 'success';
            else
              this.accountErr = 'unknown';
          })
        }
      },
      checkPhone () {
        if (!/^1\d{10}$/g.test(this.name)) {
          this.phoneErr= 'error';
          this.notice = '请输入十一位手机号';
          setTimeout(() => {
            this.notice =''
          }, 2000);
          return false
        }
        if (/^1\d{10}$/g.test(this.name) && !this.accountExist) {
          this.phoneErr = 'success';
          return true
        } else if (/^1\d{10}$/g.test(this.name)) {
          this.phoneErr = 'unknown';
        }
      },
      checkPassword () {
        if (!this.accountExist) {
          if (this.password.length < 6) {
            this.passLength= 'error';
            this.notice = '请输入六位以上密码';
            setTimeout(() => {
              this.notice =''
            }, 2000);
            return false
          } else {
            this.passLength = 'success';
            return true
          }
        } else {
          this.passLength = 'unknown'
        }
      },
      onTapBtn (isLogin) {
        if (isLogin) {
          this.login('login');
        } else {
          this.register();
        }
      },
      register () {

      },
      login (type) {
        const url = `${this.$conf.url}/users/channels/internet-hospital/token`;
        const data = {
          username: this.name,
          password: this.password
        }
        this.$axios.post(url, data).then(res => {
          console.log(res)
          this.$store.commit('setUser', res.data);
          this.jumpTo('home')
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      jumpTo(route, id) {
        if (id) {
          this.$router.push(`/${route}/${id}`);
          return
        }
        this.$router.push(`/${route}`);

      }
    }
  }
</script>

<style scoped lang="scss">
  @function vm($px) {
    @return ($px / 750) * 100vw;
  }
  .page{
    background-color: #ffffff;
  }
  .logo-box{
    height: vm(260);
    width: 100vw;
    background-color: #16A9F6;
  }
  .logo-box::before{
    content: '';
    display: table;
  }
  .logo-box>img{
    display: block;
    width: vm(200);
    margin: vm(40) auto;
  }
  .logo-box+img{
    display: block;
    width: 100vw;
  }

  form{
    display: block;
    margin-top: vm(60);
  }
  form input{
    display: block;
    box-sizing: border-box;
    width: vm(600);
    height: vm(88);
    margin: 0 auto vm(50);
    border-radius: vm(4);
    background-color: #f5f5f5;
    padding: 0 vm(30);
    font-size: vm(28);
  }
  form input.error{
    outline: #FF624D solid thin;
  }
  form input.success{
    outline: #16A9F6 solid thin;
  }

  button{
    display: block;
    width: vm(400);
    height: vm(88);
    background-color: #16A9F6;
    border-radius: vm(44);
    color: #ffffff;
    margin: vm(40) auto 0;
    font-size: vm(36);
  }

  .change-bind{
    display: block;
    width: 100vw;
    font-size: vm(26);
    color: #16A9F6;
    text-align: center;
    margin-top: vm(40);
  }
</style>
