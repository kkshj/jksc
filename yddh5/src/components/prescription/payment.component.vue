<template>
    <div class="page">
      <div class='header' @click='jumpTo("address", {type: "choose"}, true)'>
        <span v-if='patient === null'>暂未创建收货地址</span>
        <div v-else>
          <span>{{patient.recipient}}&nbsp;&nbsp;&nbsp;&nbsp;{{patient.phone}}</span>
          <div :class='patient.defaultAddress ? "default" : ""'><span v-if='patient.defaultAddress'>默认</span>{{patient.address}}</div>
        </div>
      </div>
      <img src='static/images/colorful-border.png'>
      <div class='detail' v-if="prescription">
        <span>药品明细</span>
        <div class='medicen-list' v-for="item in prescription.items">
          <span class='left'>{{item.medicineName}}</span>
          <span class='right'>￥{{item.singlePrice}} X{{item.shippingQuantity}}{{item.shippingUnitText}}</span>
        </div>
        <div class='amount'>
          合计
          <span>￥{{prescription.amount}}</span>
        </div>
        <div class='postage'>
          <span class='left'>配送费/邮费</span>
          <span class='right'>{{postage}}</span>
        </div>
      </div>
      <ul class='pay-type'>
        <li>
          <img class='left' src='static/images/weChetPay.png'>
          <span class='left'>微信支付</span>
          <!--<icon class='right' type="success" size="25" color="#16A9F6"/>-->
        </li>
      </ul>
      <div>
        <span class='explain-title'>配送说明</span>
        <span class='explain-contain'>四川省内当日16:00前完成的支付订单，药品48小时内送达；16:00后完成的支付订单，药品72小时内送达；
          四川省外一般3-5天送达，具体视配送区域及实际情况而定。
        </span>
      </div>
      <div class='btn-box'>
        <button>
          <span>实付</span>
          <span v-if="prescription">￥{{prescription.amount}}</span>
        </button>
        <button @click='payment'>立即支付</button>
      </div>
      <notice v-if="notice" :message="notice"></notice>
      <loading v-if="loading"></loading>
    </div>
</template>

<script>
  import NoticeDialog from '../notice-dialog.component'
  import Notice from '../notice.component'
  import Loading from '../loading.component'
  import { mapState } from 'vuex'
  Math.formatFloat =  (f, digit) => {
    let m = Math.pow(10, digit);
    return Math.round(f * m, 10) / m;
  }
  export default {
    name: "payment",
    components: {
      NoticeDialog,
      Notice,
      Loading
    },
    data () {
      return {
        addressId: '',
        prescription: null,
        patient: null,
        postage: '免费',
        hasConfirmAddress: false,
        notice: '',
        loading: false,
      }
    },
    computed: mapState({
      openId (state) {
        if (state.openId === '') {
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
        }
        return state.openId
      },
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
      }
    }),
    activated () {
     this.addressId = localStorage.getItem('addressId');
      localStorage.removeItem('addressId');
     if (this.addressId) {
       this.getAddress();
     }
      this.getInfo()
    },
    methods: {
      async getInfo(){
        await this.getAddress();
        await this.getPrescription();
      },
      async getAddress () {
        const url = `${this.$conf.url}/internethospital/api/user/${this.userId}/shipping-addresses`;
        await this.$axios.get(url, {headers: this.header}).then(res => {
          let patient = res.data;
          if (this.addressId) {
            patient = patient.find(p => p.id === this.addressId)
          } else {
            patient = patient.find(p => p.defaultAddress);
          }
          patient.address = patient.address.replace('|', '');
          this.patient = patient;
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      async getPrescription () {
        const url = `${this.$conf.url}/internethospital/api/orders/prescriptions/${this.$route.params.id}`;
        await this.$axios.get(url, {headers: this.header}).then(res => {
          let prescription = res.data;
          console.log(prescription)
          if (prescription.amount && prescription.amount.toString().indexOf('.') < 0) {
            prescription.amount = '' + prescription.amount + '.00';
          } else if (prescription.amount && prescription.amount.toString().slice(prescription.amount.toString().indexOf('.') + 1).length !== 2) {
            prescription.amount = '' + prescription.amount + '0';
          }
          for (let i in prescription.items) {
            prescription.items[i].singlePrice = Math.formatFloat(prescription.items[i].amount / prescription.items[i].shippingQuantity, 2);
            if (prescription.items[i].singlePrice && prescription.items[i].singlePrice.toString().indexOf('.') < 0) {
              prescription.items[i].singlePrice = '' + prescription.items[i].singlePrice + '.00';
            } else if (prescription.items[i].singlePrice && prescription.items[i].singlePrice.toString().slice(prescription.items[i].singlePrice.toString().indexOf('.') + 1).length !== 2) {
              prescription.items[i].singlePrice = '' + prescription.items[i].singlePrice + '0';
            }
          }
          if ( prescription.logistics.shippingAddress ) {
            this.patient = {
              address: prescription.logistics.shippingAddress,
              defaultAddress: false,
              id: "",
              phone: prescription.logistics.contactPhone,
              recipient: prescription.logistics.contactPerson
            };
            this.hasConfirmAddress = true;
          }
          this.prescription = prescription;
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      setLogistics () {
        const url = `${this.$conf.url}/internethospital/api/orders/${this.prescription.orderHeaderId}/logistics`;
        const data = {
          contactPerson: this.patient.recipient,
          contactPhone: this.patient.phone,
          shippingAddress: this.patient.address
        }
        this.$axios.post(url, data, {headers: this.header}).then(res => {
          console.log(res)
          this.pay();
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      pay () {
        const url = `${this.$conf.url}/internethospital/api/orders/${this.prescription.orderHeaderId}/pay-infors/wechat?open-id=${this.openId}`;
        this.$axios.post(url, {} , {headers: this.header}).then(res => {
          console.log(res);
          this.loading = false
          // this.$wx.config({
          //   debug: false,
          //   appId
          // })
        }).catch(err => {
          this.loading = false;
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      payment () {
        this.loading = true;
        if (this.hasConfirmAddress) {
          this.pay ();
        } else {
          this.setLogistics();
        }
      },
      jumpTo(route, params, query = false) {
        if (route === 'address' && this.hasConfirmAddress) {
          this.notice = '订单收货地址已确定，无法更改';
          setTimeout(()=>{
            this.notice = ''
          }, 2000);
          return
        }
        if (query) {
          this.$router.push({
            path: `/${route}`,
            query: {
              type: params.type
            }
          });
          return
        }
        this.$router.push(`/${route}/${params.id}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @function vm($px) {
    @return ($px / 750) * 100vw;
  }

  .header{
    background-color: #ffffff;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAACN0lEQVR4Xu3av0pDMRgF8C/3VqGDqIvg6qBYoY4XX0BddOwj6CwULIK0durUXV/BxdlREV18ARcFN10UQbDtTeT6BxRuWyE2OYHTuU2bX89J4WuU8DFQQNFnsACBhiSEQASyO0SYICaICbITYILs/HgGMUFMkJ0AE2TnxzOICWKC7AQQErS1dTg2NfMwl32W20J6e9xodEa6q39c3MkZVK3Xy5JGayISmYK5TEqli0qlkv7jPka2lBug/WYiyqyKSGyM6mmdnq4sL12HgOQEaLfVmuy+vq1HIovZV50hSazPJkSuGuB1cwKUoey028X4+XlDTFT66IOWrinE50lpHrpuzoC+kQpPL5vaqAWlTBRC3ZwCZUi1Wm06HS+umkDq5hwotLp5AQqpbt6AQqmbV6AQ6uYdCL1uEEDIdYMBQq0bFBBi3eCA0OoGCYRUN1gglLpBA/Wtm9ZnL4+zl0dH292RTcq+FoYHyqubMerVROlJ++DghkA5syQC/YhF7niEFfsUyqaQvgdssGdQ/ojWnLv+RwQSCGnqCAeEUKufv4xQQCi1ggRCqhUcEFqtoIAQawUDhForCCDkWnkHQq+VV6AQauUNKJRaeQEKqVbOgXiBashYr9psJtLjFby+TNW9elmiaE0ppbTWV8kyL3H+wvq+BtyLY3OvOne8BjzqSbrD9aHGHQ73/ee3ItAQKgIR6M9tyn0iE8QEMUF2AkyQnR/PICaICbITYILs/HgGMUFMkJ3AkFe/A5eMGGfm7a/3AAAAAElFTkSuQmCC');
    background-repeat: no-repeat;
    background-size: vm(48);
    background-position: right vm(20) center;
    padding: vm(30);
  }
  .header>div>span{
    display: block;
    font-size: vm(36);
    color: #333333;
    font-weight: bold;
  }
  .header div:last-child{
    font-size: vm(26);
    line-height: vm(40);
    color: #666666;
    margin-top: vm(20);
  }
  .header>div>div>span{
    display: inline-block;
    font-size: vm(20);
    height: vm(30);
    padding: 0 vm(10);
    line-height: vm(30);
    border-radius: vm(15);
    background-color: #FE9B00;
    color: #ffffff;
    margin-right: vm(16);
  }

  .header+img{
    display: block;
    width: 100vw;
  }

  .detail{
    margin-top: vm(20);
    background-color: #ffffff
  }
  .detail>span:first-child{
    display: block;
    font-size: vm(30);
    color: #333333;
    font-weight: bold;
    padding: vm(20) vm(30);
    border-bottom: #e2e2e2 vm(1) solid;
  }
  .detail>.medicen-list{
    padding: vm(10) vm(30);
    font-size: vm(28);
    color: #666666;
  }
  .detail>.medicen-list:nth-child(2){
    margin-top: vm(30);
  }
  .detail>div::after{
    content: '';
    display: block;
    clear: both;
  }
  .detail>.amount{
    padding-right: vm(30);
    margin-top: vm(30);
    text-align: right;
    color: #999999;
  }
  .detail>.amount>span{
    color: #FF624D;
  }

  .postage{
    margin-top: vm(30);
    padding: vm(30);
    font-size: vm(30);
    color: #333333;
    border-top: #e2e2e2 vm(1) solid;
  }

  .pay-type{
    margin-top: vm(20);
    background-color: #ffffff;
  }
  .pay-type>li{
    display: block;
    width: 100vw;
    height: vm(88);
    box-sizing: border-box;
    padding: vm(20) vm(30);
  }
  .pay-type>li>img{
    width: vm(48);
  }
  .pay-type>li>span{
    font-size: vm(30);
    margin-left: vm(20);
    color: #333333;
    line-height: vm(48);
  }

  .explain-title{
    margin-top: vm(30);
    display: block;
    padding: 0 vm(30);
    font-size: vm(28);
    color: #b4b4b4;
  }
  .explain-contain{
    margin-top: vm(20);
    display: block;
    padding: 0 vm(30);
    font-size: vm(26);
    color: #666666;
    line-height: vm(40);
  }

  .btn-box{
    position: fixed;
    bottom: 0;
    height: vm(98);
    display: flex;
  }
  .btn-box>button{
    display: block;
    height: vm(98);
    border-radius: 0;
  }
  .btn-box>button:first-child{
    width: vm(300);
    background-color: #ffffff;
  }
  .btn-box>button:last-child{
    width: vm(450);
    background-color: #16A9F6;
    color: #ffffff;
  }
  .btn-box>button:first-child>span:first-child{
    font-size: vm(26);
    color: #333333;
  }
  .btn-box>button:first-child>span:last-child{
    font-size: vm(36);
    font-weight: bold;
    color: #FF624D;
  }

</style>
