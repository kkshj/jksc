<template>
  <div class="page">
    <div v-if='cardList.length === 0' class='addCard' @click='addNew'>
      添加本人就诊卡
    </div>
    <div v-if='cardList.length > 0' class='title'>
      <span class='left'>医疗就诊卡</span>
      <span class='right' @click='addNew'>添加</span>
    </div>
    <div v-for='(item,index) in cardList' :key='item.id' class='card'>
      <div>
        <img class='left' :src='item.hospitalLogoUrl'>
        <span class='left'>{{item.hospitalText}}</span>
        <i class='right'>{{item.cardType}}</i>
      </div>
      <span>{{item.cardNumber}}</span>
</div>
      <div class='bottom'></div>
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
      cardList: [],
      id: '',
      cardId: '',
      notice:true,
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
      this.getFirstInfo(params.id);    	 		
    },
    getFirstInfo(id) {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/patients/${id}/medical-cards`;
      this.$axios.get(url,{ headers: this.$store.state.header }).then(res => {
        console.log(res);
          for (let i in res.data) {
            let arr = []
            for (let j = 0; j < res.data[i].cardNumber.length; j += 4) {
              console.log(res.data[i].cardNumber.slice(j, j + 4))
              arr.push(res.data[i].cardNumber.slice(j, j + 4))
            }
            res.data[i].cardNumber = arr.join(' ');
          }
          me.cardList = res.data
      })

    },
    addNew() {
      const url = `/patient/card/create/${this.id}`;
        this.$router.push(url)
    },
    confirmDelete(id) {
      this.notice = true
      this.cardId = id
    },
    dontDo() {
      this.notice = false
    },
    deleteCard(e) {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/patients/${this.id}/medical-cards/${this.cardId}`;
      this.$axios.delete(url, { 'Authorization': 'Bearer ' + this.token }).then(res => {
        console.log(res);
        this.notice = false
          this.notice_show = '删除成功！'
          setTimeout(() => {
            this.notice_show = ''
            me.getFirstInfo(me.id);
          }, 2000)
      })

    },
 
  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px){
	@return ($px / 750) * 100vw
}
/*.page{
  background-color: #eff5f8;
}
*/
.addCard{
  width: vm(690);
  height: vm(180);
  background-color: #ffffff;
  margin: vm(50) auto;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAB3klEQVRoQ+2aO07DQBCG/7ETBIEuJDRInAGkIPEKh0BgKjgEDZyAFFwCKpyIQxBeEkhwBZCoElLiQBx7kEVDHoRotRtkZ1xa3pn9v/k9q10tIaEPJVQXRFjcKmu+YmW2Zy1/0QramxGc0E5dvoXpJ+xQYBKWcWG5SnODQpwBPP8thF7Zwl59e+oq1sLyrncNYK1LxE3NyazHWtic630yMNElwq85me53WnUat2Le9bjfjGtOxmhuo8EjQSJMqxFhfoGWiknFhiMgzWM4Tr1fyT+mSu6XcWJFVaBiRVVyYkXN5MSKmoGOUVcss53Dxwoxlwgo9NkkamarFo6AFgMPTHRYx+Rd9xlKT8Wy5+8FG1QBYUEt5ahH0XPA4U5jd/rhZ+YeYXnXOwBQApAa9RQV87WB8KjmzJyMp7DsRatg++34WJHxEqRT242ticFWRNQ8qL1KoX8MxjIIaUWLmB3G8EG4Zyt9VOfU7Z/NQ/dsZIHWTHSMFmjN5MSKmoGKFVWBihVVyckOWjM5saJmoNIVVYGKFVXJSVfUTC6xVkzydYhkXmDJuc0iAacdV46A/bozVdXs+o5wxtex6AwlG3pLNlExyhwwVxtW5jH2l8RMVmVQbPMV+ydlIuyfwCun/QLhLfs3BebVjAAAAABJRU5ErkJggg==');
  background-repeat: no-repeat;
  background-position: center vm(40);
  background-size:vm(36);
  border-radius:vm(10);
  text-align: center;
  color: #16A9F6;
  font-size:vm(30);
  line-height:vm(220);
}

.title{
  padding: vm(30);
  padding-bottom: 0;
  font-size:vm(30);
}
.title::after{
  content: '';
  display: block;
  clear: both;
}
.title>.left{
  color: #333333;
}
.title>.right{
  width: vm(200);
  color: #16A9F6;
  text-align: right;
}

.card{
  width:vm(690);
  height: vm(180);
  border-radius: vm(10);
  margin:vm(30) auto;
  box-sizing: border-box;
  padding:vm(20) vm(30);
  position: relative;
  overflow: hidden;
}
.card:nth-child(5n){
  background-image: linear-gradient(to left, #5AD0A7, #6BC9F4);  
}
.card:nth-child(5n+1){
  background-image: linear-gradient(to left, #A58BEE, #739DF1);  
}
.card:nth-child(5n+2){
  background-image: linear-gradient(to left, #4FD882, #67C6D1);  
}
.card:nth-child(5n+3){
  background-image: linear-gradient(to left, #4BD4E7, #77ACF4);  
}
.card:nth-child(5n+4){
  background-image: linear-gradient(to left, #33DDBF, #ADE16A);  
}
.card>div::after{
  content: '';
  display: block;
  clear: both;
}
.card>div:first-child>img{
  width:vm(50);
  height:vm(50);
  border-radius: 50%;
  margin-right:vm(20);
}
.card>div:first-child>div{
  font-size:vm(36);
  color: #ffffff;
  line-height:vm(50);
}
.card>div:first-child>i{
  color: #ffffff;
  font-size:vm(28);
}
.card>span{
  display: block;
  margin-top:vm(40);
  font-size:vm(30);
  color: #ffffff;
}
.card>img{
  width:vm(48);
  position: absolute;
  right: 0;
  bottom: 0;
}

.bottom{
  height:vm(50);
}
</style>
