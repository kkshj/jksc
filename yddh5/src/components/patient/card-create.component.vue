<template>
  <div class="page">
    <span class='title'>请绑定就诊本人的就诊卡</span>
    <div>
      <div class='form-item' @click='changeSpan'>
        <label class='left'>就诊医院</label>
        <div>{{ patient }}</div>
      </div>
      <div class='form-item'>
        <label class='left'>就诊卡号</label>
        <input class='right' placeholder='请输入就诊卡号' maxlength='-1' type='text' v-model='cards' @input='inputMedicalCard(cards)'></input>
      </div>
    </div>
    <button class='operation' @click='create'>保 存</button>
    <div v-if='alert' class='alert'>
      <div>
        <button v-for='(item,index) in hospitalArr' :data-id='item.id' @click='changePatients(item.id)'><span>{{item.text}}</span></button>
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
      hospitalArr: [],
      hospital: 0,
      id: '',
      cardNumber: '',
      orderHeaderId: '',
      cards: '',
      alert: false,
      patient: '请选择'
    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  computed: mapState({
    //方式一：箭头函数
    header(state) {
      if (state.header === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.header
    }
  }),
  activated() {
    this.$store.commit('changePageType', 'package-page');
    const params = this.$route.params
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      this.id = params.id
      this.getFirstInfo();
    },
    changePatients(id) {
      const patient = this.hospitalArr.find(p => p.id === id);
      console.log(patient)
      this.patient = patient.text
      this.alert = false
    },
    changeSpan() {
      // this.alert = true
      if (!this.orderHeaderId) {
        this.alert = true
      }
    },
    getFirstInfo() {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/organizations?page-index=1&page-size=10000`;
      this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
        console.log(res)
          this.hospitalArr = res.data.content
      })

    },
    inputMedicalCard(cards) {
      this.cardNumber = cards
    },
    create() {
      const url = `${this.$conf.url}/internethospital/api/patients/${this.id}/medical-cards`;
      const data = {
        hospitalId: this.hospitalArr[this.hospital].id,
        cardNumber: this.cardNumber
      };
      this.$axios.post(url,data, { headers: this.$store.state.header }).then(res => {
          console.log(res);
          this.notice_show = '创建成功'
          setTimeout(() => {
            this.notice_show = ''
            this.$router.back()
          }, 2000)
      })

    },
  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}

.title {
  display: block;
  margin: vm(20) vm(30);
  font-size: vm(28);
  color: #999999;
}

.form-item {
  width: 100vw;
  height: vm(88);
  box-sizing: border-box;
  padding: vm(28) vm(30);
  background-color: #ffffff;
  border-bottom: #e2e2e2 1px solid;
}

.form-item:last-child {
  border-bottom: none;
}

.form-item::after {
  content: '';
  display: block;
  clear: both;
}

.form-item>label {
  width: 30%;
  font-size: vm(30);
  color: #333333;
  line-height: vm(32);
}

.form-item>div {
  display: block;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  min-height: auto;
  height: vm(32);
  font-size: vm(30);
  color: #666666;
  text-align: right;
}

.form-item>input {
  display: block;
  padding: 0;
  box-sizing: border-box;
  width: 60%;
  min-height: auto;
  height: vm(32);
  font-size: vm(30);
  color: #666666;
  text-align: right;
}

.operation {
  width: vm(580);
  height: vm(88);
  border-radius: vm(8);
  background-color: #16A9F6;
  color: #ffffff;
  font-size: vm(36);

  margin: vm(150) calc(85/750*100vw);
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

/*.alert>button{
  position: absolute;
  bottom: 0;
  color: #2FBFF7;
}*/

.alert>div {
  max-height: vm(352);
  position: absolute;
  bottom: 0;
  overflow-y: scroll;
  border-bottom: #e2e2e2 1px solid;
}

</style>
