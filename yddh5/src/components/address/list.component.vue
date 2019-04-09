<template>
    <div class="page">
      <div class='emp' v-if='addressList.length === 0'>
        <img src='/static/images/empty-address.png'>
        <span>你还没有添加配送地址</span>
      </div>
      <ul scroll-y class='section'>
        <li v-for='item in addressList' @click='chooseAddress(item.id)'>
          <span>{{item.recipient}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.phone}}</span>
          <span>{{item.address}}</span>
          <div v-if="!choseAdd">
            <div class='left' @click='toDefault(item.id)'>
              <img class='left' src='/static/images/address-default.png' v-if='item.defaultAddress'>
              <img class='left' src='/static/images/address-to-default.png' v-else>
              <span class='left'>{{item.defaultAddress ? '默认地址' : '设为默认地址'}}</span>
            </div>
            <div class='right' @click='deleteId = item.id'>
              <img class='left' src='/static/images/delete-line.png'>
              <span class='left'>删除</span>
            </div>
            <div class='right' @click='jumpTo("address", item.id)'>
              <img class='left' src='/static/images/edit-line.png'>
              <span class='left'>编辑</span>
            </div>
          </div>
        </li>
      </ul>
      <div class='btn-box'>
        <button @click='jumpTo("address")'>新增地址</button>
      </div>
      <notice v-if="notice" :message="notice"></notice>
      <notice-dialog v-if="deleteId" message="确定要删除该配送地址吗？" button-confirm-text="确定" button-cancel-text="取消" @touchConfirm="deleteAddress"></notice-dialog>
    </div>
</template>

<script>
  import NoticeDialog from '../notice-dialog.component'
  import Notice from '../notice.component'
  import Loading from '../loading.component'
  import { mapState } from 'vuex'
  export default {
    name: "list",
    components: {
      NoticeDialog,
      Notice,
      Loading
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
    data () {
      return{
        addressList:[],
        choseAdd: false,
        notice: '',
        deleteId: ''
      }
    },
    activated () {
      this.getInfo();
      if (this.$route.query.type === 'choose') {
        this.choseAdd = true;
      }
    },
    beforeRouteLeave(to, from, next){
      this.$destroy();
      next();
    },
    methods: {
      getInfo () {
        this.getAddresses();
      },
      getAddresses () {
        const url = `${this.$conf.url}/internethospital/api/user/${this.userId}/shipping-addresses`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          console.log(res);
          for (let i in res.data) {
            res.data[i].address = res.data[i].address.replace('|', '');
          }
          this.addressList = res.data;
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      toDefault (id) {
        let address = this.addressList.find(add => add.id === id);
        if (!address.defaultAddress) {
          const url = `${this.$conf.url}/internethospital/api/user/${this.userId}/shipping-addresses/${id}`;
          address.defaultAddress = true;
          delete address.id;
          this.$axios.put(url, address,  {headers: this.header}).then(res => {
            this.notice = '设置成功';
            setTimeout(()=>{
              this.notice = '';
              this.getInfo();
            }, 2000)
          }).catch(err => {
            this.notice = err.response.data.message;
            setTimeout(()=>{
              this.notice = '';
              this.getInfo();
            }, 2000)
          })
        }
      },
      deleteAddress (bol) {
        if (bol) {
          const url = `${this.$conf.url}/internethospital/api/user/{userId}/shipping-addresses/${this.deleteId}`;
          this.$axios.delete(url,  {headers: this.header}).then(res => {
            this.deleteId = "";
            this.notice = "删除成功";
            setTimeout(()=>{
              this.notice = '';
              this.getInfo();
            }, 2000)
          }).catch(err => {
            this.notice = err.response.data.message;
            setTimeout(()=>{
              this.notice = ''
              this.getInfo();
            }, 2000)
          })
        } else {
          this.deleteId = ""
        }
      },
      chooseAddress (id) {
        if (this.choseAdd) {
          localStorage.setItem('addressId', id);
          this.$router.back()
        }
      },
      jumpTo (route, id = 'create') {
        this.$router.push(`/${route}/${id}`);
      }
    }
  }
</script>

<style scoped lang="scss">
  @function vm($px) {
    @return ($px / 750) * 100vw;
  }
  .page{
    height: calc(100vh - 13.06vw);
  }

  li{
    display: block;
    background-color: #ffffff;
    padding: vm(30) vm(30) vm(20);
    margin-top: vm(20);
  }
  li:last-child{
    margin-bottom: vm(20);
  }
  li::after{
    content: '';
    display: block;
    clear: both;
  }
  li>span{
    display: block;
  }
  li>span:first-child{
    font-size: vm(30);
    font-weight: bold;
  }
  li>span:nth-child(2){
    font-size: vm(26);
    color: #666666;
    margin-top: vm(20);
  }
  li>div:last-child{
    margin-top: vm(20);
    border-top: #e2e2e2 vm(1) solid;
    padding-top: vm(15);
  }
  li>div:last-child::after{
    content: '';
    display: block;
    clear: both;
  }
  li>div:last-child>div.left>img{
    width: vm(48);
    height: vm(48);
    margin-right: vm(10);
  }
  li>div:last-child>div.left>span{
    line-height: vm(50);
    font-size: vm(26);
    color: #999999;
  }
  li>div:last-child>div.right>img{
    width: vm(28);
    margin-top: vm(10);
    margin-right: vm(10);
  }
  li>div:last-child>div.right>span{
    line-height: vm(50);
    font-size: vm(26);
    color: #999999;
  }
  li>div:last-child>div.right{
    margin-left: vm(55);
  }

  .btn-box>button{
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: vm(88);
    border-radius: 0;
    background-color: #16A9F6;
    color: #ffffff;
    font-size: vm(36);
  }
</style>
