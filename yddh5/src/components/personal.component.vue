<template>
  <div class="page">
    <header class='header' v-if="userInfo">
      <img :src='userInfo.avatarUrl || "../../static/images/default-header-person.png"' onerror="this.src='static/images/default-header-person.png'">
      <span>{{userInfo.nickName}}</span>
    </header>
    <ul class='function-list order'>
        <li :class='prescriptionNew ? "new" : ""' @click="jumpTo('prescription')">
          <img src='../../static/images/icon-prescription.png' mode='widthFix' class='left'>
          <span class='left'>我的处方</span>
          <span></span>
        </li>
        <li :class='inquisitionNew ? "new" : ""' @click="jumpTo('inquisition')">
          <img src='../../static/images/icon-inquisition.png' mode='widthFix' class='left'>
          <span class='left'>问诊订单</span>
          <span></span>
        </li>
        <li @click="jumpTo('coupon')">
          <img src='../../static/images/icon-coupon.png' mode='widthFix' class='left'>
          <span class='left'>优惠券</span>
          <span class='right'>{{couponCount}}张</span>
        </li>
    </ul>
    <ul class='function-list manager'>
        <li @click="jumpTo('follow')">
          <img src='../../static/images/icon-follow.png' mode='widthFix' class='left'>
          <span class='left'>我的关注</span>
        </li>
        <li @click="jumpTo('patient')">
          <img src='../../static/images/icon-patient.png' mode='widthFix' class='left'>
          <span class='left'>就诊人管理</span>
        </li>
        <li @click="jumpTo('address')">
          <img src='../../static/images/icon-address.png' mode='widthFix' class='left'>
          <span class='left'>配送地址</span>
        </li>
    </ul>
    <ul class='function-list service'>
    <a href="tel:400-800-1335">
        <li>
          <img src='../../static/images/question.png' mode='widthFix' class='left'>
          <div class='left'>常见问题</div>
        </li>
      </a>      
      <a href="tel:400-800-1335">
        <li>
          <img src='../../static/images/icon-service.png' mode='widthFix' class='left'>
          <div class='left'>联系客服<span>（咨询、建议、投诉）</span></div>
        </li>
      </a>
    </ul>
    <span class='noticeText'>客服服务时间周一至周五8:00-20:00，周六周日8:00-12:00</span>

    <!--<view class="getUserInfo {{getUserInfo ? 'show' : ''}}">-->
      <!--<view>-->
        <!--<view>-->
          <!--<text>我们希望获得您的个人信息，\n并注册个人账号</text>-->
        <!--</view>-->
        <!--<view>-->
          <!--<button bindtap='notNow'>先看看</button>-->
          <!--<button open-type='getUserInfo' bindgetuserinfo='makeChoise'>好的</button>-->
        <!--</view>-->
      <!--</view>-->
    <!--</view>-->
  </div>
</template>

<script>
  import NoticeDialog from './notice-dialog.component'
  import Notice from './notice.component'
  import Loading from './loading.component'
  import { mapState } from 'vuex'

  export default {
    name: "personal",
    components: {
      NoticeDialog,
      Notice,
      Loading
    },
    data () {
      return {
        getUserInfo: false,
        userInfo: null,
        inquisitionNew: false,
        prescriptionNew: false,
        hospitalPort: false,
        couponCount: 0,
        hadCoupon: true
      }
    },
    computed: mapState({
      userId (state) {
        if (state.userId === '') {
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
        }
        return state.userId
      },
      header (state) {
        if (state.header === '') {
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
        }
        return state.header
      },
      firstName (state) {
        if (state.firstName === '') {
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
        }
        return state.firstName
      },
    }),
    activated () {
      console.log(1)
      this.$store.commit('changePageType', 'main-page');
      this.userInfo = {
        avatarUrl: '',
        nickName: this.firstName
      }
      this.getInfo();
    },
    methods: {
      getInfo () {
        this.getPrescriptionInfo();
        this.getInquisitionInfo();
        this.getCouponInfo();
      },
      getPrescriptionInfo () {
        const url = `${this.$conf.url}/internethospital/api/orders/prescriptions?user-id=${this.userId}&page-index=1&page-size=100`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          if (res.data.content && res.data.content.find(c => (c.orderTypeCode === 'PRESCRIPTION' && c.statusCode === 'SIGNED') || (c.orderTypeCode ==='E_PRESCRIPTION' && c.statusCode === 'AUDITED'))) {
            this.prescriptionNew= true
          }
        })
      },
      getInquisitionInfo () {
        const url = `${this.$conf.url}/internethospital/api/orders/consultations?user-id=${this.userId}&page-index=1&page-size=100`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          if (res.data.content && res.data.content.find(c => c.statusCode === 'CREATED')) {
            this.inquisitionNew= true
          }
        })
      },
      getCouponInfo () {
        const url = `${this.$conf.url}/internethospital/api/inventories/coupons?user-id=${this.userId}&page-index=1&page-size=1000`;
        this.$axios.post(url, {}, {headers: this.header}).then(res => {
          let enableCoupon = res.data.content.filter(c => c.status === 'AVAILABLE');
          this.couponCount = enableCoupon.length;
        })
      },
      jumpTo (route) {
        this.$store.commit('changePageType', 'package-page');
        this.$router.push(`/${route}`);
      }
    }
  }
</script>

<style scoped lang="scss">
  @function vm($px) {
    @return ($px / 750) * 100vw;
  }

  .header{
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGUAAADSCAYAAADjan2AAAAgAElEQVR4Xu3dWY9l13ne8edd+0w1dXU1q0c2yeYgUmxSsmTKgzxBimJfBAoCI1BfBUacG14ln4HfIVcMkDjwldNEEgQxEsBJRMEWLMeWLJkimyLNoZvsuYpdXV3TmfZ6gnWKokRFMtlkd+8a/hs4OFXV5+x3rd9+ecEHe60dR/7TpsWBAAIIIIAAAggggAACCCCAAAIIIHBPBYJQ5p56UwwBBBBAAAEEEEAAAQQQQAABBBCYCBDK0AgIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBAAAEEEEAAAUIZegABBBBAAAEEEEAAAQQQQAABBBBoQIBQpgF0SiKAAAIIIIAAAggggAACCCCAAAKEMvQAAggggAACCCCAAAIIIIAAAggg0IAAoUwD6JREAAEEEEAAAQQQQAABBBBAAAEECGXoAQQQQAABBBBAAAEEEEAAAQQQQKABAUKZBtApiQACCCCAAAIIIIAAAggggAACCBDK0AMIIIAAAggggAACCCCAAAIIIIBAAwKEMg2gUxIBBBBAAAEEEEAAAQQQQAABBBAglKEHEEAAAQQQQAABBBBAAAEEEEAAgQYECGUaQKckAggggAACCCCAAAIIIIAAAgggQChDDyCAAAIIIIAAAggggAACCCCAAAINCBDKNIBOSQQQQAABBBBAAAEEEEAAAQQQQIBQhh5AAAEEEEAAAQQQQAABBBBAAAEEGhAglGkAnZIIIIAAAggggAACCCCAAAIIIIAAoQw9gAACCCCAAAIIIIAAAggggAACCDQgQCjTADolEUAAAQQQQAABBBBA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');
    background-size: 100% vm(140);
    background-repeat: no-repeat;
    background-color: #ffffff;
    padding-bottom: vm(140);
  }
  .header::before{
    content: '';
    display: table
  }
  .header>img{
    display: block;
    width: vm(140);
    height: vm(140);
    margin: 2.66vw auto 1.33vw;
    border: #ffffff 0.8vw solid;
    border-radius: 50%;
  }
  .header>span{
    display: block;
    width: 100%;
    text-align: center;
    font-size: 4.26vw;
    color: #333333;
  }

  .function-list li{
    position: relative;
    display: block;
    border-bottom: #e2e2e2 vm(1) solid;
    padding: vm(26) vm(30);
    background-color: #ffffff;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAACN0lEQVR4Xu3av0pDMRgF8C/3VqGDqIvg6qBYoY4XX0BddOwj6CwULIK0durUXV/BxdlREV18ARcFN10UQbDtTeT6BxRuWyE2OYHTuU2bX89J4WuU8DFQQNFnsACBhiSEQASyO0SYICaICbITYILs/HgGMUFMkJ0AE2TnxzOICWKC7AQQErS1dTg2NfMwl32W20J6e9xodEa6q39c3MkZVK3Xy5JGayISmYK5TEqli0qlkv7jPka2lBug/WYiyqyKSGyM6mmdnq4sL12HgOQEaLfVmuy+vq1HIovZV50hSazPJkSuGuB1cwKUoey028X4+XlDTFT66IOWrinE50lpHrpuzoC+kQpPL5vaqAWlTBRC3ZwCZUi1Wm06HS+umkDq5hwotLp5AQqpbt6AQqmbV6AQ6uYdCL1uEEDIdYMBQq0bFBBi3eCA0OoGCYRUN1gglLpBA/Wtm9ZnL4+zl0dH292RTcq+FoYHyqubMerVROlJ++DghkA5syQC/YhF7niEFfsUyqaQvgdssGdQ/ojWnLv+RwQSCGnqCAeEUKufv4xQQCi1ggRCqhUcEFqtoIAQawUDhForCCDkWnkHQq+VV6AQauUNKJRaeQEKqVbOgXiBashYr9psJtLjFby+TNW9elmiaE0ppbTWV8kyL3H+wvq+BtyLY3OvOne8BjzqSbrD9aHGHQ73/ee3ItAQKgIR6M9tyn0iE8QEMUF2AkyQnR/PICaICbITYILs/HgGMUFMkJ3AkFe/A5eMGGfm7a/3AAAAAElFTkSuQmCC');
    background-size: vm(48);
    background-repeat: no-repeat;
    background-position: right vm(20) center;
  }
  .function-list li::after{
    content: '';
    display: block;
    clear: both;
  }
  .function-list li:last-child{
    border-bottom: none;
  }
  .function-list li>img{
    width: vm(36);
    height: vm(36);
    margin-right: vm(20);
  }
  .function-list li>span, .function-list li>div{
    font-size: vm(30);
    color: #333333;
    vertical-align: middle;
  }
  .function-list li>div>span{
    font-size: vm(20);
    color: #999999;
  }
  .function-list li>span.right{
    margin-right: vm(50);
    color: #999999;
    font-size: vm(30);
  }
  .function-list li.new>span:last-child{
    position: absolute;
    display: block;
    width: vm(20);
    height: vm(20);
    border-radius: 50%;
    background-color: #FF624D;
    right: vm(80);
    top: vm(35);
  }
  .function-list.manager{
    margin-top: vm(20);
  }
  .function-list.service{
    margin-top: vm(20);
  }
  .noticeText{
    display: block;
    width: 80vw;
    margin: vm(20) auto;
    text-align: center;
    font-size: vm(22);
    color: #A7BBBF;
    line-height: vm(40);
  }
</style>
