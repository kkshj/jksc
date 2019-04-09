<template>
    <div class="page" @scroll="getMore">
      <div class='emp' v-if='conversationList.length === 0'>
        <img src='static/images/empty-message.png'>
        <span>你还没有咨询消息</span>
      </div>
      <ul ref="listBox" class='contain' v-if='conversationList.length > 0' >
        <li v-for='item in conversationList' @click="jumpTo('chat', item.orderHeaderId)">
          <img class='left' :src='item.doctorAvatar || item.nurseAvatar || "static/images/defualt-header.png"'>
          <div class='left'>
            <div class='doctor'><span class='left'>{{item.doctorName || item.nurseName}}</span><span class='left'>{{item.departmentText}}</span><span class='right'>{{item.createdDate}}</span></div>
            <div class='patient'><span class='left'>就诊人 / {{item.patientName}}</span><span v-if='item.newMessage' class='tag right'></span></div>
            <img v-if='item.statusCode === "DOCTOR_COMPLETED" || item.statusCode === "AUTO_COMPLETED"' src='static/images/end.png'>
          </div>
        </li>
      </ul>
      <notice v-if="notice" :message="notice"></notice>
    </div>
</template>

<script>
  import NoticeDialog from './notice-dialog.component'
  import Notice from './notice.component'
  import Loading from './loading.component'
  import { mapState } from 'vuex'

  export default {
    name: "consultation",
    components: {
      NoticeDialog,
      Notice,
      Loading
    },
    data () {
        return {
          conversationList: [],
          notice: '',
          totalPages: 0,
          currentPage: 1,
          getting: false
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
      this.$store.commit('changePageType', 'main-page');
      this.getInfo();
    },
    methods: {
      getInfo () {
        this.conversationList = [];
        this.getting = true;
        this.getConsultations(1);
      },
      getMore (e) {
        if (!this.getting) {
          let target = e.target || e.srcElement;
          let listHeight = this.$refs['listBox'].offsetHeight;
          let bottom = target.scrollTop + document.documentElement.offsetHeight;
          if (this.totalPages > 0 && (bottom >= listHeight - 200)) {
            this.getting = true;
            this.getConsultations(this.currentPage + 1)
          } else {
            if (this.totalPages === 0) {
              this.notice = '没有更多了';
              this.getting = true;
              setTimeout(()=>{
                this.notice = ''
              }, 2000)
            }
          }
        }
      },
      getConsultations (page) {
        const url = `${this.$conf.url}/internethospital/api/orders/consultations?user-id=${this.userId}&status=PAYED&status=RECEIVED&status=DOCTOR_COMPLETED&status=AUTO_COMPLETED&page-index=${page}&page-size=10`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          if (page === 1) {
            this.totalPages = res.data.totalPages;
          } else {
            this.totalPages -= 1;
          }
          for (let i in res.data.content) {
            if (res.data.content[i].doctorAvatar && res.data.content[i].doctorAvatar.indexOf('qnfiles') > 0) {
              res.data.content[i].doctorAvatar = `${res.data.content[i].doctorAvatar}-doctor_list`
            }
            if (res.data.content[i].nurseAvatar && res.data.content[i].nurseAvatar.indexOf('qnfiles') > 0) {
              res.data.content[i].nurseAvatar = `${res.data.content[i].nurseAvatar}-doctor_list`
            }
            res.data.content[i].createdDate = res.data.content[i].createdDate.slice(0, res.data.content[i].createdDate.lastIndexOf(':'))
          }
          this.conversationList = this.conversationList.concat(res.data.content);
          this.currentPage = page;
          this.getting = false;
        }).catch(err => {
          this.notice = err.response.data.message;
          setTimeout(()=>{
            this.notice = ''
          }, 2000)
        })
      },
      jumpTo (route, id) {
        this.$store.commit('changePageType', 'package-page');
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

  .contain{
    min-height: 100vh;
    background-color: #ffffff;
  }
  li{
    display: block;
    box-sizing: border-box;
    width: 100vw;
    height: vm(160);
    border-bottom: #e2e2e2 vm(1) solid;
    padding:  vm(30);
    position: relative;
  }
  li::after{
    content: '';
    display: block;
    clear: both;
  }
  li>img{
    width: 10.66vw;
    height: 10.66vw;
    margin-right: 2.66vw;
    border-radius: 50%;
  }
  li>div.left{
    width: 78vw;
    height:  vm(140);
  }
  li>div.left>div::after{
    content: '';
    display: block;
    clear: both;
  }
  li>div.left>div.doctor{
    line-height:  vm(32);
    margin-top:  vm(10);
  }
  li>div.left>div.doctor>span:first-child{
    font-size:  vm(32);
    color: #333333;
  }
  li>div.left>div.doctor>span:nth-child(2){
    font-size:  vm(26);
    color: #666666;
    margin-left:  vm(20);
  }
  li>div.left>div.doctor>span:last-child{
    font-size:  vm(26);
    color: #999999;
  }
  li>div.left>div.patient{
    font-size:  vm(26);
    color: #999999;
    margin:  vm(15) 0 vm(20);
  }
  li>div.left>div.patient>.tag{
    display: block;
    width: vm(20);
    height: vm(20);
    border-radius: 50%;
    background-color: #FF624D;
  }
  li>div.left>div.conver{
    width: vm(496);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: vm(28);
    color: #666666;
  }
  li>div.left>img{
    position: absolute;
    bottom:  vm(10);
    right:  vm(50);
    width:  vm(120);
    height:  vm(120);
  }

</style>
