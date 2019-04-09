<template>
  <div class="page">
    <form action="">
      <div class='row'>
        <div class='col-4'>
          <label>姓名｜</label>
        </div>
        <div class='col-20'>
          <input v-model='recipient' placeholder='请输入收件人姓名'>
        </div>
      </div>
      <div class='row'>
        <div class='col-5'>
          <label>手机号｜</label>
        </div>
        <div class='col-19'>
          <input v-model='phone' type="tel" placeholder='请输入收件人电话' maxlength='11'>
        </div>
      </div>
      <div class='row'>
        <div class='col-24'>
          <input v-model='region' placeholder='省份/城市/区县' readonly="readonly" @click="choseAddress=true">
        </div>
      </div>
      <div class='row'>
        <div class="col-6">
          <label class='left'>详细地址｜</label>
        </div>
        <div class="col-18">
          <input class='left' v-model='address' placeholder='街道、门牌号等'>
        </div>
      </div>
      <div class='set-default' @click='defaultAddress = !defaultAddress'>
        <img class='left' src='/static/images/address-default.png' v-if='defaultAddress'>
        <img class='left' src='/static/images/address-to-default.png' v-else>
        <span class='left'>设为默认</span>
      </div>
    </form>
    <button type="button" @click='save'>保 存</button>
    <city-address v-if="choseAddress" @touchAddressButton = 'pickAddress'></city-address>
    <notice v-if="notice" :message="notice"></notice>
  </div>
</template>

<script>
  import NoticeDialog from '../notice-dialog.component'
  import Notice from '../notice.component'
  import Loading from '../loading.component'
  import CityAddress from './components/city-address.components'
  import { mapState } from 'vuex'
  export default {
    name: "edit",
    components: {
      NoticeDialog,
      Notice,
      Loading,
      CityAddress
    },
    data () {
      return {
        recipient: '',
        phone: '',
        region: '',
        address: '',
        defaultAddress: false,
        choseAddress: false,
        notice: ''
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
      }
    }),
    activated () {
      this.getInfo();
    },
    beforeRouteLeave(to, from, next){
      this.$destroy();
      next();
    },
    methods: {
      getInfo () {
        if (this.$route.params.id !== 'create') {
          this.getAddress();
        }
      },
      getAddress () {
        const url = `${this.$conf.url}/internethospital/api/user/${this.userId}/shipping-addresses`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          let data = res.data.find(d => d.id === this.$route.params.id);
          if (data.address.indexOf('|') >= 0) {
            let region = data.address.slice(0, data.address.indexOf('|'));
            let address = data.address.slice(data.address.indexOf('|') + 1);
            region = region.replace('省', '省,');
            if (data.address.indexOf('市') >= 0) {
              region = region.replace('市', '市,');
            } else {
              region = region.replace('州', '州,');
            }
            region = region.replace('县', '县,');
            region = region.split(',', 3);
            region = region.join('/');
            this.recipient = data.recipient;
            this.phone = data.phone;
            this.region = region;
            this.address = address;
            this.defaultAddress = data.defaultAddress;
            return;
          }
          if (data.address.indexOf('重庆') >= 0) {
            let region = data.address.slice(0, data.address.search(/[区县]/g) + 1);
            let address = data.address.slice(data.address.search(/[区县]/g) + 1);
            region = region + address.slice(0, address.search(/[区县]/g) + 1);
            address = address.slice(address.search(/[区县]/g) + 1);
            region = region.replace(/市/g, '市,');
            region = region.replace('县', '县,');
            region = region.split(',', 3);
            region = region.join('/');
            this.recipient = data.recipient;
            this.phone = data.phone;
            this.region = region;
            this.address = address;
            this.defaultAddress = data.defaultAddress;
            return;
          }
          let region = data.address.slice(0, data.address.search(/[区县]/g) + 1);
          let address = data.address.slice(data.address.search(/[区县]/g) + 1);
          if (!region) {
            region = data.address.slice(0, data.address.lastIndexOf('市') + 1);
            address = data.address.slice(data.address.lastIndexOf('市') + 1);
          }
          console.log(region);
          region = region.replace('省', '省,');
          if (data.address.indexOf('市') >= 0) {
            region = region.replace('市', '市,');
          } else {
            region = region.replace('州', '州,');
          }
          region = region.split(',', 3);
          region = region.join('/');
          this.recipient = data.recipient;
          this.phone = data.phone;
          this.region = region;
          this.address = address;
          this.defaultAddress = data.defaultAddress;
        }).catch(err => {
          console.log(err);
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      pickAddress (data) {
        if (data) {
          this.region = data.join('/');
        }
        this.choseAddress = false
      },
      save () {
        if (this.$route.params.id !== 'create') {
          this.update(this.$route.params.id)
        } else {
          this.create()
        }
      },
      create () {
        if (!this.recipient) {
          this.notice= '请输入收件人姓名';
        } else if (!this.phone) {
          this.notice= '请输入收件人电话';
        } else if (!/^1\d{10}$/g.test(this.phone)) {
          this.notice= '请输入十一位手机号';
        } else if (!this.region) {
          this.notice = '请选择省市区';
        } else if (!this.address) {
          this.notice = '请输入详细地址';
        }  else {
          const url = `${this.$conf.url}/internethospital/api/user/${this.userId}/shipping-addresses`;
          const data = {
            address: this.region.replace(/\//g,'') + "|" + this.address,
            defaultAddress: this.defaultAddress,
            phone: this.phone,
            recipient: this.recipient
          };
          this.$axios.post(url, data, {headers: this.header}).then(res => {
            this.notice = '创建成功';
            setTimeout(()=> {
              this.notice = '';
              this.$router.back();
            }, 2000)
          }).catch(err => {
            console.log(err);
            this.notice = err.response.data.message;
            setTimeout(()=> {
              this.notice = '';
            }, 2000)
          })
          return;
        }
        setTimeout(()=> {
          this.notice = '';
        }, 2000)
      },
      update (id) {
        if (!this.recipient) {
          this.notice= '请输入收件人姓名';
        } else if (!this.phone) {
          this.notice= '请输入收件人电话';
        } else if (!/^1\d{10}$/g.test(this.phone)) {
          this.notice= '请输入十一位手机号';
        } else if (!this.region) {
          this.notice = '请选择省市区';
        } else if (!this.address) {
          this.notice = '请输入详细地址';
        }  else {
          const url = `${this.$conf.url}/internethospital/api/user/${this.userId}/shipping-addresses/${id}`;
          const data = {
            address: this.region.replace(/\//g,'')  + "|" + this.address,
            defaultAddress: this.defaultAddress,
            phone: this.phone,
            recipient: this.recipient
          };
          this.$axios.put(url, data, {headers: this.header}).then(res => {
            this.notice = '修改成功';
            setTimeout(()=> {
              this.notice = '';
              this.$router.back();
            }, 2000)
          }).catch(err => {
            console.log(err);
            this.notice = err.response.data.message;
            setTimeout(()=> {
              this.notice = '';
            }, 2000)
          })
          return;
        }
        setTimeout(()=> {
          this.notice = '';
        }, 2000)
      }
    }
  }
</script>

<style scoped lang="scss">
  @function vm($px) {
    @return ($px / 750) * 100vw;
  }

  .row{
    display: block;
    background-color: #ffffff;
    width: 100vw;
    height: vm(88);
    border-bottom: #e2e2e2 vm(1) solid;
    padding: vm(20) vm(30);
    box-sizing: border-box;
  }
  .row:last-child{
    border-bottom: none;
  }
  .row label{
    height: vm(48);
    line-height: vm(48);
    font-size: vm(30);
    color: #999999;
    vertical-align: middle;
  }
  .row input{
    height: vm(48);
    color: #333333;
    font-size: vm(30);
  }

  .set-default{
    margin-top: vm(30) ;
    padding: 0 vm(30) ;
  }
  .set-default::after{
    content: '';
    display: block;
    clear: both;
  }
  .set-default>img{
    width: vm(48) ;
    margin-right: vm(12) ;
  }
  .set-default>span{
    font-size: vm(26) ;
    height: vm(48) ;
    line-height: vm(48) ;
    color: #999999;
  }

  button{
    position: fixed;
    bottom: vm(30);
    left: 50%;
    margin-left: vm(-290);
    width: vm(580);
    height: vm(88);
    background-color: #16A9F6;
    color: #ffffff;
  }
</style>
