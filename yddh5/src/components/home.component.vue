<template>
  <div class="page">
    <!--<notice-dialog message="我们希望获得您的个人信息，<br/>并注册个人账号" button-confirm-text="好的" button-cancel-text="先看看" @touchConfirm="clickButton"></notice-dialog>-->
    <!--<notice message="一天内只能下一次义诊订单asdfadsfadfadsfasasdfasdfasdfasdfasdfadsfadsdf"></notice>-->
    <!-- <loading></loading> -->
    <div class="scroll-view">
      <div class="header">
        <div class='search-bar'>
          <div class="weash"></div>
          <div class='left' style='opacity: 1' @click='jumpTo("search")'>
            <input placeholder='搜索医生' disabled style='opacity: 1' />
          </div>
          <img src='static/images/home-decorate.png'>
            </div>
          <div class="layouted" v-if='bannerList'>
            <div class="layout">
              <div class="banner">
                <ul class="clearfix">
                  <li v-for='(item,index) in bannerList' :key='index'><a :href="item.skipLinks">
                   <!--  <img :src="item.imgUrl" onerror="this.src='static/images/nurse-top.png'">  -->
                      <img :src="item.imgUrl">  
                
                  </a></li>
                </ul>
                <ul>
                  <li class="now"></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class='btn-box'>
          <button class='left' data-type='CONSULT' data-id='none' @click="jumpTo('CONSULT','none')">
            <img class='left' src='static/images/online-diagnosis.png'>
            <div class='left'>
              <small>网络门诊</small>
              <small>在线问诊开处方 药品配送到家</small>
            </div>
          </button>
          <img src='static/images/home-shadow.png'>
          <button class='left' data-type='CONSULT_FREE' data-id='none' @click="jumpTo('CONSULT_FREE','none')">
            <img class='left' src='static/images/voluntary-diagnosis.png'/>
            <div class='left'>
              <small>今日义诊</small>
              <small>名医爱心服务</small>
            </div>
          </button>
          <img src='static/images/home-shadow.png'/>
          <button class='right' data-type='CONSULT' data-id='none' @click="jumpTo('nurse')">
            <img class='left' src='static/images/nurse-diagnosis.png'>
            <div class='left'>
              <small>护理专家在线</small>
              <small>健康咨询指导</small>
            </div>
          </button>
          <img src='static/images/home-shadow.png'/>
        </div>
          <div class='department'>
            <small>选科室问医生</small>
            <div>
              <ul>
                <li v-for="(item,index) in departments" :key="item.id" class='left' data-type='department' data-id='item.id' @click="jumpTo('department',item.id)">
                  <img :src='item.logoUrl'>
                  <small>{{item.text}}</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--      <div v-if='!hospitalPort && hadCoupon' class="coupon-distribution {getUserInfo ? 'show' : ''}">
          <img class='background' src='/static/images/coupon.png' mode='widthFix'>
          <div class='coupon-info'>
            <small>{{coupon.text}}</small>
            <div>￥<span>{{coupon.price}}</span>
            </div>
            <button v-if='coupon.code && authorization' data-code='coupon.code' @click='receiveCoupon(coupon.code)'>立即领取</button>
            <button v-else-if='coupon.code' open-type='getUserInfo' @clock='receiveCoupon'>立即领取</button>
            <button v-else open-type='getUserInfo' @click='makeChoise'>立即使用</button>
          </div>
          <img class='close-button' src='/static/images/coupon-close.png' @click='notNow'>
      </div> -->
        <notice v-show='notice_show' :message="notice_show"></notice>
        <loading v-show='load_show'></loading>
      </div>
</template>
<script>
import NoticeDialog from './notice-dialog.component'
import Notice from './notice.component'
import Loading from './loading.component'
import { mapState } from 'vuex'
export default {
  name: "home",
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  data() {
    return {
      message: '',
      load_show: false,
      notice_show: '',
      longitude: 104.07,
      latitude: 30.67,
      markers: [],
      bannerList: [],
      coupon: null,
      departments: [],
      getUserInfo: false,
      authorization: false,
      hospitalPort: false,
      hadCoupon: false,
      timer: "",
       screenWidth: document.body.clientWidth,

    }
  },
  computed: mapState({
    //方式一：箭头函数
    couponCode(state) {
      if (state.couponCode === '' && JSON.parse(localStorage.getItem('pageCode'))) {
        this.$store.commit('setPageCode', JSON.parse(localStorage.getItem('pageCode')));
      }
      return state.couponCode
    },
    authorizations(state) {
      if (state.authorization === '' && JSON.parse(localStorage.getItem('authorizationInfo'))) {
        this.$store.commit('setAuthorization', JSON.parse(localStorage.getItem('authorizationInfo')));
      }
      return state.authorization
    },
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
    userInfo(state) {
      if (state.userInfo === '' && JSON.parse(localStorage.getItem('userInfo'))) {
        this.$store.commit('setUserInfo', JSON.parse(localStorage.getItem('userInfo')));
      }
      return state.userInfo
    },
    hospitalId(state) {
      if (state.hospitalId === '' && JSON.parse(localStorage.getItem('hospitalInfo'))) {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalId
    }
  }),
  beforeRouteLeave(to, from, next) {
    if (from.path == '/home') {
      clearInterval(this.timer)
      this.$destroy()
    }
    next();
  },
  activated() {
    let params = this.$route.query
    console.log(params)
    this.$store.commit('changePageType', 'main-page');
    console.log(this.$store.state.pageType)
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      console.log(this.couponCode)
      if (this.couponCode) {
        this.hadCoupon = true
        params = {
          couponCode: this.couponCode
        }
        this.$store.commit('setPageCode', { couponCode: '' })
      }
      this.getFirstInfo(params);
      this.getCarouselImage();
      this.getInfoRequest()
      this.banner()
    },
    clickButton(data) {
      console.log(data);
    },
    getInfoRequest() {
      const urlD = `${this.$conf.url}/internethospital/api/departments?page-index=1&page-size=7&show-all=true&stand-department=true`;
      this.$axios.get(urlD).then(res => {
        console.log(res)
        let data = res.data.content;
        for (let i in data) {
          if (!data[i].logoUrl) {
            data[i].logoUrl = 'static/images/default-department.png'
          }
        }
        data.push({ id: 'another', logoUrl: 'static/images/another.png', text: '其它科室' });
        this.departments = data
      }).catch(err => {
        console.log(err)
      })
    },
    getFirstInfo(params) {
      const me = this;
      if (params && params.couponCode && !this.hospitalPorts) {
        const urlCoupon = `${this.$conf.url}/internethospital/api/coupons?page-index=1&page-size=11&coupon-code=${params.couponCode}`;
        console.log(urlCoupon)
        this.$axios.get(urlCoupon).then(res => {
          if (res.data.content[0]) {
            let price = res.data.content[0] && res.data.content[0].amount.replace('-', '').slice(0, res.data.content[0].amount.replace('-', '').indexOf('.'))
            const data = {
              text: res.data.content[0] && res.data.content[0].text,
              price: price,
              code: res.data.content[0] && res.data.content[0].code
            }
            this.coupon = data;
            this.authorization = this.authorizations
            this.hadCoupon = true
            this.getUserInfo = true
          }
        })
      }
      if (this.hospitalPorts) {
        this.hospitalPort = true
      }
      if (!this.authorizations) {
        this.getUserInfo = true
      }
    },
    getCarouselImage() {
      let url = `${this.$conf.url}/internethospital/api/image-shufflings?page-index=1&page-size=100&platform-type=WECHAT`;
      if (this.hospitalPort) {
        url = `${url}&organization-id=${this.hospitalId}`
      }
      this.$axios.get(url).then(res => {
        console.log(res)
        let list = [];
        if (this.hospitalPort && res.data.content.length === 0) {
          let url = `${this.$conf.url}/internethospital/api/image-shufflings?page-index=1&page-size=100&platform-type=WECHAT`;
          return this.$axios.get(url)
        }
        for (let i in res.data.content) {
          res.data.content[i].imgUrl = `${res.data.content[i].imgUrl}-banners`;
        }
        for (var i = 0; i < 4; i++) {
          list.push(res.data.content[i])
        }
        list.push(res.data.content[0])
        list.unshift(res.data.content[3])
        this.bannerList = list
        console.log(this.bannerList)
        return Promise.reject({
          stopPromiseChain: true
        })
      }).then(res => {
        console.log(res)
        for (let i in res.data.content) {
          res.data.content[i].imgUrl = `${res.data.content[i].imgUrl}-banners`;
        }
        res.data.content.push(res.data.content[0])
        res.data.content.unshift(res.data.content[3])
        this.bannerList = res.data.content
      }).catch(err => {
        console.log(err);
      })
    },
    notNow() {
      this.getUserInfo = false
      this.$router.push("/home")
    },
    makeChoise(e) {
      if (!e.detail.userInfo) {
        this.getUserInfo = false
        this.$router.push("/home")
      } else {
        this.getUserInfo = false
        this.authorizations = true;
        this.userInfo = e.detail.userInfo;
        this.$router.push('/register-login')
      }
    },
    receiveCoupon(code) {
      console.log(code);
      if (this.authorizations && this.userId) {
        const url = `${this.$conf.url}/internethospital/api/coupons/${this.coupon.code}/transactions?userId=${this.userId}&quantity=1`;
        this.$axios.post(url, {}).then(res => {
          this.notice_show = '领取成功'
          setTimeout(() => {
            this.getUserInfo = false
            this.notice_show = ''
          }, 2000)
        }).catch(err => {
          this.notice_show = err.response.data.message
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
        })
      } else {
        if (!code && !this.userInfo) {
          this.getUserInfo = false
          this.$router.push("/home")
        } else {
          console.log(code)
          this.getUserInfo = false
          this.authorizations = true;
          this.userInfo = code;
          this.$router.push(`/register-login?couponCode=${this.coupon.code}`)
        }
      }
    },
    jumpTo(route, id) {
      this.$store.commit('changePageType', 'package-page');
      let url
      if (id) {
        url = `/doctor?departmentId=${id}&type=${route}`;
      } else {
        url = `/${route}`
      }
      this.$router.push(url);
    },
    transitionEnd(dom, callback) {
      if (!dom || typeof dom != 'object') {
        return false;
      }
      dom.addEventListener('transitionEnd', function() {
        callback && callback();
      });
      dom.addEventListener('webkitTransitionEnd', function() {
        callback && callback();
      });
    },
    tap(dom, callback) {
      if (!dom || typeof dom != 'object') {
        return false;
      }
      var isMove = false;
      var time = 0;
      dom.addEventListener('touchstart', function() {

        time = Date.now();
      });
      dom.addEventListener('touchmove', function() {
        isMove = true;
      });
      window.addEventListener('touchend', function(e) {
        if (!isMove && (Date.now() - time) < 150) {
          callback && callback(e);
        }
        isMove = false;
        time = 0;
      });

    },
    banner() {
      var _this = this
      var imageCount = 4;
      var banner = document.querySelector('.banner');
      var width = banner.offsetWidth;
      console.log(width)
      var imageBox = banner.querySelector('ul:first-child');
      var pointBox = banner.querySelector('ul:last-child');
      var points = pointBox.querySelectorAll('li');
      var addTransition = function() {
        imageBox.style.transition = "all 0.4s";
        imageBox.style.webkitTransition = "all 0.4s";
      };
      var removeTransition = function() {
        imageBox.style.transition = "none";
        imageBox.style.webkitTransition = "none";
      }
      var setTranslateX = function(translateX) {
        let aa = translateX / _this.screenWidth * 100 
        imageBox.style.transform = "translateX(" + aa + "vw)";
        imageBox.style.webkitTransform = "translateX(" + aa + "vw)";
      }
      var index = 1;
      _this.timer = setInterval(function() {
        index++;
        addTransition();
        setTranslateX(-index * width);
      }, 3000);

      // function timer(){

      //    index++;
      //    console.log(index)
      //   addTransition();
      //   setTranslateX(-index * width);
      //   _this.timered=setTimeout(timer,3000)       
      // }
      // timer()
      this.transitionEnd(imageBox, function() {
        if (index > imageCount) {
          index = 1;
        } else if (index <= 0) {
          index = imageCount;
        }
        removeTransition();
        setTranslateX(-index * width);
        setPoint();
      });
      var setPoint = function() {
        for (var i = 0; i < points.length; i++) {
          points[i].className = " ";
        }
        points[index - 1].className = "now";
      }
      var startX = 0;
      var moveX = 0;
      var distanceX = 0;
      var isMove = false;
      imageBox.addEventListener('touchstart', function(e) {
        clearInterval(_this.timer); //清除定时器

        startX = e.touches[0].clientX; //记录起始X
      });
      imageBox.addEventListener('touchmove', function(e) {
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        removeTransition(); //清除过渡
        setTranslateX(-index * width + distanceX); //实时的定位
        isMove = true; //证明滑动过
      });
      imageBox.addEventListener('touchend', function(e) {
        if (isMove && Math.abs(distanceX) > width / 3) {

          if (distanceX > 0) { //上一张
            index--;
          } else {
            index++;
          }
        }
        addTransition();
        setTranslateX(-index * width);
        if (index > imageCount) {
          index = 1;
        } else if (index <= 0) {
          index = imageCount;
        }
        setPoint();
        startX = 0;
        moveX = 0;
        distanceX = 0;
        isMove = false;
        clearInterval(_this.timer);
        _this.timer = setInterval(function() {
          index++;
          addTransition();
          setTranslateX(-index * width);
        }, 3000);
      });

    }

  }
}

</script>
<style scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw;
}

/*清除浮动*/
.clearfix::before,
.clearfix::after {
  content: "";
  display: block;
  height: 0;
  line-height: 0;
  visibility: hidden;
  clear: both;
}

.layouted {
  width: 100vw;
  height: vm(280);
  position: absolute;
  top: vm(150);
}

.layout {

  width: calc((690/750)*100vw);
  margin: 0 auto;
  position: relative;

}

.banner {
  width: 100%;
  overflow: hidden;

}

.banner ul:first-child {
  width: 1000%;
  /*-webkit-transform: translateX(-10%);*/
  transform: translateX(-10%);
}

.banner ul:first-child li {
  width: 10%;
  float: left;

}

.banner ul:first-child li a {
  display: block;
  width: 100%;
}

.banner ul:first-child li a img {
  width: 100%;
  height: calc((280/750)*100vw);
  display: block;
}

.banner ul:last-child {
  position: absolute;
  bottom: 6px;
  width: 100%;
  text-align: center;
}

.banner ul:last-child li {
  width: vm(20);
  height: vm(4);
  display: inline-block;
  background-color: rgba(255, 255, 255, .5);

}

.banner ul:last-child li:first-child {
  margin-left: 0;
}

.banner ul:last-child li.now {
  background-color: #fff;
}

.scroll-view {
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to bottom, #16A9F6 49%, #ffffff 50%);
}

.header {
  position: relative;
  display: block;
  width: 100vw;
  height: 60vw;
  background-color: #ffffff;
}

.search-bar {
  position: absolute;
  top: 0
}

.search-bar>.left {
  width: 100vw;
  background-color: #16A9F6;

}

.weash {
  width: 10vw;
  height: 10vw;
  background-image: url('data:image/png;base64,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');
  background-size: 3.73vw;
  background-repeat: no-repeat;
  position: absolute;

  top: 4vw;
  left: 6vw;
}

.search-bar>div {
  background-color: rgba(255, 255, 255, .8);
  background-color: transparent;

  background-size: 3.73vw;
  background-repeat: no-repeat;
  background-position: 2.6vw center;
}

.search-bar input {
  /*box-sizing: border-box;*/

  height: 8vw;
  width: calc(100vw - 20vw);

  padding-left: 9.33vw;

  margin: vm(40) auto;
  margin-left: 5vw;
  font-size: vm(26);

  border-radius: 4vw;
  color: #737E81;
}

.search-bar>img {
  width: 100%;
}

.banner-bar {
  position: absolute;
  width: vm(690);
  height: vm(280);
  overflow: hidden;
  top: vm(100);
  left: 50%;
  margin-left: vm(-350);
}

.banner-bar img {
  width: vm(690);
}

.banner-indicator {
  position: absolute;
  width: 100vw;
  text-align: center;
  line-height: 0;
  top: vm(250);
}

.banner-indicator span {
  display: inline-block;
  width: vm(20);
  height: vm(4);
  margin-left: vm(15);
  background-color: rgba(255, 255, 255, .5);
  border-radius: vm(5);
}

.banner-indicator span.chosen {
  background-color: #ffffff;
}

.btn-box {
  width: 100vw;
  box-sizing: border-box;
  padding: 0 vm(30);
  position: relative;
  background-color: #ffffff;
}

.btn-box::after {
  content: '';
  display: block;
  clear: both;
}

.btn-box>button {
  width: vm(330);
  background-color: #ffffff;
  padding: vm(30) vm(20);
  box-shadow: 0 0 vm(30) vm(5) rgba(153, 153, 153, 0.1);
  position: relative;
  z-index: 2;
  text-align: left;

}

.btn-box>button:first-child {
  width: vm(690);
  padding: vm(50) vm(20);
}

.btn-box>button>img {
  width: vm(80);
  margin-right: vm(20);
}

.btn-box>button:nth-child(5)>img {
  margin-right: vm(8);
}

.btn-box>button small {
  display: block;
}

.btn-box>button small:first-child {
  height: vm(44);
  line-height: vm(44);
  font-size: vm(32);
  color: #333333;
  font-weight: bold;
}

.btn-box>button:first-child small:first-child {
  font-size: vm(36);
}

.btn-box>button small:last-child {
  height: vm(30);
  line-height: vm(30);
  font-size: vm(26);
  color: #b4b4b4;
  margin-top: vm(16);
}

.btn-box>button+img {
  position: absolute;
  width: vm(260);
  bottom: vm(-20);
  left: vm(15);
  z-index: 1;
}

.btn-box>button+img:nth-child(2) {
  width: vm(720);
  top: vm(180);
  bottom: auto;
}

.btn-box>button+img:last-child {
  left: auto;
  right: vm(15);
}

.department {
  width: 100vw;
  box-sizing: border-box;
  padding: vm(30) auto;
  background-color: #ffffff;
}

.department>small {
  display: block;
  padding: vm(25) vm(30);
  font-size: vm(30);
  color: #666666;
  font-weight: bold;
}

.department>div {
  border-top: #e2e2e2 1px solid;
  padding: vm(15) vm(12);
  margin-bottom: vm(120);
}

.department>div::after {
  content: '';
  display: block;
  clear: both;
}

.department>div li {
  width: vm(150);
  margin-right: vm(40);
  margin-top: vm(40);
}

.department>div li:nth-child(4n) {
  margin-right: 0;
}

.department>div li>img {
  display: block;
  width: vm(80);
  height: vm(80);
  margin: 0 auto;
}

.department>div li>small {
  display: block;
  width: 100%;
  color: #666666;
  font-size: vm(26);
  text-align: center;
  margin-top: vm(20);
}

</style>
