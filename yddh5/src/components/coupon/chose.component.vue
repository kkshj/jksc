<template>
  <div class="page">
    <div class='section'>

      <div v-if='couponAvailableList.length > 0' v-for='(item,index) in couponAvailableList' class='coupon-item' @click='choseThis(item.id)'>
        <img src='static/images/coupon-for-all.png'>

        <div class='basic-info'>
          <div class='left'>￥<span>{{item.amount}}</span></div>
          <div class='left'>
            <span>{{item.text}}</span>
            <span>{{item.startTime}}-{{item.endTime}}</span>
          </div>
          <div class='right'>
            <img v-if='useThisCoupon&&useThisCoupon.id === item.id' src='/static/images/chosen.png'>
            <span v-else></span>
          </div>
          <button v-if="item.longText" class='show-use-notice' @click='showOrHideUseNotice(item.id)'>使用须知<img v-if='!item.showUseNotice' class='right' src='static/images/coupon-notice-open.png'><img v-else class='right' src='static/images/coupon-notice-close.png'></button>
        </div>

        <div v-if='item.showUseNotice' class='use-notice'>{{item.longText}}</div>

      </div>

      <div class='part-line' v-if='couponNotAvailableList.length > 0'>
        <span></span>
        <span>以下优惠券不适用</span>
        <span></span>
      </div>

      <div v-if='couponNotAvailableList.length > 0' v-for='(item,index) in couponNotAvailableList' class='coupon-item'>
        <img src='/static/images/coupon-used.png'>
        <div class='basic-info'>
          <div class='left'>￥<span>{{item.amount}}</span></div>
          <div class='left'>
            <span>{{item.text}}</span>
            <span>{{item.startTime}}-{{item.endTime}}</span>
          </div>
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
      couponAvailableList: [],
      couponNotAvailableList: [],
      useThisCoupon: null
    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  computed: mapState({
    //方式一：箭头函数
    header(state){
    	   if (state.header === '') {
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
        }
        return state.header
    },
   userId(state){
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
      this.getFirstInfo(params)
        let useThisCoupon=localStorage.getItem('useThisCoupon')
     if (useThisCoupon) {     
        console.log(useThisCoupon)
          this.useThisCoupon=useThisCoupon
      } 		
    },
    getFirstInfo(params) {
      const url = `${this.$conf.url}/internethospital/api/inventories/coupons?user-id=${this.userId}&page-index=1&page-size=10000`;
      this.$axios.post(url, {}, {headers:this.$store.state.header}).then(res => {
     console.log(res);
      let coupons = res.data.content
      for (let i in coupons) {
        coupons[i].amount = coupons[i].amount.toString().replace('-', '')
        coupons[i].startTime = coupons[i].startTime.slice(0, coupons[i].startTime.indexOf(' '));
        coupons[i].startTime = coupons[i].startTime.replace(/-/g, '.')
        coupons[i].endTime = coupons[i].endTime.slice(0, coupons[i].endTime.indexOf(' '));
        coupons[i].endTime = coupons[i].endTime.replace(/-/g, '.')
        coupons[i].showUseNotice = false;
      }
      let availables = coupons.filter(c => 
        c.status === 'AVAILABLE'
        && (c.departmentId ? 
          c.departmentId === params.departmentId
          : c.organizationId ? 
            c.organizationId === params.organizationId 
            : true
          )
      );
      let notAvailables = coupons.filter(c => 
        c.status === 'CREATED'
        || (c.status === 'AVAILABLE' 
          && (c.organizationId ?
            c.organizationId !== params.organizationId 
            : c.departmentId ? 
            c.departmentId !== params.departmentId 
            : false)
          )
      );
      console.log(availables)
      console.log(notAvailables)
        this.couponAvailableList= availables
        this.couponNotAvailableList= notAvailables
      }).catch(err => {
        this.notice_show = err.response.data.message
        setTimeout(() => {
          this.notice_show = ''
        }, 1500)
      })
    },
    showOrHideUseNotice(e) {
    	console.log(e)
      const me = this;
      const id = e;
      const couponAvailableList = me.couponAvailableList;
      const couponNotAvailableList = me.couponNotAvailableList;
      for (let i in couponAvailableList) {
        if (couponAvailableList[i].id === id) {
          couponAvailableList[i].showUseNotice = !couponAvailableList[i].showUseNotice
        }
      }
      for (let i in couponNotAvailableList) {
        if (couponNotAvailableList[i].id === id) {
          couponNotAvailableList[i].showUseNotice = !couponNotAvailableList[i].showUseNotice
        }
      }
      me.couponAvailableList = couponAvailableList
      me.couponNotAvailableList = couponNotAvailableList
    },
    choseThis(e) {
      console.log(e)
      let useThisCoupon = this.couponAvailableList.find(c => c.id === e);
      console.log(useThisCoupon)
      this.useThisCoupon = useThisCoupon
      localStorage.setItem('useThisCoupon', JSON.stringify(useThisCoupon))
     this.$router.back()
    },
  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px){
	@return ($px / 750) * 100vw
}
page{
  background-color: #eff5f8;
}

.coupon-item{
  width: vm(690);
  height: auto;
  position: relative;
  margin: vm(20) auto;
  margin-top: vm(20);
}
.coupon-item>img{
  position: absolute;
  top: 0;
  width: vm(690);
  height: auto;
  z-index: 1;
}
.basic-info{
  position: relative;
  width: vm(690);
  height: vm(180);
  z-index: 100;
}
.basic-info .left:first-child{
  font-family: 'pier';
  width: vm(190);
  text-align: center;
  font-size: vm(30);
  color: #ffffff;
  vertical-align: top;
  font-weight: bold;
  padding-top: vm(60);
}
.basic-info .left:first-child>span{
  font-size: vm(60);
  vertical-align: top;
}
.basic-info .left:nth-child(2){
  width:vm(290);
  margin-left: vm(40);
}
.basic-info .left:nth-child(2)>span{
  display: block;
}
.basic-info .left:nth-child(2)>span:first-child{
  font-size:vm(30);
  color: #333333;
  margin-top: vm(40);
}
.basic-info .left:nth-child(2)>span:last-child{
  font-size: vm(26);
  color: #666666;
  margin-top:vm(20);
}
.basic-info div.right{
  width: vm(48);
  height: vm(48);
  margin-top:vm(60);
  margin-right: vm(20);
}
.basic-info div.right>img{
  display: block;
  width: vm(48);
}
.basic-info div.right>span{
  display: block;
  width: vm(48);
  height: vm(48);
  border: #e2e2e2 1px solid;
  border-radius: vm(24);
}
.show-use-notice{
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
.show-use-notice::after{
  content: '';
  display: block;
  clear: both;
} 
.show-use-notice>img{
  width: vm(36);
  height: auto;
}

.part-line{
  display: flex;
  padding: 0 vm(30);
  margin: vm(60) auto vm(40);
}
.part-line>span{
  display: block;
  flex: 1;
  height: 1px;
  background-color: #999999;
  margin-top: vm(16);
}
.part-line>text{
  display: block;
  flex: 1;
  color: #666666;
  font-size:vm(26);
  margin: 0 vm(20);
}

.use-notice{
  letter-spacing: vm(2);
  margin-top: vm(10);
  background-color: #ffffff;
  width: 100%;
  color: #666666;
  font-size: 26rpx;
  padding: vm(20);
  box-sizing: border-box;
  line-height: vm(40);
}
</style>
