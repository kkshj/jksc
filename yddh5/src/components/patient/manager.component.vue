<template>
  <div class="page">
    <div v-if='user' class='self' @click='getToEidt(user.id)'>
      <img v-if='user.avatar' :src='user.avatar' class='left'>
      <img v-else src='static/images/defualt-header.png' class='left'>
      <div class='left'>{{user.name}}<span>（我自己）</span></div>
    </div>
    <span class='title'>其它就诊人</span>
    <div class='section' v-if='patients'>
      <li v-for='(item,index) in patients' :key='item.id' @click='getToEidt(item.id)'>
        <span>{{item.name}}</span>
      </li>
    </div>
    <div class='addOne'>
      <button @click='getToEidt(1)'>添加就诊人</button>
    </div>
    <notice v-show='notice_show' :message="notice_show"></notice>
    <loading v-show='load_show'></loading>
  </div>
</template>
<script type="text/javascript">
import NoticeDialog from '../notice-dialog.component'
import Notice from '../notice.component'
import Loading from '../loading.component'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      message: '',
      load_show: false,
      notice_show: '',
      user: null,
      patients: [],
      noMaster: false
    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  computed: mapState({
    //方式一：箭头函数
    header(state) {
      if (state.header === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.header
    },
    userInfo(state) {
      if (state.userInfo === ''&&JSON.parse(localStorage.getItem('userInfo'))) {
        this.$store.commit('setUserInfo', JSON.parse(localStorage.getItem('userInfo')));
      }
      return state.userInfo
    },
    userId(state) {
      if (state.userId === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.userId
    }

  }),
  activated() {
    console.log(this.userInfo)
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.getFirstInfo()
    },
    getFirstInfo() {
      const me = this;
      if (this.userId) {
        const url = `${this.$conf.url}/internethospital/api/patients?user-id=${this.userId}&page-index=1&page-size=100`;
        this.$axios.get(url, { 'Authorization': 'Bearer ' + this.token }).then(res => {
          console.log(res);
          if (res.status >= 200 && res.status <= 399) {
            let content = res.data.content.filter(c => !c.master);
            let user = res.data.content.find(u => u.master);
            console.log(user)
            me.patients = content
            if(this.userInfo){
              if (!res.data.content.find(u => u.master)) {
                console.log('nomaster')
                me.noMaster = true
                user = {
                  avatar: me.userInfo.avatarUrl,
                  name: me.userInfo.nickName,
                  id: 'me'
                }
              }
                }
              me.user = user
          }
        })
      } else {
        this.notice_show = '请先完成注册，即将为您跳转到注册页面'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.push('/register-login')
        }, 2000)

      }
    },
    getToEidt(id) {
      console.log(id)
      let url;
      
    if (id !== 'me'&&id!=1) {
      url =id ? `/patient/edit?id=${id}&noMaster=${this.noMaster}` : `/patient/edit?noMaster=${this.noMaster}`;
    } else if(id==1){
      url = '/patient/edit'
    }
  
      this.$router.push(url)
    },
  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}
.page{
	background-color: #fff;
}
.self {
  width: 100vw;
  height: vm(120);
  padding: vm(20) vm(30);
  background-color: #ffffff;
  box-sizing: border-box;
  line-height: vm(80);
  font-size: vm(30);
  color: #333333;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAACN0lEQVR4Xu3av0pDMRgF8C/3VqGDqIvg6qBYoY4XX0BddOwj6CwULIK0durUXV/BxdlREV18ARcFN10UQbDtTeT6BxRuWyE2OYHTuU2bX89J4WuU8DFQQNFnsACBhiSEQASyO0SYICaICbITYILs/HgGMUFMkJ0AE2TnxzOICWKC7AQQErS1dTg2NfMwl32W20J6e9xodEa6q39c3MkZVK3Xy5JGayISmYK5TEqli0qlkv7jPka2lBug/WYiyqyKSGyM6mmdnq4sL12HgOQEaLfVmuy+vq1HIovZV50hSazPJkSuGuB1cwKUoey028X4+XlDTFT66IOWrinE50lpHrpuzoC+kQpPL5vaqAWlTBRC3ZwCZUi1Wm06HS+umkDq5hwotLp5AQqpbt6AQqmbV6AQ6uYdCL1uEEDIdYMBQq0bFBBi3eCA0OoGCYRUN1gglLpBA/Wtm9ZnL4+zl0dH292RTcq+FoYHyqubMerVROlJ++DghkA5syQC/YhF7niEFfsUyqaQvgdssGdQ/ojWnLv+RwQSCGnqCAeEUKufv4xQQCi1ggRCqhUcEFqtoIAQawUDhForCCDkWnkHQq+VV6AQauUNKJRaeQEKqVbOgXiBashYr9psJtLjFby+TNW9elmiaE0ppbTWV8kyL3H+wvq+BtyLY3OvOne8BjzqSbrD9aHGHQ73/ee3ItAQKgIR6M9tyn0iE8QEMUF2AkyQnR/PICaICbITYILs/HgGMUFMkJ3AkFe/A5eMGGfm7a/3AAAAAElFTkSuQmCC');
  background-size: vm(48);
  background-repeat: no-repeat;
  background-position: right vm(20) center;
}

.self>img {
  width: vm(80);
  height: vm(80);
  border-radius: 50%;
  margin-right: vm(20);
}

.self>div>span {
  font-size: vm(26);
  color: #B4B4B4;
}

.title {
  display: block;
  font-size: vm(28);
  color: #999999;
  background-color: #eff5f8;
  padding: vm(20) vm(30);
}

.section {
  max-height: 70vh;
  height: 70vh;
  overflow: auto;
  background-color: #fff;
}

.section li {
  display: block;
  width: 100vw;
  height: vm(88);
  padding: vm(30);
  background-color: #ffffff;
  box-sizing: border-box;
  font-size: vm(30);
  color: #333333;
  border-bottom: #e2e2e2 1px solid;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAACN0lEQVR4Xu3av0pDMRgF8C/3VqGDqIvg6qBYoY4XX0BddOwj6CwULIK0durUXV/BxdlREV18ARcFN10UQbDtTeT6BxRuWyE2OYHTuU2bX89J4WuU8DFQQNFnsACBhiSEQASyO0SYICaICbITYILs/HgGMUFMkJ0AE2TnxzOICWKC7AQQErS1dTg2NfMwl32W20J6e9xodEa6q39c3MkZVK3Xy5JGayISmYK5TEqli0qlkv7jPka2lBug/WYiyqyKSGyM6mmdnq4sL12HgOQEaLfVmuy+vq1HIovZV50hSazPJkSuGuB1cwKUoey028X4+XlDTFT66IOWrinE50lpHrpuzoC+kQpPL5vaqAWlTBRC3ZwCZUi1Wm06HS+umkDq5hwotLp5AQqpbt6AQqmbV6AQ6uYdCL1uEEDIdYMBQq0bFBBi3eCA0OoGCYRUN1gglLpBA/Wtm9ZnL4+zl0dH292RTcq+FoYHyqubMerVROlJ++DghkA5syQC/YhF7niEFfsUyqaQvgdssGdQ/ojWnLv+RwQSCGnqCAeEUKufv4xQQCi1ggRCqhUcEFqtoIAQawUDhForCCDkWnkHQq+VV6AQauUNKJRaeQEKqVbOgXiBashYr9psJtLjFby+TNW9elmiaE0ppbTWV8kyL3H+wvq+BtyLY3OvOne8BjzqSbrD9aHGHQ73/ee3ItAQKgIR6M9tyn0iE8QEMUF2AkyQnR/PICaICbITYILs/HgGMUFMkJ3AkFe/A5eMGGfm7a/3AAAAAElFTkSuQmCC');
  background-size: vm(48);
  background-repeat: no-repeat;
  background-position: right vm(20) center;
}


.addOne {
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: vm(30) 0;
  background-color: #ffffff;
}

.addOne>button {
  width: vm(580);
  height: vm(88);
  border-radius: vm(8);
  background-color: #16A9F6;
  margin: 0 calc(100vw - 90vw);
  font-size: vm(36);
  color: #ffffff;
  text-align: center;
  background-image: url('data:image/png;base64,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');
  background-size: vm(36);
  background-repeat: no-repeat;
  background-position: vm(150) center;
}

</style>
