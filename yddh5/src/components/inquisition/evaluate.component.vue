<template>
  <div class="page">
    <div class='section'>
      <div class='score'>
        <span class='left'>服务态度</span>
        <div class='left rate'>
          <span :class='attitudeRate >= 1 ? "full" : "none"' class='left' data-value='1' @click='setAttitudeScore(1)'></span>
          <span :class='attitudeRate >= 2 ? "full" : "none"' class='left' data-value='1' @click='setAttitudeScore(2)'></span>
          <span :class='attitudeRate >= 3 ? "full" : "none"' class='left' data-value='1' @click='setAttitudeScore(3)'></span>
          <span :class='attitudeRate >= 4 ? "full" : "none"' class='left' data-value='1' @click='setAttitudeScore(4)'></span>
          <span :class='attitudeRate >= 5 ? "full" : "none"' class='left' data-value='1' @click='setAttitudeScore(5)'></span>
        </div>
      </div>
      <div class='score'>
        <span class='left'>回复及时性</span>
        <div class='left rate'>
          <span :class='timelyRate >= 1 ? "full" : "none"' class='left' data-value='1' @click='setTimelyScore(1)'></span>
          <span :class='timelyRate >= 2 ? "full" : "none"' class='left' data-value='1' @click='setTimelyScore(2)'></span>
          <span :class='timelyRate >= 3 ? "full" : "none"' class='left' data-value='1' @click='setTimelyScore(3)'></span>
          <span :class='timelyRate >= 4 ? "full" : "none"' class='left' data-value='1' @click='setTimelyScore(4)'></span>
          <span :class='timelyRate >= 5 ? "full" : "none"' class='left' data-value='1' @click='setTimelyScore(5)'></span>
        </div>
      </div>
      <form @submit.prevent="submitEval">
        <textarea placeholder="请对医生的服务作出客观的评价，让医生的服务做得更好..." v-model="evaluate" />
        <button type="submit"> 匿名提交 </button>
  </form>
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
	export default{
		data(){
			return{
		     message: '',
		     load_show: false,
		     notice_show: '',				
			attitudeRate: 0,
		    timelyRate: 0,
		    evaluate:'',
		    orderId: ''
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
		  }),  
		activated(){	
	        let params =this.$route.params	
	        console.log(params)
	        this.orderId=params.id
			},
		methods:{
		setAttitudeScore (e) {
		      this.attitudeRate=parseInt(e)
		  },
		  setTimelyScore (e) {
		      this.timelyRate=parseInt(e)
		  },
	  submitEval (e) {
	  	this.load_show=true
	    const url = `${this.$conf.url}/internethospital/api/evaluations/`;
	    const data = {
	      orderHeaderId: this.orderId,
	      attitude: this.attitudeRate,
	      promptness: this.timelyRate,
	      evaluation: this.evaluate
	    }
	    this.$axios.post(url,data,{headers:this.$store.state.header}).then(res=>{
	  console.log(res)
	  		this.load_show=false
	        this.notice_show = '评价成功'
	        setTimeout(() => {
	          this.notice_show = ''
	          this.$router.back()
	        }, 2000)    			
	    })
	  
	  }
		}
	}
</script>
<style type="text/css" scoped lang='scss'>
	@function vm($px){
		@return ($px / 750) * 100vw
	}
	.page{
		background-color: #fff;
	}
.section{
  margin-top: vm(30);
}

.score{
  box-sizing: border-box;
  height: vm(80);
  padding: vm(25) vm(30);
}

.score>span{
  display: block;
  width:vm(190);
  line-height:vm(48);
  font-size:vm(30);
}

.rate::after{
  content: '';
  display: block;
  clear: both;
}
.rate>span{
  display: inline-block;
  width:vm(48);
  height:vm(48);
  margin-right:vm(10);
  background-size:vm(48);
  background-position: center;
  background-repeat: no-repeat;
}
.rate>span.full{
  background-image: url('data:image/png;base64,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');
}
.rate>span.none{
  background-image: url('data:image/png;base64,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');
}

.section>form{
  display: block;
  box-sizing: border-box;
  width: 100vw;
  padding:vm(50) vm(30);
}
.section textarea{
  width: 100%; 
  border: #C8C8C8 1px solid;  
  border-radius: vm(8); 
  padding:vm(20); 
  box-sizing: border-box; 
  font-size:vm(28); 
  line-height: vm(32);
  height: vm(300)
}
.section button{
  display: block;
  width:vm(580);
  margin:vm(140) auto 0;
  background-color: #16A9F6;
  border-radius:vm(8);
  color: #ffffff;
  padding: vm(30)
}
</style>
