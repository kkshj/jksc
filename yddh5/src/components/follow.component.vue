<template>
  <div class="page">
    <div class='emp' v-if='doctorList.length === 0'>
      <img src='static/images/empty-follow.png'>
      <span>你还没有关注医生</span>
    </div>
    <div class='section'>
      <div class='doctor'  v-if='doctorList.length > 0'>
        <li v-for='(item,index) in doctorList' :key='item.doctorId' @click='jumpTo(item)'>
          <img :src='item.doctorAvatar' class='left'>
          <div class='left'>
            <div>
              <span class='left'>{{item.doctorName}}</span>
              <span class='left'>{{item.positionalTitleText ? item.positionalTitleText : item.standPositionalTitleText}}</span>
              <span class='right' v-if='item.volunteers > 0'>义诊{{item.volunteers}}</span>
            </div>
            <div><span>{{item.organizationText}}</span><span>{{item.departmentText}}</span></div>
            <div><span>{{item.text}}</span></div>
            <div><span class='left'>￥{{item.services[0].price}}/次</span><span class='right'>{{item.customerCount}}人已问诊</span></div>
          </div>
        </li>
      </div>
      <div class='doctor' v-if='nurseList.length>0'>
        <li v-for='(item,index) in nurseList' :key='item.nurseId' @click='jumpTo(item)'>
          <img :src='item.nurseAvatar' class='left'>
          <div class='left'>
            <div>
              <span class='left'>{{item.nurseName}}</span>
              <span class='left'>{{item.positionalTitleText ? item.positionalTitleText : item.standPositionalTitleText}}</span>
              <span class='right' v-if='item.volunteers > 0'>义诊{{item.volunteers}}</span>
            </div>
            <div><span>{{item.organizationText}}</span><span>{{item.departmentText}}</span></div>
            <div><span>{{item.text}}</span></div>
            <div><span class='left'>￥{{item.services[0].price}}/次</span><span class='right'>{{item.customerCount}}人已问诊</span></div>
          </div>
        </li>
      </div>
    </div>
    <notice v-show='notice_show' :message="notice_show"></notice>
    <loading v-show='load_show'></loading>
  </div>
</template>
<script type="text/javascript">
import NoticeDialog from './notice-dialog.component'
import Notice from './notice.component'
import Loading from './loading.component'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      message: '',
      load_show: false,
      notice_show:'',
      doctorList: [],
      nurseList: []
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
    },
    userId(state) {
      if (state.userId === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.userId
    }
  }),
  activated() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.getRirstInfo()
    },
    getRirstInfo() {
      const me = this;
      console.log(me.userId)
      if (me.userId) {
        const defualtHeaderUrl = '/static/images/defualt-header.png';
        const url = `${me.$conf.url}/internethospital/api/users/${me.userId}/favorites/doctors?page-index=1&page-size=10000`;
        me.$axios.get(url,{ headers: this.$store.state.header }).then(res => {
          console.log(res);
            let content = res.data.content;
            for (let i in content) {
              let serverIdx = content[i].services.indexOf(content[i].services.find(ser => ser.code === 'CONSULT'));
              if (serverIdx > 0) {
                content[i].services[0] = [content[i].services[serverIdx], content[i].services[serverIdx] = content[i].services[0]][0];
              }
              if (!content[i].doctorAvatar) {
                content[i].doctorAvatar = defualtHeaderUrl;
              } else {
                content[i].doctorAvatar = `${content[i].doctorAvatar}-doctor_list`;
              }
              if (content[i].services.find(ser => ser.code === 'CONSULT_FREE') && (content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity || content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity > 0)) {
                content[i].volunteers = content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity
              }
              content[i].text = content[i].text.length < 35 ? content[i].text : content[i].text.slice(0, 36) + '...';
              if (content[i].services[0] && content[i].services[0].price.toString().indexOf('.') < 0) {
                content[i].services[0].price = '' + content[i].services[0].price + '.00'
              } else if (content[i].services[0] && (content[i].services[0].price.toString().slice(content[i].services[0].price.toString().indexOf('.') + 1).length !== 2)) {
                content[i].services[0].price = '' + content[i].services[0].price + '0';
              }
              content[i].text = content[i].text.length < 35 ? content[i].text : content[i].text.slice(0, 36) + '...';
              let customerOrders = content[i].statistics.filter(s => s.type === 'ORDER');
              let customerCount = 0;
              for (let item of customerOrders) {
                customerCount += item.quantity
              }
              content[i].customerCount = customerCount;
            }
            me.doctorList = content
      
        })
        const urlN = `${me.$conf.url}/internethospital/api/users/${me.userId}/favorites/nurses?page-index=1&page-size=10000`;
        me.$axios.get(urlN,{ headers: this.$store.state.header }).then(res => {
          console.log(res);
            let content = res.data.content
            content = content.filter(con => con.services.length > 0);
            for (let i in content) {
              let serverIdx = content[i].services.indexOf(content[i].services.find(ser => ser.code === 'CONSULT'));
              if (serverIdx > 0) {
                content[i].services[0] = [content[i].services[serverIdx], content[i].services[serverIdx] = content[i].services[0]][0];
              }
              if (!content[i].nurseAvatar) {
                content[i].nurseAvatar = defualtHeaderUrl;
              } else {
                content[i].nurseAvatar = `${content[i].nurseAvatar}-doctor_list`
              }
              if (content[i].services.find(ser => ser.code === 'CONSULT_FREE') && (content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity || content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity > 0)) {
                content[i].volunteers = content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity
              }
              content[i].text = content[i].text.length < 35 ? content[i].text : content[i].text.slice(0, 36) + '...';
              if (content[i].services[0] && content[i].services[0].price.toString().indexOf('.') < 0) {
                content[i].services[0].price = '' + content[i].services[0].price + '.00'
              } else if (content[i].services[0] && (content[i].services[0].price.toString().slice(content[i].services[0].price.toString().indexOf('.') + 1).length !== 2)) {
                content[i].services[0].price = '' + content[i].services[0].price + '0';
              }
              let customerOrders = content[i].statistics.filter(s => s.scene === 'CONSULTATION' && s.orderTypeId == null);
              let customerCount = 0;
              for (let item of customerOrders) {
                customerCount += item.quantity
              }
              content[i].customerCount = customerCount;
            }
            me.nurseList = content
     
        })

      } else {

        this.notice_show = '请先完成注册，即将为您跳转到注册页面'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.push('/register-login')
        }, 2000)

      }
    },
    jumpTo(item) {
      this.$store.commit('changePageType', 'package-page');
      if (item.doctorId) {
        this.$router.push(`/doctor/${item.doctorId}`);
      } else {
        this.$router.push(`/nurse/${item.nurseId}`);
      }

    }

  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}



.section {
  height: 100vh;
 
}

.doctor li {
  box-sizing: border-box;
  display: block;
  width: 100vw;
  padding: 3.9vw 4vw 2.6vw;
  background-color: #ffffff;
  margin-top: 1px;
}

.doctor li::after {
  content: '';
  display: block;
  clear: both;
}

.doctor li>img.left {
  width: vm(100);
  height: vm(100);
  margin-right: vm(22);
  border-radius: 50%;
}

.doctor li>div.left {
  width: vm(568);
}

.doctor li>div.left>div {
  margin-bottom: vm(15);
}

.doctor li>div.left>div::after {
  content: '';
  display: block;
  clear: both;
}

.doctor li>div.left>div>span {
  font-size: vm(26);
  color: #999999;
}

.doctor li>div.left>div:first-child>span:first-child {
  font-size: vm(32);
  font-weight: bold;
  margin-right: 2.6vw;
  color: #333333;
}

.doctor li>div.left>div:first-child>span:nth-child(2-3) {
  font-size: vm(26);
  color: #B4B4B4;
  margin-top: vm(6);
  margin-right: vm(6);
}

.doctor li>div.left>div:first-child>span.right {
  box-sizing: border-box;
  height: vm(36);
  border-radius: vm(18);
  font-size: vm(26);
  color: #FF6E5A;
  line-height: vm(36);
  padding-left: vm(40);
  padding-right: vm(14);
  text-align: center;
  background-color: #F0F0F0;
  background-image: url('data:image/png;base64,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');
  background-repeat: no-repeat;
  background-size: vm(28);
  background-position: vm(5) center;
}

.doctor li>div.left>div:nth-child(2)>div {
  font-size: vm(28);
  margin-right: vm(10);
}

.doctor li>div.left>div:last-child {
  border-top: #f0f0f0 1px solid;
  padding-top: 2.6vw;
}

.doctor li>div.left>div:last-child>span:first-child {
  color: #666666;
}

</style>
