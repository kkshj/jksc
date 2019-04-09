<template>
  <div class="page" @scroll="getMore">
    <div class='emp' v-if='inquisitionList.length === 0'>
      <img src='static/images/empty-inquisition.png'>
      <span>你还没有问诊订单</span>
    </div>
	  <ul class='section' ref='listBox'>
	    <li v-for='(item,index) in inquisitionList' data-type='item.statusCode' data-evaluate='item.hasEvaluate' data-id='item.orderHeaderId' @click='getToDetail(item.statusCode,item.hasEvaluate,item.orderHeaderId)'>
	      <div class='header'>
	        <img class='left' src='/static/images/patient.png'>
	        <span class='left'>{{item.patientName}}</span>
	        <span class='right'>{{item.statusText}}</span>
	      </div>
	      <div class='doctor'>
	        <img :src='item.doctorAvatar || item.nurseAvatar' class='left'>
	        <div class='left'>
	          <div>
	            <span class='left'>{{item.doctorName || item.nurseName}}</span>
	            <span class='left' v-if='item.doctorPositionalTitleText || item.nursePositionalTitleText'>{{item.doctorPositionalTitleText || item.nursePositionalTitleText}}</span>
	          </div>
	          <div><span>{{item.organizationText}}</span><span>{{item.departmentText}}</span></div>
	          <div><span class='left'>诊费 ￥{{item.amount || 0}}</span></div>
	        </div>
	      </div>
	      <button :class='((item.statusCode === "CREATED") || (item.statusCode === "DOCTOR_COMPLETED") || (item.statusCode === "AUTO_COMPLETED")) && (!item.hasEvaluate) ? "fun-btn" : ""' class='right' data-status='item.statusCode' data-id='item.orderHeaderId' data-hasevaluate='item.hasEvaluate' @click='getToDetail(item.statusCode,item.hasEvaluate,item.orderHeaderId)'>{{item.statusCode === 'CREATED' ? '去付款' : ((item.statusCode === 'DOCTOR_COMPLETED') || (item.statusCode === 'AUTO_COMPLETED')) && (!item.hasEvaluate) ? '去评价' : '查看详情'}}</button>
	    </li>
	  </ul>
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
      inquisitionList: [],
      totalPages: 0,
      currentPage: 1,
      getting: false
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
    },
  }),
  activated() {
    this.$store.commit('changePageType', 'package-page');
    this.getInfo()
  },
  methods: {
    getInfo() {
    	this.inquisitionList=[]
      this.getting = true;
      this.getFirstInfo(1);
    },
    getFirstInfo(page) {
    	this.load_show=true
      const me = this;
      if (this.userId) {
        const url = `${this.$conf.url}/internethospital/api/orders/consultations?user-id=${this.userId}&page-index=${page}&page-size=10`;
        this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
          console.log(res);
            if (page === 1) {
              this.totalPages = res.data.totalPages;
            } else {
              this.totalPages -= 1;
            }
            let content = res.data.content;
            content = content.filter(c => c.statusCode !== 'CANCELED')
            for (let i in content) {
              if (!content[i].doctorAvatar && !content[i].nurseAvatar) {
                content[i].doctorAvatar = '/static/images/defualt-header.png';
              } else {
                if (content[i].doctorAvatar && content[i].doctorAvatar.indexOf('qnfiles') > 0) {
                  content[i].doctorAvatar = `${content[i].doctorAvatar}-doctor_list`
                }
                if (content[i].nurseAvatar && content[i].nurseAvatar.indexOf('qnfiles') > 0) {
                  content[i].nurseAvatar = `${content[i].nurseAvatar}-doctor_list`
                }
              }
              if (content[i].amount && content[i].amount.toString().indexOf('.') < 0) {
                content[i].amount = '' + content[i].amount + '.00'
              } else if (content[i].amount && (content[i].amount.toString().slice(content[i].amount.toString().indexOf('.') + 1).length !== 2)) {
                content[i].amount = '' + content[i].amount + '0';
              }
            }
            this.load_show=false
            this.inquisitionList = this.inquisitionList.concat(content);
            console.log(this.inquisitionList)
            this.currentPage = page;
            this.getting = false;
          
        })
      } else {
        this.notice_show = '请先完成注册，即将为您跳转到注册页面'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.push('/register-login')
        }, 2000)

      }
    },
    getMore(e) {
      if (!this.getting) {
        let target = e.target || e.srcElement;
        let listHeight = this.$refs['listBox'].offsetHeight;
        let bottom = target.scrollTop + document.documentElement.offsetHeight;
        if (this.totalPages > 0 && (bottom >= listHeight - 200)) {
          this.getting = true;
          this.getFirstInfo(this.currentPage + 1)
        } else {
          if (this.totalPages === 0) {
            this.getting = true;
            this.notice_show = '没有更多了'
            setTimeout(() => {
              this.notice_show = ''
            }, 2000)
          }
        }
      }
    },
    getToDetail(statusCode, hasEvaluate, orderHeaderId) {
      let url;
      if ((statusCode === 'AUTO_COMPLETED' || statusCode === 'DOCTOR_COMPLETED') && !hasEvaluate) {
        url = `/inquisition/evaluate/${orderHeaderId}`;
      } else {
        url = `/inquisition/${orderHeaderId}`;
      }
      this.$router.push(url)

    },

  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}


li {
  display: block;
  width: vm(690);
  border-radius: vm(8);
  background-color: #ffffff;
  margin: vm(30) auto;
}

li::after {
  content: '';
  display: block;
  clear: both;
}

.header {
  padding: vm(20) vm(30);
  border-bottom: #e2e2e2 1px solid;
}

.header::after {
  content: '';
  display: block;
  clear: both;
}

.header>img {
  width: vm(36);
  margin-right: vm(20);
}

.header>span.left {
  font-size: vm(28);
  color: #666666;
}

.header>span.right {
  font-size: vm(26);
  color: #16A9F6;
}

.doctor {
  padding: vm(20) vm(30) 0;
}

.doctor::after {
  content: '';
  display: block;
  clear: both;
}

.doctor>img.left {
  width: vm(100);
  height: vm(100);
  margin-right: vm(22);
  border-radius: 50%;
}

.doctor>div.left {
  max-width: vm(568);
}

.doctor>div.left>div {
  margin-bottom: vm(6);
}

.doctor>div.left>div::after {
  content: '';
  display: block;
  clear: both;
}

.doctor>span.left>div>span {
  font-size: vm(28);
  color: #666666;
}

.doctor>div.left>div:first-child>span:first-child {
  font-size: vm(32);
  font-weight: bold;
  margin-right: 2.6vw;
  color: #333333;
}

.doctor>div.left>div:first-child>span:nth-child(2) {
  font-size: vm(26);
  color: #B4B4B4;
}

.doctor>div.left>div:nth-child(2)>span {
  margin-right: vm(10);
}

.doctor>div.left>div:last-child {
  margin-bottom: 0;
}

.doctor>div.left>div:last-child>span:first-child {
  color: #999999;
}

li>button {
  font-size: vm(26);
  color: #999999;
  border: #999999 1px solid;
  background-color: transparent;
  height: vm(44);
  margin-right: vm(20);
  margin-bottom: vm(20);
  padding: 0 vm(12);
  line-height: vm(44);
}

li>button.fun-btn {
  color: #FE9B00;
  border: #FE9B00 1px solid;
}

</style>
