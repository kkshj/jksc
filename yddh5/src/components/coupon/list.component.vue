<template>
  <div class="page">
    <div class='top-nav-bar'>
      <button :class='showType === "AVAILABLE" ? "chosen" : ""' data-type='AVAILABLE' @click='changeShowType("AVAILABLE")'>未使用<span></span></button>
      <button :class='showType === "USED" ? "chosen" : ""' @click='changeShowType("USED")'>已使用<span></span></button>
      <button :class='showType === "EXPIRED" ? "chosen" : ""' data-type='EXPIRED' @click='changeShowType("EXPIRED")'>已过期<span></span></button>
    </div>
    <div class='section'>
      <div v-for='(item,index) in couponList' :key='item.id' class='coupon-item'>
        <img v-if='item.status === "AVAILABLE"' src='static/images/coupon-for-all.png'>
        <img v-if='item.status !== "AVAILABLE"' src='static/images/coupon-used.png'>
        <div class='basic-info'>
          <div class='left'>￥<span>{{item.amount}}</span></div>
          <div class='left'>
            <span>{{item.text}}</span>
            <span>{{item.startTime}}-{{item.endTime}}</span>
          </div>
          <button v-if='item.status === "AVAILABLE"' class='right' @click='getToDoctor'>去使用</button>
          <img v-if='item.status === "EXPIRED"' class='right' src='static/images/coupon-overdue.png'>
          <button v-if="item.longText" class='show-use-notice' @click='showOrHideUseNotice(item.id)'>使用须知<img v-if='!item.showUseNotice' class='right' src='static/images/coupon-notice-open.png'><img v-else class='right' src='static/images/coupon-notice-close.png'></button>
        </div>
        <div v-if='item.showUseNotice' class='use-notice'>{{item.longText}}</div>
      </div>
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
      load_show: false,
      notice_show: '',      
      couponList: [],
      showType: 'AVAILABLE'
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
    userId(state) {
      if (state.userId === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.userId
    }

  }),
  activated() {
    console.log(555)
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.getFirstInfo('AVAILABLE');
    },
    getFirstInfo(status) {
      const url = `${this.$conf.url}/internethospital/api/inventories/coupons?user-id=${this.userId}&page-index=1&page-size=10000`;
      this.$axios.post(url, {}, { headers: this.$store.state.header }).then(res => {
        let coupons = res.data.content
        console.log(res)
        if (status === 'AVAILABLE') {
          coupons = coupons.filter(c => c.status === 'AVAILABLE' || c.status === 'CREATED')
        } else {
          coupons = coupons.filter(c => c.status === status)
        }
        for (let i in coupons) {
          coupons[i].amount = coupons[i].amount.toString().replace('-', '')
          coupons[i].startTime = coupons[i].startTime.slice(0, coupons[i].startTime.indexOf(' '));
          coupons[i].startTime = coupons[i].startTime.replace(/-/g, '.')
          coupons[i].endTime = coupons[i].endTime.slice(0, coupons[i].endTime.indexOf(' '));
          coupons[i].endTime = coupons[i].endTime.replace(/-/g, '.')
          coupons[i].showUseNotice = false;
        }
        this.couponList = coupons
      }).catch(err => {
        this.notice_show = err.response.data.message
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      })
    },
    showOrHideUseNotice(e) {
      const me = this;
      const id = e;
      const couponList = me.couponList;
      for (let i in couponList) {
        if (couponList[i].id === id) {
          couponList[i].showUseNotice = !couponList[i].showUseNotice
        }
      }
      this.couponList = couponList
    },
    changeShowType(type) {
      const me = this;
      this.showType = type
      console.log(this.showType)
      me.getFirstInfo(type);
    },
    getToDoctor() {
      const url = '/doctor?type=CONSULT';
      this.$router.push(url)
    }
  }
}

</script>
<style type="text/css" scoped lang="scss">
@function vm($px) {
  @return ($px / 750) * 100vw
}

page {
  background-color: #eff5f8;
}

.top-nav-bar {
  width: 100vw;
  height: vm(80);
  display: flex;
  background-color: #ffffff;
  box-shadow: 0px 1px 0px 0px rgba(226, 226, 226, 1);
  position: fixed;
}

.top-nav-bar button {
  flex: 1;
  background-color: #ffffff;
  font-size: vm(28);
  position: relative;
  color: #999999;
  transition: color .5s;
}

.top-nav-bar button.chosen {
  color: #333333;
}

.top-nav-bar button span {
  display: block;
  width: vm(60);
  height: vm(6);
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: vm(-30);
  background-color: #FE9B00;
  opacity: 0;
  transition: opacity .5s
}

.top-nav-bar button.chosen span {
  opacity: 1;

}

.section {
  position: fixed;
  width: 100vw;
  height: auto;
  top: vm(80);
  bottom: 0;
  overflow-y: scroll;
}

.coupon-item {
  width: vm(690);
  height: auto;
  position: relative;
  margin: vm(20) auto;
  margin-top: vm(20);
}

.coupon-item>img {
  position: absolute;
  top: 0;
  width: vm(690);
  height: auto;
  z-index: 1;
}

.basic-info {
  position: relative;
  width: vm(690);
  height: vm(180);
  z-index: 100;
}

.basic-info .left:first-child {
  font-family: 'pier';
  width: vm(190);
  text-align: center;
  font-size: vm(30);
  color: #ffffff;
  vertical-align: top;
  font-weight: bold;
  padding-top: vm(60);
}

.basic-info .left:first-child>span {
  font-size: vm(60);
  vertical-align: top;
}

.basic-info .left:nth-child(2) {
  width: vm(320);
  margin-left: vm(40);
}

.basic-info .left:nth-child(2)>span {
  display: block;
}

.basic-info .left:nth-child(2)>span:first-child {
  font-size: vm(30);
  color: #333333;
  margin-top: vm(40);
}

.basic-info .left:nth-child(2)>span:last-child {
  font-size: vm(26);
  color: #666666;
  margin-top: vm(20);
}

.basic-info button.right {
  width: vm(110);
  height: vm(50);
  line-height: vm(50);
  font-size: vm(28);
  padding: 0;
  background-color: transparent;
  border: #16A9F6 1px solid;
  border-radius: vm(4);
  color: #16A9F6;
  margin-top: vm(60);
  margin-right: vm(20);
}

.basic-info>img.right {
  position: absolute;
  right: 0;
  top: 0;
  width: vm(120);
  height: auto;
}

.show-use-notice {
  position: absolute;
  top: vm(140);
  right: vm(5);
  height: vm(36);
  line-height: vm(36);
  font-size: vm(20);
  color: #999999;
  background-color: transparent;
  padding: 0;
}

.show-use-notice::after {
  content: '';
  display: block;
  clear: both;
}

.show-use-notice>img {
  width: vm(36);
  height: auto;
}

.use-notice {
  letter-spacing: vm(2);
  margin-top: vm(10);
  background-color: #ffffff;
  width: 100%;
  color: #666666;
  font-size: vm(26);
  padding: vm(20);
  box-sizing: border-box;
  line-height: vm(40);
}

</style>
