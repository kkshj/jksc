<template>
  <div class="page">
    <div class="scrolled">
      <div class='docInfo' v-if='docInfo'>
        <div class='infoBox'>
          <img :src='docInfo.doctorAvatar' class='left'>
          <div class='left'>
            <div>
              <span>{{docInfo.doctorName}}</span>
              <span>{{docInfo.positionalTitleText ? docInfo.positionalTitleText : docInfo.standPositionalTitleText}}</span>
            </div>
            <div><span>{{docInfo.organizationText}}</span><span>{{docInfo.departmentText}}</span></div>
          </div>
        </div>
        <div class='docData'>
          <div class='left'>
            <span>{{docInfo.customerCount}}</span>
            <span>问诊量</span>
          </div>
          <div class='left'>
            <span>{{docInfo.follow}}</span>
            <span>关注数</span>
          </div>
          <div class='left'>
            <span>{{docInfo.comment}}</span>
            <span>评价数</span>
          </div>
        </div>
      </div>
      <div class='detail'>
        <div class='infomation-title'>
          <i class='left'></i><span class='left'>医生信息</span>
        </div>
        <div class='infomation'>
          <vue-markdown :source="longtext"></vue-markdown>
        </div>
        <div class='evaluate-title'>
          <i class='left'></i><span class='left'>患者评价</span>
        </div>
        <div class='evaluate'>
          <li v-for='(item,index) in evaluate' :key='item.id'>
            <img class='left' :src='item.userAvatar === "image" ? "static/images/default-header-person.png" : item.userAvatar || "static/images/default-header-person.png"'>
            <div class='left'>
              <div class='rate'>
                <span class="left" :class='item.rate >= 1 ? "full" : item.rate > 0 ? "half" : "none"'></span>
                <span class="left" :class='item.rate >= 2 ? "full" : item.rate > 1 ? "half" : "none"'></span>
                <span class="left" :class='item.rate >= 3 ? "full" : item.rate > 2 ? "half" : "none"'></span>
                <span class="left" :class='item.rate >= 4 ? "full" : item.rate > 3 ? "half" : "none"'></span>
                <span :class='item.rate === 5 ? "full" : item.rate > 4 ? "half" : "none"' class="left"></span>
                <!-- <text class='left'>{{item.rate}}</text> -->
              </div>
              <span class='content'>{{item.evaluation}}</span>
              <div class='eavlInfo'>
                <span>{{item.username}}</span>
                <span>{{item.createdDate}}</span>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
    <div class='main-btn' v-if='docInfo'>
      <button v-if='!hadFollow' :data-id='docInfo.doctorId' class='left' @click='followDoc(docInfo.doctorId)'>
        <img src='static/images/follow.png'>
        <span>关注TA</span>
      </button>
      <button v-if='hadFollow' :data-id='docInfo.doctorId' class='left' @click='defollowDoc(docInfo.doctorId)'>
        <img src='static/images/followed.png'>
        <span>已关注</span>
      </button>
      <button :data-id='docInfo.doctorId' class='left' @click='getToPay(docInfo.doctorId)'>{{docInfo.services[0].price ? '去问诊' : '去义诊'}}<span>（￥{{docInfo.services[0].price ? docInfo.services[0].price : 0}}/次）</span></button>
    </div>
    <!--  <div v-if='!hospitalPort && hadCoupon' :class="getUserInfo ? 'show' : ''" class="coupon-distribution">
      <img class='background' src='/static/images/coupon.png'>
      <div class='coupon-info'>
        <span>{{coupon.text}}</span>
        <div>￥<span>{{coupon.price}}</span></div>
        <button v-if='coupon.code && authorization' data-code='coupon.code' @click='receiveCoupon'>立即领取</button>
        <button v-else-if='coupon.code' open-type='getUserInfo' bindgetuserinfo='receiveCoupon'>立即领取</button>
        <button v-else open-type='getUserInfo' bindgetuserinfo='makeChoise'>立即使用</button>
      </div>
      <img class='close-button' src='/static/images/coupon-close.png' @click='notNow'>
    </div> -->
    <notice v-show='notice_show' :message="notice_show"></notice>
    <loading v-show='load_show'></loading>
  </div>
</template>
<script>
import NoticeDialog from '../notice-dialog.component'
import Notice from '../notice.component'
import Loading from '../loading.component'
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown' //直接作为一个组件引入
export default {
  data() {
    return {
      message: '',
      load_show: false,
      notice_show:'',
      docInfo: null,
      inquisition: '',
      detailType: 'INFO',
      evaluate: [],
      hadFollow: false,
      logedIn: false,
      getUserInfo: false,
      doctorcode: '',
      hospitalPort: false,
      hadCoupon: false,
      userInfo: '',
      add: false,
      longtext: '',
      id: '',
    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading,
    VueMarkdown // 声明组件
  },
  computed: mapState({
    //方式一：箭头函数
    // authorizations(state) {
    //   if (state.authorization === '') {
    //     this.$store.commit('setAuthorization', JSON.parse(localStorage.getItem('authorizationInfo')));
    //   }
    //   return state.authorization
    // },
    questing(state) {
      if (state.questing === '' && JSON.parse(localStorage.getItem('questing'))) {
        this.$store.commit('setQuesting', JSON.parse(localStorage.getItem('questing')));
      }
      return state.questing
    },
    hospitalPorts(state) {
      if (state.hospitalPort === '' && JSON.parse(localStorage.getItem('hospitalInfo'))) {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalPort
    },
    header(state) {
      if (state.header === ''&&JSON.parse(localStorage.getItem('loginInfo'))) {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.header
    },
    userInfos(state) {
      if (state.userInfo === '' && JSON.parse(localStorage.getItem('userInfo'))) {
        this.$store.commit('setUserInfo', JSON.parse(localStorage.getItem('userInfo')));
      }
      return state.userInfo
    },
    userId(state) {
      if (state.userId === ''&&JSON.parse(localStorage.getItem('loginInfo'))) {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.userId
    }
  }),
  activated() {
    let params = this.$route.params
    this.id = params.id
    console.log('fff', params.id)
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      // if (this.questing) {
      //   const url = `/login?pageType=doctorDetail&scene=${params.scene}`;
      //   this.$router.push(url)
      //   return;
      // }
      // if (!this.authorizations) {
      //   this.getUserInfo = true
      // } else {
      //   this.userInfo = this.userInfos
      // }
      if (params.scene) {
        this.doctorcode = params.scene
        this.getFirstInfo(params.scene);
        return;
      }
      this.doctorcode = params.id
      console.log(55)
      this.getFirstInfo(params.id);
      console.log(this.docInfo)
    },
    getFirstInfo(id) {
      const me = this;
      if (this.hospitalPorts) {
        me.hospitalPort = true
      }
      console.log(id)
          const urlD = `${me.$conf.url}/internethospital/api/doctors/${id}`;
          me.$axios.get(urlD).then(res => {
            console.log(res)
              let serverIdx = res.data.services.indexOf(res.data.services.find(ser => ser.code === 'CONSULT_FREE' && ser.inventoryQuantity && ser.inventoryQuantity > 0));
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
              if (!res.data.doctorAvatar) {
                res.data.doctorAvatar = 'static/images/defualt-header.png';
              } else {
                res.data.doctorAvatar = `${res.data.doctorAvatar}-doctor_list`;
              }

              let customerOrders = res.data.statistics.filter(s => s.scene === 'CONSULTATION' && s.orderTypeId == null);
              let customerCount = 0;
              for (let item of customerOrders) {
                customerCount += item.quantity
              }
              res.data.customerCount = customerCount;

              let follow = 0;
              if (res.data.statistics.find(s => s.type === 'FAVORITE')) {
                follow = res.data.statistics.find(s => s.type === 'FAVORITE').quantity;
              }
              res.data.follow = follow;

              let comment = 0;
              if (res.data.statistics.find(s => s.type === 'EVALUATION ')) {
                comment = res.data.statistics.find(s => s.type === 'EVALUATION ').quantity;
              }

              if (res.data.services[0] && res.data.services[0].price && res.data.services[0].price.toString().indexOf('.') < 0) {
                res.data.services[0].price = '' + res.data.services[0].price + '.00'
              } else if (res.data.services[0] && res.data.services[0].price && (res.data.services[0].price.toString().slice(res.data.services[0].price.toString().indexOf('.') + 1).length !== 2)) {
                res.data.services[0].price = '' + res.data.services[0].price + '0';
              }

              res.data.comment = comment;

              me.docInfo = res.data

              console.log(me.docInfo)
              me.longtext = res.data.longtext;
          }).catch(err => {
            this.notice_show = '链接出错，请检查网络链接'
            setTimeout(() => {
              this.notice_show = ''

            }, 2000)
          })

          const urlE = `${me.$conf.url}/internethospital/api/evaluations/?doctor-id=${id}&page-index=1&page-size=100000`;
          me.$axios.get(urlE).then(res => {
            console.log(res);
              for (let i in res.data.content) {
                res.data.content[i].rate = (res.data.content[i].promptness + res.data.content[i].attitude) / 2;
                if (!res.data.content[i].userAvatar) {
                  res.data.content[i].userAvatar = 'static/images/default-header-person.png'
                }
                console.log(res.data.content[i].username)
                if (res.data.content[i].purchaserName.length > 6) {
                  res.data.content[i].purchaserName = res.data.content[i].purchaserName.slice(0, 6) + '...';
                }
              }
              me.evaluate = res.data.content
          }).catch(err => {
            this.notice_show =err.response.data.message
            setTimeout(() => {
              this.notice_show = ''
            }, 2000)
          })
          if (me.userId) {
            const urlF = `${me.$conf.url}/internethospital/api/users/${me.userId}/favorites/doctors?page-index=1&page-size=10000`;
            me.$axios.get(urlF).then(res => {
              console.log(res);
              console.log(res.data.content.find(d => d.doctorId === id))
              if (res.data.content && res.data.content.find(d => d.doctorId === id)) {
                me.hadFollow = true
              } else {
                me.hadFollow = false
              }
            }).catch(err => {
              this.notice_show =err.response.data.message
              setTimeout(() => {
                this.notice_show = ''
              }, 2000)
            })
          }
  
    },
    changeInfoType(e) {
      this.detailType = e
    },
    followDoc(e) {
      const me = this
      console.log(this.userId)
      console.log(e)
      if (this.userId) {
        const url = `${this.$conf.url}/internethospital/api/users/${this.userId}/favorites`;
        const data = {
          'objectId': e,
          'type': 'DOCTOR'
        }
        this.$axios.post(url, data).then(res => {
            console.log(res)
            me.getFirstInfo(me.doctorcode)
  
        }).catch(err => {
          console.log(err)
        })

      } else {
        this.notice_show = '请先完成注册，即将为您跳转到注册页面'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.push('/register-login')
        }, 2000)

      }
    },
    defollowDoc(id) {
      console.log(this.userId)
      console.log(id)
      const me = this;
      if (this.userId) {
        const url = `${this.$conf.url}/internethospital/api/users/${this.userId}/favorites/doctors/${id}`;
        this.$axios.delete(url).then(res => {
            me.getFirstInfo(me.doctorcode)
        }).catch(err => {
          this.notice_show = err.response.data.message
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
        })

      } else {
        this.notice_show = '请先完成注册，即将为您跳转到注册页面'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.push('/register-login')

        }, 2000)

      }
    },
    notNow() {
      this.getUserInfo = false
    },
    makeChoise(userInfo) {
      if (!userInfo) {
        this.getUserInfo = false
        this.$router.push("/home")

      } else {
        this.getUserInfo = false
        this.$srote.commit('setAuthorization', true)
        // app.globalData.authorization = true;
        this.$srote.commit('setUserInfo', userInfo)
        // app.globalData.userInfo = e.detail.userInfo;
        this.$router.push('/register-login')
      }
    },
    getToPay(doctorId) {
      const me = this;
      console.log(this.userId)
      if (this.userId) {
        const orderUrl = `${this.$conf.url}/internethospital/api/orders/consultations?user-id=${this.userId}&doctor-id=${doctorId}&page-index=1&page-size=10`;
        this.$axios.get(orderUrl).then(res => {
          let content = res.data.content;
          console.log(res)
          if (res.data === "" || res.data.content.length === 0) {
            console.log(1)
            const url = {
              path: `/doctor/${this.id}/payment`,
              query: {
                id: doctorId,
                type: me.docInfo.services[0].code,
                proId: me.docInfo.services[0].id

              }
            }
            this.$router.push(url)
          } else if (content.find(c => c.statusCode === 'RECEIVED' || c.statusCode === 'PAYED' || c.statusCode === 'CREATED')) {
            console.log(2)
            if (content.find(c => c.statusCode === 'CREATED')) {
              let order = content.find(c => c.statusCode === 'CREATED');
              this.notice_show = '检查到未支付订单，正在前往支付'
              setTimeout(() => {
                this.notice_show = ''
                this.$router.push({
                          path:`/doctor/${this.id}/payment`,
                          query:{
                            orderHeaderId:`${order.orderHeaderId}`
                          }
                })
              }, 2000)

            } else {
              this.notice_show = '请先完成现有咨询'
              setTimeout(() => {
                this.notice_show = ''
                this.$router.push('/home')
              }, 2000)

            }
          } else {
            const url = {
              path: `/doctor/${this.id}/payment`,
              query: {
                id: doctorId,
                type: this.docInfo.services[0].code,
                proId: this.docInfo.services[0].id,
              }
            }
            this.$router.push(url)
          }
        }).catch(err => {
          this.notice_show = err.response.data.message
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
        })
      } else {
        this.notice_show = '请先完成登录，即将为您跳转到登录页面'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.push('/register-login')
        }, 2000)
      }
    },
  }
}

</script>
<style scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw;
}

.page{
  background-color: #fff;
}
.scrolled {
  height: auto;
  bottom: vm(98);
  background-color: #fff;
}

.docInfo {
  box-sizing: border-box;
  width: 100vw;
  padding-bottom: vm(30);
  border-bottom: #eff5f8 vm(20) solid;
  overflow-x: hidden;

}

.docInfo>div.infoBox {
  padding: vm(30) vm(30) 0;
}

.docInfo>div.infoBox::after {
  content: '';
  display: block;
  clear: both;
}

.docInfo>div.infoBox>img.left {
  width: vm(120);
  height: vm(120);
  margin-right: vm(20);
  border-radius: 50%;
}

.docInfo>div.infoBox>div.left>div:first-child {
  margin-top: vm(8);
}

.docInfo>div.infoBox>div.left>div:first-child>span:first-child {
  font-size: vm(40);
  font-weight: bold;
  color: #333333;
}

.docInfo>div.infoBox>div.left>div:first-child>span:last-child {
  display: inline-block;
  height: vm(32);
  text-align: center;
  vertical-align: middle;
  font-size: vm(22);
  padding: 0 vm(10);
  color: #FE9B00;
  border: #FE9B00 1px solid;
  border-radius: vm(16);
  margin-left: vm(14);
}

.docInfo>div.infoBox>div.left>div:nth-child(2) {
  height: vm(30);
  line-height: vm(30);
  margin-top: vm(18);
  margin-bottom: vm(30);
}

.docInfo>div.infoBox>div.left>div:nth-child(2)>span {
  font-size: vm(28);
  color: #666666;
  margin-right: vm(10);
}

.docInfo>div.docData {
  font-size: vm(26);
  color: #666666;
  margin-top: vm(26);
}

.docInfo>div.docData::after {
  content: '';
  display: block;
  clear: both;
}

.docInfo>div.docData>div {
  width: vm(250);
  box-sizing: border-box;
  padding: 0 vm(20);
  border-left: #e2e2e2 1px solid;
}

.docInfo>div.docData>div:first-child {
  border-left: none;
}

.docInfo>div.docData>div>span {
  display: block;
  text-align: center;
}

.docInfo>div.docData>div>span:first-child {
  font-size: vm(32);
  color: #666666;
}

.docInfo>div.docData>div>span:last-child {
  font-size: vm(26);
  color: #B4B4B4;
}

.docInfo>div.btnBox {
  display: flex;
  margin-top: vm(20);
}

.docInfo>div.btnBox>div {
  width: vm(220);
  height: vm(160);
  margin-right: vm(15);
  padding-left: vm(40);
  padding-top: vm(30);
}

.docInfo>div.btnBox>div:last-child {
  margin-right: 0;
}

.docInfo>div.btnBox>div>span:first-child {
  font-size: vm(32);
  font-weight: bold;
  color: #333333;
}

.docInfo>div.btnBox>div.chosen>span:first-child {
  color: #16A9F6;
}

.docInfo>div.btnBox>div>i {
  display: block;
  width: vm(20);
  height: vm(8);
  background-color: #999999;
  margin: vm(20) 0 vm(16);
}

.docInfo>div.btnBox>div.chosen>i {
  background-color: #16A9F6;
}

.docInfo>div.btnBox>div>span:last-child {
  font-size: vm(26);
  color: #999999;
}

.detail {
  position: relative;
  box-sizing: border-box;
}

.btnBox {
  background-color: #ffffff;
  border-bottom: #e2e2e2 1px solid;
  height: vm(80);
}

.btnBox>div {
  position: relative;
  width: 50%;
  height: vm(80);
  font-size: vm(30);
  text-align: center;
  line-height: 80;
  color: #999999;
}

.btnBox>div.chosen {
  color: #333333;
}

.btnBox>div.chosen i {
  position: absolute;
  display: block;
  width: vm(50);
  height: vm(6);
  background-color: #16A9F6;
  bottom: 0;
  left: 50%;
  margin-left: vm(-25);
}

.infomation {
  top: vm(80);
  max-height: 50vw;
  overflow-y: scroll;

}

.evaluate {
 margin-bottom: vm(100)
 
}

.infomation-title,
.evaluate-title {
  font-size: vm(32);
  font-weight: bold;
  padding-left: vm(30);
  margin-top: vm(30)
}

.infomation-title::before,
.evaluate-title::before {
  content: '';
  display: table;
}

.infomation-title::after,
.evaluate-title::after {
  content: '';
  display: block;
  clear: both;
}

.infomation-title>i,
.evaluate-title>i {
  display: inline-block;
  width: vm(6);
  height: vm(32);
  margin-top: vm(6);
  margin-right: vm(10);
  background-color: #16A9F6;
}

.infomation {
  padding: vm(30);
  font-size: vm(30);
}

.evaluate li {
  box-sizing: border-box;
  display: block;
  padding: vm(30) 0 0 vm(30);
}

.evaluate li::after {
  content: '';
  display: block;
  clear: both;
}

.evaluate li:last-child {
  margin-bottom: 5vh;
}

.evaluate li>img.left {
  width: 10.66vw;
  height: 10.66vw;
  margin-right: vm(20);
  border-radius: 50%;
}

.evaluate li>div.left {
  width: 78.33vw;
  padding-right: vm(30);
  padding-bottom: vm(20);
  border-bottom: #E2E2E2 1px solid;
}

.evaluate li:last-child>div.left {
  border-bottom: none;
}

.evaluate li>div.left>.rate {
  margin-top: vm(14);
}

.evaluate li>div.left>.rate::after {
  content: '';
  display: block;
  clear: both;
}

.evaluate li>div.left>.rate>span {
  display: inline-block;
  width: vm(36);
  height: vm(36);
  margin-right: vm(5);
  background-size: vm(36);
  background-position: center;
  background-repeat: no-repeat;
}

.evaluate li>div.left>.rate>span.full {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAFJElEQVRoQ+2aa4hUZRjHf8+Zi6su5uISK2XUhyIN8ksfRAwkiYQ0C3KRYNXduXiBtCSwDyWbUXSDQFPc3cmQaJMtpNIgNKIkLCoLkrxUkn7Q3S5i4W1v8z5xzq65O87lPWfnTLviA8POMM/l/b3POf/3nfescI2aXKNcXAcba52tSMe0hVri1EojRys1QZUBy9CgSoMkeUAErQRc6GC6lRpi7FBYKBEWSxPvXxtgGear8h5QDXwtE1koj/FX2HChdkwVIcOXCrMHQc6LsFqSvD22wbbzqGa9bv1nArvpY5ms5myYcKF1TNup1QvsBmblALhdWyxJPhmbYBkaULbqwL2VawckyZwwFTKUjg1VwkJdCVshwwEbroSF2EJVyLKD5VHCQmChKmT5wfIoYcHLMUSFLCtYESUs1rVQFLK8YMWVsBBcKAoZGEw7iNBNFUoVUEU/tRheUpjvd30SIdHdx2dVUS5h6KaHbtbQKwTfMFuBaQs3AFP7HeoEpoqhDqHOEepUvfdT3c8oUwDHLxhKD8JpoBPoUqXLcQbeY+hC6CROF+P5U+rptck/DMzrwkVupZfpxuFOlBmC97cWGeyM252BV8ymwAh8DNADdA95nQdOqHJE4UhEOEofx/Jtz4aBZTO0itIwOPARjKmCocqJrJCOpdiXsye98tG95IzDRoH0mIATDovwJAn25d6PV91jZzYxafJ4nhN4ooLzHqTUIYmwXJr4Pl9wQfHItvGCwFpgYpCqocYIh7NCMpbgqyKLf/6vtIUJCOsQ1hfYoYc69iLJD0iWtbKS74oNoKjcu3DGIS3w+v9FkSMIX6CkJc3PpcZju46tUIeXwVvPKm/uyZbyrTgslQTHbAZgB7aJcVTRqMKLQI1N4jL6uFAfi2GdrOQX27xWYG4y7SDOORaq0o4Sty0wQj8VYRd9rJVVnPKTyxrsclJtY5HCNqDOT6EAvgZln0RokoS33fJl/sFaiBHhYVVPUG7yVc3euU+h3YH1kuJ3+7Arnr7BvMuymai5mddEvXWu/ObuKLI8JCs4HjR5IDC3mGnjA2BR0MIl4v6QGLNleYXB3PVNHb4B7goJzIhyr6Q5EDR/oI7pNm7XCJ8CtwQtXCpOlFWS9kQqkAUDyzBPlZ1AbaCqFkEqtEWS3q+MQBYIrL+NRgfeACYEqmoXdNBJcY+d69VevsG8c8M3eVaVZgjxGbbSI6eZJM12RwG5aP7BOhjPP2xSSAadTds4gZmS4kdb/6F+/sF2MEV7eRe437Kge3bxk8BJhbmDDwCtQg00RVO8ZeWc4+QfbDvTNMte3EOe0nZW4BUM7WQ5R5wZGDaoMA+IlApX2BxJsaaUX77v/YO1MV3x1rB8j4fcGm6HOhU+cqJslEa6hhbWy1syw9MIdxTroAj7STA3yOMm32D9LTzoOOy5apYG/hvgpMCuviwdsU4OSjP9hWZb36GGi96ecwnCfUA0j++vEmeWLOOM3675BtNWnlHh+ZxCWYWtToRtnOe4rPHOA0uaNuNwGzXZXuY40IwwE1d1r9hpERZIkh9KJhvpPWZa2YXwyGCeMwifi8MGaeKw3+LDLtEtVJtxJER5fPBXg3so+7eB5dEUH/rN7btjJsNvKNUq7DGGndHJ7Jd6LvktXPAS3cI0E6deYAlwtypPRdJs9pvfF5gOSH2rwKuM45As5YLfgjb+3lH7WW4kygIMcU7RUux+LYsq2gxsNPj46thoGLDtGK6D2c7UaPG73rHR0gnbcfwLpMqhRmwxx1oAAAAASUVORK5CYII=');
}

.evaluate li>div.left>.rate>span.half {
  background-image: url('data:image/png;base64,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');
}

.evaluate li>div.left>.rate>span.none {
  background-image: url('data:image/png;base64,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');
}

.evaluate li>div.left>.rate>span {
  line-height: vm(36);
  font-size: vm(28);
  color: #FE9B00;
  margin-left: vm(15);
}

.evaluate li>div.left>span.content {
  display: block;
  margin-top: vm(26);
  color: #666666;
  font-size: vm(28);
  line-height: vm(40);
}

.evaluate li>div.left>.eavlInfo {
  margin-top: vm(40);
  color: #999999;
  font-size: vm(26);
}

.evaluate li>div.left>.eavlInfo>span {
  margin-right: vm(50);
}

.main-btn {
  position: fixed;
  bottom: 0;
  height: vm(98);
}

.main-btn>button:first-child {
  width: 26.66vw;
  height: vm(98);
  background-color: #EFF5F8;
}

.main-btn>button:first-child>img {
  display: block;
  width: vm(48);
  margin: vm(12) auto vm(5);
}

.main-btn>button:first-child>span {
  display: block;
  font-size: vm(20);
  color: #666666;
  text-align: center;
}

.main-btn>button:last-child {
  width: 73.33vw;
  height: vm(98);
  background-color: #16A9F6;
  text-align: center;
  font-size: vm(36);
  line-height: vm(98);
  color: #ffffff;
}

.main-btn>button:last-child>span {
  font-size: vm(26);
}

</style>
