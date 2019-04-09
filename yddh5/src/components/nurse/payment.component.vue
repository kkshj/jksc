<template>
  <div class="page">
    <div class="scrolled">
      <div class='doctor_top'>
        急重症患者请到就近医院就诊，或直接拨打120！
      </div>
      <div class='section' v-if='nurseInfo'>
        <div class='nurseInfo'>
          <div class='infoBox'>
            <img :src='nurseInfo.nurseAvatar' class='left'>
            <div class='left'>
              <div>
                <span>{{nurseInfo.nurseName}}</span>
                <span>{{nurseInfo.positionalTitleText ? nurseInfo.positionalTitleText : nurseInfo.standPositionalTitleText}}</span>
              </div>
              <div><span>{{nurseInfo.organizationText}}</span><span>{{nurseInfo.departmentText}}</span></div>
              <div><span>￥{{nurseInfo.services[0].price ? nurseInfo.services[0].price : 0}}/次</span></div>
            </div>
          </div>
        </div>
        <div class='middel-part'>
          <div @click='changePatient'>
            <span class='left'>就诊人</span>
            <span class='right'>{{ patient ? patient.name : '请选择'}}</span>
          </div>
          <div class='price'>
            <span class='left'>付款金额</span>
            <span class='right'>￥{{nurseInfo.services[0].price ? nurseInfo.services[0].price : 0}}</span>
          </div>
        </div>
        <div v-if='!hospitalPort && hadCoupon' class='middel-part'>
          <div class='coupon' @click='choseCoupon'>
            <span class='left'>使用优惠券</span>
            <span class='right' :class='useThisCoupon ? useThisCoupon.amount === 0 ? "gray" : "" : ""'>{{useThisCoupon ? useThisCoupon.amount === 0 ? '此订单未使用优惠券' : '-￥' + useThisCoupon.amount : couponCount + '张可用'}}</span>
          </div>
        </div>
        <div class='notice'>
          <span>问诊须知</span>
          <span>1. 急重症患者不适合网上诊疗和咨询，请及时前往医院就诊；\n2. 发起问诊后，24小时内医生未回复，订单费用将全额退回；\n3.请在医生回复后24小时内完成问诊。</span>
        </div>
        <div class='docotr_notice'>
          <span>问诊须知\n</span>
          <span>1. 提问成功后，若医生在24小时内未回复，订单费用将在5个工作日内退回；
    2. 医生回复后，单次服务有效时间为24小时；
    3.问诊过程中，医生可能由于手术、出诊等情况暂时离开，您可继续提出有效问题，医生会抽空为您解答。
    </span>
        </div>
        <div class='pay-type'>
          <li>
            <img class='left' src='static/images/weChetPay.png'>
            <span class='left'>微信支付</span>
            <img class='left' src='static/images/chosen.png'>
    </li>
        </div>
        <div class='server-clause' @click='agreeClause'>
          <img v-if='!choose' class='left' src='static/images/input-unchoose.png'>
          <img v-if='choose' class='left' src='static/images/input-choose.png'>
          <div class='left text'>我已阅读并同意<span @click='checkClause'>《互联网医院网络门诊问诊须知》</span></div>
        </div>
        <div class='pay-box'>
          <div class='left text'>实付<span>￥{{amount || 0}}</span></div>
          <button class='left' @click='gotToPay'>立即支付</button>
        </div>
      </div>
    </div>
    <div v-if='alert' class='alert' @click='closeAlert'>
      <div>
        <button v-for='(item,index) in patients' data-id='item.id' @click='changePatients(item.id)'><span>{{item.name}}</span></button>
      </div>
      <button @click='getToAddPatient'>添加就诊人</button>
    </div>
    <div v-if='visAlert' class='alert vis' @click='closeAlert'>
      <div>
        <button v-for='(item,index) in visTypeArr' data-id='item.id' @click='changeVisit'><span>{{item.type}}</span></button>
      </div>
    </div>
    <div :class="clauseShow ? 'show' : ''" class="clause" @click='closeAlert'>
      <div>
        <div>
          <span>互联网医院网络门诊\n问诊须知</span>
          <span>一、服务内容：\n互联网医院网络门诊是将各医院优质医疗资源整合到平台，为患者提供线上问诊服务，在线开具电子处方，药品配送到家的闭环式互联网诊疗服务。\n网络门诊旨在给您更好的就医服务体验：\n① 随时随地挂号问诊；\n②  汇聚川内各大型医院专家医师；\n③ 通过手机即可实现视频问诊；\n④  在线购药，药品配送到家；\n\n二、服务流程：\n①选择医院医生—＞填写个人问诊资料—＞支付挂号费用—＞医生接诊—＞问诊结束—＞查看诊断建议（电子处方）—＞在线支付药费—＞药品配送到家。\n②选择医院医生—＞填写个人问诊资料—＞支付挂号费用—＞医生接诊—＞问诊结束—＞查看诊断建议（检验检查申请）—＞绑定就诊卡—＞到指定医院付费做检查。\n\n三、注意事项：\n①  填写患者就诊资料时，应真实、详细、准确，便于医生诊断；\n②  问诊过程中确保手机网络正常；\n③ 等待接诊时应授权同意“互联网医院”应用，后台运行和提醒；\n④ 问诊有效时长为24小时，介于医生工作性质特殊，有时无法立即回复，请您耐心等待；\n\n四、免责说明：\n① 急诊患者请到就近医院就诊，或直接拨打120；\n② 初诊患者请到实体医院就诊；\n③  低龄儿童（6岁以下）在使用本平台在线问诊时，须有监护人和相关专业医师陪伴。\n本平台为常见病、慢性病的复诊患者提供正规实体医疗机构线上问诊服务，患者问诊时须按医生要求提供真实、详细、准确的病情资料和检验检查资料，以便于医生诊断，医生依据上述资料予以诊断。如因患者提供不实的信息和资料，导致的医疗风险将完全由用户承担；如果用户自行治疗或未完全遵循医嘱自服药品出现问题，本平台运营方和医疗机构不承担任何责任。\n\n五：客服电话：\n平台客服电话：400-800-1335
</span>
        </div>
        <div>
          <button @click='dontDo'>不接受</button>
          <button @click='accept'>接受</button>
        </div>
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
      message: '',
      load_show: false,
      notice_show: '',
      nurseInfo: null,
      patients: [],
      patient: null,
      alert: false,
      choose: false,
      clauseShow: false,
      visTypeArr: [],
      visAlert: false,
      visType: null,
      getUserInfo: false,
      typeCode: '',
      proId: '',
      orderId: '',
      orderHeaderId: '',
      amount: 0,
      couponCount: 0,
      useThisCoupon: null,
      hospitalPort: false,
      hadCoupon: true,
      createdPatient: false
    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  beforeRouteLeave(to, from, next) {
  let payment=/payment/g
  let chat=/chat/g
  let doctor=/doctor/g
  console.log(55)
    if (doctor.exec(to.path)||payment.exec(to.path)||chat.exec(to.path)) {
      console.log(77)
      localStorage.removeItem('useThisCoupon')
      this.$destfroy()
    }
    next();
  },
  computed: mapState({
    //方式一：箭头函数
    openId(state) {
      if (state.openId === '' && JSON.parse(localStorage.getItem('loginInfo'))) {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.openId
    },
    // authorizations(state) {
    //   if (state.authorization === '') {
    //     this.$store.commit('setAuthorization', JSON.parse(localStorage.getItem('authorizationInfo')));
    //   }
    //   return state.authorization
    // },
    hospitalId(state) {
      if (state.hospitalId === '' && JSON.parse(localStorage.getItem('hospitalInfo'))) {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalId
    },
    hospitalPorts(state) {
      if (state.hospitalPort === '' && JSON.parse(localStorage.getItem('hospitalInfo'))) {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalPort
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
  activated() {
    let params = this.$route.query
    console.log(params)
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      if (this.createdPatient) {
        this.changePatient();
      }
       let useThisCoupon =JSON.parse(localStorage.getItem('useThisCoupon'))
      if (useThisCoupon) {
        this.useThisCoupon = useThisCoupon
        const timer = setInterval(() => {
          if (useThisCoupon) {
            this.confirmPrice(useThisCoupon.couponProductId)
            clearInterval(timer)
          }
        }, 1000)
      }
      if (this.hospitalPort) {
        this.hospitalPort = true
      }
      if (params.orderHeaderId) {
        console.log(params.orderHeaderId)
        this.orderHeaderId = params.orderHeaderId
        this.getOrderInfo(params.orderHeaderId);
      } else {
        this.typeCode = params.type
        this.proId = params.proId
        this.getFirstInfo(params.id);
      }
    },

    getFirstInfo(id) {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/nurses/${id}`;
      this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
        console.log(res);
        if (res.status >= 200 && res.status <= 399) {
          let serverIdx = res.data.services.indexOf(res.data.services.find(ser => ser.code === 'CONSULT_FREE' && ser.inventoryQuantity > 0));
          if (serverIdx >= 0) {
            res.data.services[0] = [res.data.services[serverIdx], res.data.services[serverIdx] = res.data.services[0]][0];
          } else {
            serverIdx = res.data.services.indexOf(res.data.services.find(ser => ser.code === 'CONSULT'));
            if (serverIdx > 0) {
              res.data.services[0] = [res.data.services[serverIdx], res.data.services[serverIdx] = res.data.services[0]][0];
            }
          }
          if (res.data.organizationText.length > 11) {
            res.data.organizationText = res.data.organizationText.slice(0, 11) + '...'
          }
          if (!res.data.nurseAvatar) {
            res.data.nurseAvatar = 'static/images/defualt-header.png';
          } else {
            res.data.nurseAvatar = `${res.data.nurseAvatar}-doctor_list`
          }

          if (res.data.services[0] && res.data.services[0].price && res.data.services[0].price.toString().indexOf('.') < 0) {
            res.data.services[0].price = '' + res.data.services[0].price + '.00'
          } else if (res.data.services[0] && res.data.services[0].price && (res.data.services[0].price.toString().slice(res.data.services[0].price.toString().indexOf('.') + 1).length !== 2)) {
            res.data.services[0].price = '' + res.data.services[0].price + '0';
          }
          me.nurseInfo = res.data
          me.amount = res.data.services[0].price
          this.getCouponInfo();
        } else {
          this.notice_show = `${res.data.message}`
          setTimeout(() => {
            this.notice_show = ''
            this.$router.back()
          }, 2000)
        }
      }).catch(err => {
        this.notice_show = `链接出错，请检查网络链接`
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      })
      // if (!this.authorizations) {
      //     me.getUserInfo=true
      // }
    },
    getOrderInfo(id) {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/orders/consultations?user-id=${this.userId}&page-index=1&page-size=10000`;
      this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
        if (res.status >= 200 || res.status <= 399) {
          let content = res.data.content.find(c => c.orderHeaderId === id);
          console.log(content);
          if (!content.nurseAvatar) {
            content.nurseAvatar = 'static/images/defualt-header.png';
          }
          if (content && content.amount && content.amount.toString().indexOf('.') < 0) {
            content.amount = '' + content.amount + '.00'
          } else if (content && content.amount && (content.amount.toString().slice(content.amount.toString().indexOf('.') + 1).length !== 2)) {
            content.amount = '' + content.amount + '0';
          }
          let nurseInfo = {
            nurseAvatar: content.nurseAvatar,
            nurseName: content.nurseName,
            departmentText: content.departmentText,
            organizationText: content.organizationText,
            services: [
              { price: content.originalAmount }
            ]
          }
          me.nurseInfo = nurseInfo
          me.patient = {
            name: content.patientName
          }
          me.visType = {
            type: content.reExamination ? '复诊' : '初诊'
          }
          me.amount = content.amount
          me.choose = true
          content.coupontAmount = content.coupontAmount ? content.coupontAmount.toString().replace('-', '') : 0;
          me.useThisCoupon = {
            amount: content.coupontAmount
          }

        } else {
          this.notice_show =  `${res.data.message || res.data}`
          setTimeout(() => {
            this.notice_show = ''
            this.$router.back()
          }, 2000)
        }
      }).catch(err => {
        this.notice_show = `链接出错，请检查网络链接`
        setTimeout(() => {
          this.notice_show = ''

        }, 2000)
      })

    },
    getCouponInfo() {
      if (this.hadCoupon) {
        const url = `${this.$conf.url}/internethospital/api/inventories/coupons?user-id=${this.userId}&page-index=1&page-size=10000`;
        this.$axios.post(url, {}, { headers: this.$store.state.header }).then(res => {
          let enableCoupon = res.data.content.filter(c =>
            c.status === 'AVAILABLE' &&
            (c.departmentId ?
              c.departmentId === this.nurseInfo.departmentId :
              (c.organizationId ?
                c.organizationId === this.nurseInfo.organizationId :
                true)
            )
          );
          console.log(enableCoupon.length)
          this.couponCount = enableCoupon.length

        })
      }
    },
    choseCoupon() {
      if ((this.amount > 0 || !this.amount) && this.couponCount > 0 && !this.orderHeaderId) {
        const url = `/coupon/chose?organizationId=${this.nurseInfo.organizationId}&departmentId=${this.nurseInfo.departmentId}`
        this.$router.push(url)
      }
    },
    confirmPrice(couponProductId) {
      const url = `${this.$conf.url}/internethospital/api/orders/consultations/price`;
      let data = {
        couponProductId: couponProductId,
        nurseId: this.nurseInfo.nurseId,
        departmentId: this.nurseInfo.departmentId,
        orderTypeCode: this.nurseInfo.services[0].code,
        organizationId: this.nurseInfo.organizationId,
        productId: this.nurseInfo.services[0].id
      }
      this.$axios.post(url, data, { headers: this.$store.state.header }).then(res => {
        this.amount = res.data
        console.log(res);
      }).catch(err => {
        this.notice_show = err.data.message
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      })
    },
    gotToPay() {
      const me = this;
      if (this.orderHeaderId) {
        if (me.nurseInfo.services[0].free || (me.amount === 0)) {
          // wx.hideLoading();
          this.notice_show = '创建订单成功'
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
          me.disciount(this.orderHeaderId)
        } else {
          me.pay(this.orderHeaderId)
        }
        return;
      }
      if (this.patient && this.choose) {
        const url = `${this.$conf.url}/internethospital/api/orders/consultations`
        const data = {
          'nurseId': this.nurseInfo.nurseId,
          'orderTypeCode': this.typeCode,
          'patientId': this.patient.id,
          'productId': this.proId,
          'userId': this.userId
        }
        if (this.useThisCoupon) {
          data.couponId = this.useThisCoupon.couponId
        }
        this.$axios.post(url,data, { headers: this.$store.state.header }).then(res => {
          console.log(res);
          if (res.status >= 200 && res.status <= 399) {
            if (me.nurseInfo.services[0].free || (me.amount === 0)) {
              // wx.hideLoading();
              me.load_show = true
              this.notice_show = '创建订单成功'
              setTimeout(() => {
                this.notice_show = ''
              }, 2000)
              me.disciount(res.orderHeaderId)
            } else {
              me.pay(res.orderHeaderId)
            }
          } else {
            me.load_show = false
            this.notice_show = `${res.data.message || res.data}`
            setTimeout(() => {
              this.notice_show = ''
            }, 2000)
          }
        }).catch(err => {
          this.notice_show = '链接出错，请检查网络链接'
          setTimeout(() => {
            this.notice_show = ''

          }, 2000)
        })

      } else {
        if (!this.patient) {
          this.notice_show = '请选择就诊人'
          setTimeout(() => {
            this.notice_show = ''

          }, 2000)
        } else {
          this.notice_show = '请确认服务条款'
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
        }
      }
    },
    // 有优惠券调用
    disciount(orderHeaderId) {
      const urlperson = `${this.$conf.url}/internethospital/api/orders/consultations?order-header-id=${orderHeaderId}&page-index=1&page-size=1`
      this.$axios.get(urlperson, { headers: this.$store.state.header }).then(res => {
        console.log(res)
        const urlchat = `/chat/${res.content[0].orderHeaderId}`;
        setTimeout(()=> {
          this.$router.push(urlchat)
        }, 1500);
      })
    },
    pay(orderHeaderId) {
      const urlPay = `${this.$conf.url}/internethospital/api/orders/${orderHeaderId}/pay-infors/wechat?open-id=${this.openId}`;
      this.$axios.post(urlPay, {}, { headers: this.$store.state.header }).then(res => {
        this.load_show=false;
      }).catch(err => {
        this.load_show=false;
        console.log(err);
      })
      // wx.hideLoading();
      // const urlPay = `${conf.url}/internethospital/api/orders/${orderHeaderId}/pay-infors/wechat?open-id=${app.globalData.openId}`;
      // wx.request({
      //   url: urlPay,
      //   method: 'POST',
      //   header: { 'Authorization': 'Bearer ' + app.globalData.token },
      //   success: res => {
      //     console.log(res.data);
      //     if (res.statusCode >= 200 && res.statusCode <= 399) {
      //       wx.requestPayment({
      //         'timeStamp': res.data.timeStamp,
      //         'nonceStr': res.data.nonce_str,
      //         'package': `prepay_id=${res.data.prepay_id}`,
      //         'signType': 'HMAC-SHA256',
      //         'paySign': res.data.paySign,
      //         'success': res => {
      //           wx.showToast({
      //             icon: 'success',
      //             title: '支付成功',
      //           });
      //           me.disciount(orderHeaderId)
      //         },
      //         'fail': err => {
      //           console.log(err);
      //           if (err.errMsg === 'requestPayment:fail cancel') {
      //             wx.showToast({
      //               icon: 'none',
      //               title: '支付取消',
      //             })
      //           } else {
      //             wx.showToast({
      //               icon: 'none',
      //               title: '支付失败',
      //             })
      //           }
      //         }
      //       })
      //     } else {
      //       wx.showToast({
      //         icon: 'none',
      //         title: '获取支付信息失败，请稍后再试',
      //         duration: 2000
      //       })
      //       setTimeout(() => {
      //         wx.navigateBack();
      //       }, 2000)
      //     }
      //   },
      //   fail: err => {
      //     wx.showToast({
      //       icon: 'none',
      //       title: '链接出错，请检查网络链接',
      //       duration: 2000
      //     })
      //   }
      // })
    },
    notNow() {
      this.getUserInfo = false
      this.$router.push('/home')

    },
    makeChoise(e) {
      console.log(e.detail.userInfo);
      if (!e.detail.userInfo) {

        this.getUserInfo = false
        this.$router.push('/home')

      } else {
        this.getUserInfo = false
        this.$store.commit('setAuthorization', true)
        this.$store.commit('setUserInfo', e.detail.userInfo)
        this.$router.push('/register-login')
      }
    },
    dontDo() {
      this.clauseShow = false
      this.choose = false
    },
    accept() {
      this.choose = true
      this.clauseShow = false
    },
    checkClause() {
      if(!this.orderHeaderId){
        this.clauseShow = true
      }
      
    },
    changeVis() {
      if (!this.orderHeaderId) {
        this.visAlert = true
        this.visTypeArr = [
          { id: 1, type: '初诊' },
          { id: 2, type: '复诊' }
        ]
      }
    },
    changePatient() {
      if (!this.orderHeaderId) {
        this.alert = true
        const me = this;
        const url = `${this.$conf.url}/internethospital/api/patients?user-id=${this.userId}&page-index=1&page-size=100`;
        this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
          console.log(res);

            this.patients = res.data.content
        }).catch(err => {
          this.notice_show =  err.response.data.message
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
        })
      }
    },
    agreeClause() {
    if(!this.orderHeaderId){
      this.choose = !this.choose
    }
      
    },
    changePatients(id) {
      console.log(id);
      const patient = this.patients.find(p => p.id === id);
      this.patient = patient
      this.closeAlert();
    },

    closeAlert() {
      this.alert = false
      this.visAlert = false
      this.clauseShow = false
    },
    getToAddPatient() {
      this.createdPatient = true
      this.$router.push('/patient/edit')
    }

  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}

.section {
  height: 105vh;
  background-color: #eff5f8;
}

.nurseInfo {
  box-sizing: border-box;
  width: 100vw;
  padding-bottom: vm(30);
  background-color: #ffffff;
  margin-bottom: vm(20);
  overflow-x: hidden;
}

.nurseInfo>div.infoBox {
  padding: vm(30) vm(30) 0;
}

.nurseInfo>div.infoBox::after {
  content: '';
  display: block;
  clear: both;
}

.nurseInfo>div.infoBox>img.left {
  width: vm(120);
  height: vm(120);
  margin-right: vm(20);
  border-radius: 50%;
}

.nurseInfo>div.infoBox>div.left>div:first-child {
  margin-top: vm(8);
}

.nurseInfo>div.infoBox>div.left>div:first-child>span:first-child {
  font-size: vm(40);
  font-weight: bold;
  color: #333333;
}

.nurseInfo>div.infoBox>div.left>div:first-child>span:last-child {
  display: inline-block;
  height: vm(32);
  text-align: center;
  vertical-align: middle;
  font-size: vm(26);
  padding: 0 vm(10);
  color: #B4B4B4;
  border-radius: vm(16);
  margin-left: vm(14);
}

.nurseInfo>div.infoBox>div.left>div:nth-child(2) {
  height: vm(30);
  line-height: vm(30);
  margin-top: vm(18);
  margin-bottom: vm(30);
}

.nurseInfo>div.infoBox>div.left>div:nth-child(2)>span {
  font-size: vm(28);
  color: #666666;
  margin-right: vm(10);
}

.nurseInfo>div.infoBox>div.left>div:last-child>span {
  font-size: vm(26);
  color: #999999;
}

.middel-part {
  background-color: #ffffff;
  margin-bottom: vm(20);
}

.middel-part>div {
  box-sizing: border-box;
  padding: vm(30);
  font-size: vm(30);
  padding-right: vm(14);
  color: #333333;
}

.middel-part>div::after {
  content: '';
  display: block;
  clear: both;
}

.middel-part>div:first-child {
  border-bottom: #e2e2e2 1px solid;
}

.middel-part>div>span:last-child {
  color: #999999;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAACN0lEQVR4Xu3av0pDMRgF8C/3VqGDqIvg6qBYoY4XX0BddOwj6CwULIK0durUXV/BxdlREV18ARcFN10UQbDtTeT6BxRuWyE2OYHTuU2bX89J4WuU8DFQQNFnsACBhiSEQASyO0SYICaICbITYILs/HgGMUFMkJ0AE2TnxzOICWKC7AQQErS1dTg2NfMwl32W20J6e9xodEa6q39c3MkZVK3Xy5JGayISmYK5TEqli0qlkv7jPka2lBug/WYiyqyKSGyM6mmdnq4sL12HgOQEaLfVmuy+vq1HIovZV50hSazPJkSuGuB1cwKUoey028X4+XlDTFT66IOWrinE50lpHrpuzoC+kQpPL5vaqAWlTBRC3ZwCZUi1Wm06HS+umkDq5hwotLp5AQqpbt6AQqmbV6AQ6uYdCL1uEEDIdYMBQq0bFBBi3eCA0OoGCYRUN1gglLpBA/Wtm9ZnL4+zl0dH292RTcq+FoYHyqubMerVROlJ++DghkA5syQC/YhF7niEFfsUyqaQvgdssGdQ/ojWnLv+RwQSCGnqCAeEUKufv4xQQCi1ggRCqhUcEFqtoIAQawUDhForCCDkWnkHQq+VV6AQauUNKJRaeQEKqVbOgXiBashYr9psJtLjFby+TNW9elmiaE0ppbTWV8kyL3H+wvq+BtyLY3OvOne8BjzqSbrD9aHGHQ73/ee3ItAQKgIR6M9tyn0iE8QEMUF2AkyQnR/PICaICbITYILs/HgGMUFMkJ3AkFe/A5eMGGfm7a/3AAAAAElFTkSuQmCC');
  background-repeat: no-repeat;
  background-size: vm(48);
  background-position: right center;
  padding-right: vm(50);
}

.middel-part>.price>span:last-child {
  background-image: none;
  padding-right: vm(20);
  color: #333333;
}

.middel-part>.coupon>span:last-child {
  color: #FF624D;
}

.middel-part>.coupon>span:last-child.gray {
  color: #B4B4B4;
}

/* .middel-part>view:last-child{
  padding: 0 30rpx 30rpx;
  font-size: 26rpx;
  color: #B4B4B4;
} */

.price {
  background-color: #ffffff;
  margin-bottom: vm(20);
  box-sizing: border-box;
  padding: vm(30);
  font-size: vm(30);
  color: #333333;
}

.price::after {
  content: '';
  display: block;
  clear: both;
}

.price>span:last-child {
  color: #FF624D;
}

.notice {
  padding: vm(30);
  background-color: #ffffff;
  margin-bottom: vm(20);
}

.notice>span {
  display: block;
}

.notice>span:first-child {
  font-size: vm(30);
  color: #333333;
}

.notice>span:last-child {
  font-size: vm(26);
  color: #999999;
  margin-top: vm(20);
}

.pay-type {
  margin-bottom: vm(20);
  background-color: #ffffff;
}

.pay-type>li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: vm(88);
  box-sizing: border-box;
  padding: vm(20) vm(30);
}

.pay-type>li>img {
  width: vm(48);
}

.pay-type>li>span {
  flex-grow: 1;
  font-size: vm(30);
  margin-left: vm(20);
  color: #333333;
  line-height: vm(48);
}

.server-clause {
  margin-bottom: vm(200);
}

.server-clause::after {
  content: '';
  display: block;
  clear: both;
}

.server-clause>img {
  width: vm(48);
  margin-left: vm(30);
}

.server-clause>.text {
  line-height: vm(48);
  color: #999999;
  font-size: vm(26);
}

.server-clause>.text>span {
  color: #16A9F6;
}

.pay-box {
  position: fixed;
  bottom: 0;
  height: vm(98);
}

.pay-box>.text {
  width: 40vw;
  box-sizing: border-box;
  line-height: vm(98);
  padding-left: vm(30);
  font-size: vm(26);
  background-color: #ffffff;
}

.pay-box>.text>span {
  font-size: vm(36);
  color: #FF624D;
}

.pay-box>button {
  width: 60vw;
  height: vm(98);
  background-color: #16A9F6;
  color: #ffffff;
  line-height: vm(98);
  text-align: center;
  font-size: vm(36);
}

.alert {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .3);
}

.alert button {
  display: block;
  width: 100vw;
  height: vm(88);
  background-color: #ffffff;
  text-align: center;
  line-height: vm(88);
  color: #666666;
  font-size: vm(30);
}

.alert button:active {
  background-color: #f5f5f5;
}

.alert>button {
  position: absolute;
  bottom: 0;
  color: #2FBFF7;
}

.alert>div {
  max-height: vm(352);
  position: absolute;
  bottom: vm(88);
  overflow-y: scroll;
  border-bottom: #e2e2e2 1px solid;
}

.alert>div>button>span {
  display: inline-block;
  width: vm(200);
  border-bottom: #f0f0f0 1px solid;
}

.alert>div>button:last-child>span {
  border-bottom: none;
}

.alert.vis>div {
  height: vm(176);
  bottom: 0;
}

.clause {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .3);
}

.clause.show {
  display: block;
}

.clause>div {
  position: absolute;
  left: vm(50);
  right: vm(50);
  top: vm(50);
  bottom: vm(50);
  border-radius: vm(8);
  background-color: #ffffff;
  overflow: hidden;
}

.clause>div>div:last-child {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
}

.clause>div>div>text {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding-top: vm(40);
  text-align: center;
  font-size: vm(32);
  color: #666666;
}

.clause>div>div>span:last-child {
  font-size: vm(28);
  color: #999999;
  padding: vm(30);
  text-align: left;
  position: absolute;
  bottom: 10vw;
  top: 18vw;
  overflow-y: scroll;
}

.clause>div>div>button {
  width: 50%;
  height: 10vw;
  border-radius: 0;
  border-top: 1px solid #e3e3e3;
  font-size: vm(30);
  line-height: 10vw;
  background-color: #ffffff;
}

.clause>div>div>button:last-child {
  color: #16A9F6;
}

.clause>div>div>button::after {
  border: none;
}

.doctor_top {
  color: #666;
  font-size: vm(26);
  padding-left: vm(20);
  height: vm(60);
  line-height: vm(60);
  background: rgba(255, 242, 184, 1);
}

.docotr_notice {
  padding: vm(30);
  height: vm(290);
  margin-bottom: vm(20);
  background: rgba(255, 255, 255, 1);
}

.docotr_notice>span:first-child {
  font-size: vm(30);
  color: #333;
}

.docotr_notice>span {
  color: #999999;
  font-size: vm(26);
}

</style>
