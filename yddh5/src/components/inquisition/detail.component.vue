<template>
  <div class="page" v-if='inquisitionInfo'>
    <div class='doctor'>
      <img :src='inquisitionInfo.doctorAvatar || inquisitionInfo.nurseAvatar' class='left'>
      <div class='left'>
        <div>
          <span class='left'>{{inquisitionInfo.doctorName || inquisitionInfo.nurseName}}</span>
          <span class='left' v-if='inquisitionInfo.doctorPositionalTitleText || inquisitionInfo.nursePositionalTitleText'>{{inquisitionInfo.doctorPositionalTitleText || inquisitionInfo.nursePositionalTitleText}}</span>
          <span class='right'>{{inquisitionInfo.statusText}}</span>
        </div>
        <div><span>{{inquisitionInfo.organizationText}}</span><span>{{inquisitionInfo.departmentText}}</span></div>
      </div>
    </div>
    <div class='form'>
      <div>
        <label class='left'>就诊人 :</label>
        <span class='right'>{{inquisitionInfo.patientName}}</span>
      </div>
      <div>
        <label class='left'>下单时间 :</label>
        <span class='right'>{{inquisitionInfo.createdDate}}</span>
      </div>
      <div>
        <label class='left'>问诊单号 :</label>
        <span class='right'>{{inquisitionInfo.orderHeaderNumber}}</span>
      </div>
      <div v-if='hadCoupon'>
        <label class='left'>问诊费 :</label>
        <span class='right'>￥{{inquisitionInfo.originalAmount || 0}}</span>
      </div>
      <div v-if='hadCoupon'>
        <label class='left'>优惠券 :</label>
        <span class='right'>-￥{{inquisitionInfo.coupontAmount || 0}}</span>
      </div>
      <div>
        <label class='left'>{{inquisitionInfo.statusCode === 'CREATED' ? '应付' : '实付'}}金额 :</label>
        <span class='right'>￥{{inquisitionInfo.amount || 0}}</span>
      </div>
    </div>
    <div class='btn-box' v-if="inquisitionInfo.statusCode === 'CREATED'">
      <button class='left' :data-id='inquisitionInfo.orderHeaderId' @click='cancelOrder(inquisitionInfo.orderHeaderId)'>取消订单</button>
      <button class='left' :data-id='inquisitionInfo.orderHeaderId' @click='jumpTo(inquisitionInfo.orderHeaderId)'>去付款</button>
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
      inquisitionInfo: null,
      hadCoupon: true,

    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  computed: mapState({
    //方式一：箭头函数
    userInfo(state) {
      if (state.userInfo === '' && JSON.parse(localStorage.getItem('userInfo'))) {
        this.$store.commit('setUserInfo', JSON.parse(localStorage.getItem('userInfo')));
      }
      return state.userInfo
    },
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
    beforeRouteLeave(to, from, next) {
      let doctor=/doctor/
      let payment=/payment/
    if (doctor.exec(to.path)||payment.exec(to.path)) {
      this.$destroy()
    }
    next();
  },
  activated() {
    this.$store.commit('changePageType', 'package-page');
    let params = this.$route.params
    console.log(params)
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      localStorage.removeItem('useThisCoupon')
      this.getFirstInfo(params.id)
    },
    getFirstInfo(id) {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/orders/consultations?user-id=${this.userId}&page-index=1&page-size=1000`;
      this.$axios.get(url,{ headers: this.$store.state.header }).then(res => {
        console.log(res);
          let content = res.data.content.find(c => c.orderHeaderId === id);
          console.log(1)
          if (!content.doctorAvatar && !content.nurseAvatar) {
            console.log(2)
            content.doctorAvatar = '/static/images/defualt-header.png';
          } else {
            console.log(3)
            if (content.doctorAvatar && content.doctorAvatar.indexOf('qnfiles') > 0) {
              content.doctorAvatar = `${content.doctorAvatar}-doctor_list`
            }
            if (content.nurseAvatar && content.nurseAvatar.indexOf('qnfiles') > 0) {
              content.nurseAvatar = `${content.nurseAvatar}-doctor_list`
            }
          }
          if (content && content.amount && content.amount.toString().indexOf('.') < 0) {
            content.amount = '' + content.amount + '.00'
          } else if (content && content.amount && (content.amount.toString().slice(content.amount.toString().indexOf('.') + 1).length !== 2)) {
            content.amount = '' + content.amount + '0';
          }
          if (content && content.originalAmount && content.originalAmount.toString().indexOf('.') < 0) {
            content.originalAmount = '' + content.originalAmount + '.00'
          } else if (content && content.originalAmount && (content.originalAmount.toString().slice(content.originalAmount.toString().indexOf('.') + 1).length !== 2)) {
            content.originalAmount = '' + content.originalAmount + '0';
          }
          if (content && content.coupontAmount) {
            content.coupontAmount = content.coupontAmount.toString().replace('-', '')
          }
          console.log(content)
          me.inquisitionInfo = content
        
      })
    },
    cancelOrder(orderHeaderId) {
      const url = `${this.$conf.url}/internethospital/api/orders/${orderHeaderId}/statuses/CANCEL`;
      this.$axios.post(url, {},{ headers: this.$store.state.header }).then(res => {
        this.notice_show = '订单取消成功'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.back()
        }, 2000)
      }).catch(err => {
        this.notice_show = err.response.data.message
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      })
    },
    jumpTo(orderHeaderId) {
      this.$store.commit('changePageType', 'package-page');
      let url;
      if (this.inquisitionInfo.doctorName) {
        url = `/doctor/${this.inquisitionInfo.doctorId}/payment`;
      }
      if (this.inquisitionInfo.nurseName) {
        url = `/nurse/${this.inquisitionInfo.nurseId}/payment`;
      }
      url = `${url}?orderHeaderId=${orderHeaderId}`
      this.$router.push(url)
    },
  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}

.page {
  background-color: #fff;
}

.doctor {
  width: vm(690);
  margin: 0 auto;
  padding: vm(40) 0 vm(50);
  border-bottom: #e2e2e2 1px solid;
}

.doctor::after {
  content: '';
  display: block;
  clear: both;
}

.doctor>img.left {
  width: vm(100);
  height: vm(100);
  margin-right: vm(22);
  border-radius: 50%;
}

.doctor>div.left {
  width: vm(568);
}

.doctor>div.left>div {
  margin-bottom: vm(6);
}

.doctor>div.left>div::after {
  content: '';
  display: block;
  clear: both;
}

.doctor>div.left>div>span {
  font-size: vm(28);
  color: #666666;
  vertical-align: bottom;
}

.doctor>div.left>div:first-child>span:first-child {
  font-size: vm(32);
  font-weight: bold;
  margin-right: 2.6vw;
  color: #333333;
}

.doctor>div.left>div:first-child>span:nth-child(2) {
  display: block;
  margin-top: vm(8);
  font-size: vm(26);
  color: #B4B4B4;
}

.doctor>div.left>div:first-child>span:last-child {
  color: #16A9F6;
  font-size: vm(26);
}

.doctor>div.left>div:nth-child(2)>span {
  margin-right: vm(10);
}

.form {
  padding: 0 vm(30);
}

.form>div {
  margin-top: vm(30);
  font-size: vm(28);
  color: #999999;
}

.form>div::after {
  content: '';
  display: block;
  clear: both;
}

.form>div:last-child>label {
  color: #333333;
}

.form>div:last-child>span {
  color: #FF624D;
}

.btn-box {
  width: 100vw;
  height: vm(88);
  position: fixed;
  bottom: 0;
}

.btn-box>button {
  display: block;
  height: vm(88);
  border-radius: 0;
}

.btn-box>button:first-child {
  width: vm(250);
  background-color: #EFF5F8;
  color: #999999;
  font-size: vm(30);
}

.btn-box>button:last-child {
  width: vm(500);
  /* width: 100vw; */
  background-color: #16A9F6;
  color: #ffffff;
  font-size: vm(36);
}

</style>
