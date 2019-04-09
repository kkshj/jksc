<template>
  <div class="page" @scroll="getMore">
    <div class='emp' v-if='prescriptionList.length === 0'>
      <img src='static/images/empty-prescription.png'>
      <span>你还没有处方笺</span>
    </div>

    <ul ref="listBox" class='section' v-if="prescriptionList.length > 0">
      <li v-for='item in prescriptionList' :class="item.statusCode === ('EXPIRED' || 'REFUNDED')  ? 'stoped' : item.statusCode === 'SEND' ? 'finish' : 'unpay'" @click='jumpTo("prescription", item.orderHeaderId)'>
        <div class='title'>
          <div>
            <span class='left'>{{item.organizationText}}</span>
            <span class='right'>{{item.statusText}}</span>
          </div>
          <div>
            <span class='left'>医生 | {{item.doctorName}}</span>
            <span class='left'>开方日期 | {{item.createdDate}}</span>
          </div>
        </div>
        <div class='contain'>
          <div>
            <label>姓名</label>
            <span>{{item.patientName}}</span>
          </div>
          <div>
            <label>科室</label>
            <span>{{item.departmentText}}</span>
          </div>
          <div>
            <div class='left'>
              <label>药品总额</label>
              <span>￥{{item.amount}}</span>
            </div>
            <button v-if='item.statusCode === "SIGNED" || item.statusCode === "AUDITED"' class='right'>去付款</button>
          </div>
        </div>
      </li>
    </ul>
    <notice v-if="notice" :message="notice"></notice>
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
    data () {
        return {
          prescriptionList: [],
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
      this.getInfo();
    },
    methods: {
      getInfo () {
        this.prescriptionList = [];
        this.getting = true;
        this.getPrescriptions(1);
      },
      getMore (e) {
        if (!this.getting) {
          let target = e.target || e.srcElement;
          let listHeight = this.$refs['listBox'].offsetHeight;
          let bottom = target.scrollTop + document.documentElement.offsetHeight;
          if (this.totalPages > 0 && (bottom >= listHeight - 200)) {
            this.getting = true;
            this.getPrescriptions(this.currentPage + 1)
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
      getPrescriptions(page) {
        const url = `${this.$conf.url}/internethospital/api/orders/prescriptions?user-id=${this.userId}&status=SIGNED&status=PAYED&status=PUSH_FAILED&status=PUSH_SUCCEED&status=AUDITED&status=SHIPPED&status=REFUNDED&status=EXPIRED&page-index=${page}&page-size=10`;
        this.$axios.get(url, {headers: this.header}).then(res => {
          if (page === 1) {
            this.totalPages = res.data.totalPages;
          } else {
            this.totalPages -= 1;
          }
          let content = res.data.content.filter(p => p.orderTypeCode === 'PRESCRIPTION' || (p.orderTypeCode === 'E_PRESCRIPTION' && p.statusCode !== 'SIGNED' ));
          for (let i in content) {
            content[i].createdDate = content[i].createdDate.slice(0, content[i].createdDate.indexOf(' ') + 1)
            if (content[i].amount && content[i].amount.toString().indexOf('.') < 0) {
              content[i].amount = '' + content[i].amount + '.00';
            } else if (content[i].amount && content[i].amount.toString().slice(content[i].amount.toString().indexOf('.') + 1).length !== 2) {
              content[i].amount = '' + content[i].amount + '0';
            }
          }
          this.prescriptionList = this.prescriptionList.concat(content);
          this.currentPage = page;
          this.getting = false;
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
  li{
    display: block;
    width: vm(690);
    height: vm(320);
    border-radius: vm(8);
    background-color: #ffffff;
    margin: vm(30) auto;
  }
  li>.title{
    box-sizing: border-box;
    width: 100%;
    height: vm(120);
    padding: vm(18) vm(30) 0 vm(30);
    color: #ffffff;
  }
  li>.title>div::after{
    content: '';
    display: block;
    clear: both;
  }
  li>.title>div:first-child>span.left{
    font-size: vm(32);
  }
  li>.title>div:first-child>span.right{
    font-size: vm(28);
  }
  li>.title>div:last-child{
    font-size: vm(26);
    margin-top: vm(14);
  }
  li>.title>div:last-child>span{
    margin-right: vm(100);
  }
  li>.contain{
    box-sizing: border-box;
    font-size: vm(28);
    padding: 0 vm(30);
  }
  li>.contain>div{
    margin-top: vm(14);
  }
  li>.contain>div:last-child{
    border-top: #e2e2e2 vm(1) solid;
    line-height: vm(80);
    color: #8f8f8f;
  }
  li>.contain>div:last-child button{
    width: vm(120);
    height: vm(48);
    color: #FE9B00;
    border: #FE9B00 1px solid;
    border-radius: vm(4);
    font-size: vm(28);
    padding: 0;
    margin-top: vm(18);
    line-height: vm(48);
    background-color: transparent;
  }
  li>.contain>div::after{
    content: '';
    display: block;
    clear: both;
  }
  li>.contain label{
    color: #999999;
    margin-right: vm(20);
  }
  li.unpay>.title{
    background-color: rgba(22, 169, 246, .8);
  }
  li.finish>.title{
    background-color: rgba(22, 169, 246, .8);
  }
  li.stoped>.title{
    background-color: #C8C8C8;
  }
</style>
