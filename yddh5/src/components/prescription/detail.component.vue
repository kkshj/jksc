<template>
  <div class="page">
    <p class='effective' v-if='prescription'>本处方2日内效，有效截止日期{{prescription.expireDate}}</p>
    <div class='detail' v-if="prescription">
      <div class='title'>
        <span>{{prescription.organizationText}}</span>
        <span>处方笺</span>
        <span>NO. {{prescription.orderHeaderNumber}}</span>
      </div>
      <div class='header'>
        <div class='row'>
          <div class='col-9'>
            <label>姓名：</label>
            <span>{{prescription.patientName}}</span>
          </div>
          <div class='col-9'>
            <label>性别：</label>
            <span>{{prescription.patientGender === 'MAN' ? '男' : '女'}}</span>
          </div>
          <div class='col-6'>
            <label>年龄：</label>
            <span>{{prescription.patientAge}}</span>
          </div>
        </div>
        <div class='row'>
          <div class='col-8'>
            <label>科室：</label>
            <span>{{prescription.departmentText}}</span>
          </div>
          <div class='col-16'>
            <label>开方时间：</label>
            <span>{{prescription.createdDate}}</span>
          </div>
        </div>
        <div class='row'>
          <div class='col-6'>
            <label>临床诊断：</label>
          </div>
          <div class='col-18'><span>{{prescription.diagnosis}}</span></div>
        </div>
        <div class='row' v-if='prescription.logistics.shippingAddress'>
          <div class='col-6'>
            <label>配送地址：</label>
          </div>
          <div class='col-18'><span>{{prescription.logistics.shippingAddress}}</span></div>
        </div>
        <div class='row' v-if='prescription.logistics.expressNumber'>
          <div class='col-6'>
            <label>快递单号：</label>
          </div>
          <div class='col-18'><span>{{prescription.logistics.expressNumber}}</span></div>
        </div>
      </div>
      <ul class='table'>
        <span class='min-title'>Rp.</span>
        <li v-for='item in prescription.items'>
          <div>
            <span class='left'>{{item.medicineName}}</span>
            <span class='right'>X{{item.shippingQuantity}}{{item.shippingUnitText}}</span>
          </div>
          <span>{{item.usageText}}，{{item.takeQuantity}}{{item.dosageUnitText}}/次，{{item.frequencyText}}</span>
        </li>
      </ul>
      <div class='header' v-if='prescription.comment'>
        <div class='row'>
          <label>备注：</label>
          <span>{{prescription.comment}}</span>
        </div>
      </div>
      <div class='footer row'>
        <div class='col-12'>
          <label>医生：</label>
          <img :src='`data:image/png;base64,${prescription.ywqSignPicture || prescription.ywqDoctorSignPicture}`'>
        </div>
        <div class='col-12' v-if='prescription.ywqPharmacistSignPicture'>
          <label>药师：</label>
          <img :src='`data:image/png;base64,${prescription.ywqPharmacistSignPicture}`'>
        </div>
      </div>
    </div>
   <div class='site' v-if='prescription && prescription.logistics.shippingAddress'>
          <div class='site-12'>
            <label>配送信息：</label>
          </div>
          <div class='site-14'><span>收件人</span><span>{{prescription.logistics.contactPerson}}</span></div>
          <div class='site-14'><span>联系电话</span><span>{{prescription.logistics.contactPhone}}</span></div>
          <div class='site-14'><span>配送地址</span><span>{{prescription.logistics.shippingAddress}}</span></div>
        </div>
            
    <button v-if='prescription && (prescription.statusCode === "SIGNED" || prescription.statusCode === "AUDITED")' class='btn-bottom' @click='jumpTo("prescription/payment" ,prescription.orderHeaderId)'>去拿药</button>
    <notice v-if="notice" :message="notice"></notice>
  </div>
</template>

<script>
  import NoticeDialog from '../notice-dialog.component'
  import Notice from '../notice.component'
  import Loading from '../loading.component'
  import { mapState } from 'vuex'
  export default {
    name: "detail",
    components: {
      NoticeDialog,
      Notice,
      Loading
    },
    data () {
      return {
        prescription: null,
        notice: ''
      }
    },
    computed: mapState({
      header (state) {
        if (state.header === '') {
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
        }
        return state.header
      }
    }),
    activated () {
      this.getInfo()
    },
    methods: {
      getInfo(){
        this.getPrescription()
      },
      getPrescription () {
        const url = `${this.$conf.url}/internethospital/api/orders/prescriptions/${this.$route.params.id}`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          this.prescription = res.data
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      jumpTo(route, id) {
        this.$router.push(`/${route}/${id}`);
      }
    }
  }
</script>

<style scoped lang="scss">
  @function vm($px) {
    @return ($px / 750) * 100vw;
  }
  .site{
   width: vm(690);
  margin: vm(10) auto;
  background-color: #ffffff;
  border-radius: vm(14);
}
.site .site-12{
    font-size:vm(28);
  color: #666;
  line-height: vm(80);
  padding: 0 vm(29);
}
.site .site-14{
  font-size:vm(28);
  padding: 0 vm(29);

  line-height: vm(60);
  color: #999;
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.site .site-14>span:nth-child(1){
width:vm(120);
}
.site .site-14:nth-last-child(1){
    align-items:flex-start;
    
}
.site .site-14:nth-last-child(1) span:nth-child(1){
  width:vm(160);
}
.site .site-14:nth-last-child(1) span:nth-child(2){
  width: vm(600);
}
.effective{
  display: block;

  width: 100vw;
  color: #FE9B00;
  font-size: vm(28);
  padding-left: vm(30);
  height: vm(60);
  line-height: vm(60);
  background: rgba(255, 242, 184, 1);

}


  .page{
    padding-bottom: 13.06vw;
  }
  .detail{
    width: vm(690);
    margin: vm(20) auto vm(30);
    background-color: #ffffff;
    border-radius: vm(8);
    overflow: hidden;
  }
  .detail>.title{
    height: vm(130);
    color: #ffffff;
    padding-top: vm(16);
    box-sizing: border-box;
    background-color: rgba(22, 169, 246, .8);
    font-weight: bold;
  }
  .detail>.title>span{
    display: block;
    font-size: vm(30);
    text-align: center;
  }
  .detail>.title>span:first-child{
    font-size: vm(28);
  }
  .detail>.title>span:last-child{
    display: block;
    font-size: vm(22);
    text-align: right;
    padding-right: vm(30);
    opacity: .6;
  }
  .detail>.header{
    padding: vm(40) vm(30);
    font-size: vm(28);
    color: #333333;
  }
  .detail>.header>.row{
    margin-bottom: vm(30);
  }
  .detail>.header>.row:last-child{
    margin-bottom: 0;
  }
  .detail>.header label{
    color: #999999;
  }
  .detail>.table{
    width: vm(630);
    height: vm(570);
    margin: 0 auto;
    border-top: #e2e2e2 vm(1) solid;
    border-bottom: #e2e2e2 vm(1) solid;
    padding-top: vm(30);
    overflow-y: scroll;
  }
  .detail>.table .min-title{
    display: block;
    font-size: vm(36);
    color: #333333;
    margin-bottom: vm(30);
  }
  .detail>.table li{
    display: block;
    width: 100%;
    font-size: vm(30);
    color: #333333;
    margin-top: vm(30);
  }
  .detail>.table li>div::after{
    content: '';
    display: block;
    clear: both;
  }
  .detail>.table li>span{
    display: block;
    font-size: vm(26);
    line-height: vm(40);
    color: #999999;
    margin-top: vm(15);
  }
  .detail>.footer{
    padding: vm(25) vm(30);
    font-size: vm(30);
    color: #333333;
  }
  .detail>.footer label{
    color: #999999;
    vertical-align: top;
  }
  .detail>.footer img{
    width: vm(200);
  }


  .btn-bottom{
    position: fixed;
    width: 100vw;
    height: vm(98);
    bottom: 0;
    color: #FFFCFB;
    background-color: #16A9F6;
    border-radius: 0;
    font-size: vm(36);
  }
</style>
