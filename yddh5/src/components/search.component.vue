<template>
  <div class="page" @scroll='getMore'>
    <div class='search-bar'>
      <div class='left'>
        <input placeholder='搜索医生' v-model='price' @keyup.13='search(price,1)' maxlength='6' ref="search" type='search' />
      </div>
      <span class='right' @click='cancel'>取消</span>
    </div>
    <div class='section'>
      <div class='history' v-if='beforeSearch'>
        <div class='title' v-if='historyList.length > 0'>
          <span class='left'>搜索历史</span>
          <img src='static/images/clean.png' class='right' @click='cleanHistory'>
        </div>
          <div class='content'>
            <i v-for='(item,index) in historyList' class='left' @click='search(item.name,1)'>{{item.name}}</i>
          </div>
        </div>
        <div class='emp' v-if='(!beforeSearch) && (docList.length === 0)'>
          <img src='static/images/empty-search.png'>
          <span>没有相关信息</span>
        </div>
        <div class='doctor' v-if='!beforeSearch' ref='listBox'>
          <li v-for='(item,index) in docList' @click='jumpTo(item)'>
            <img :src='item.doctorAvatar' class='left'>
            <div class='left'>
              <div>
                <span class='left'>{{item.doctorName}}</span>
                <span class='left'>{{item.positionalTitleText}}</span>
                <div class='left'><i v-for='(tag,idx) in item.labels' v-if='idx < 2' :style='(tag.colour ? "background-color:" + tag.colour : "color: #333333")'>{{tag.text}}</i></div>
                <span class='right' v-if='item.volunteers > 0'>{{item.volunteers}}</span>
              </div>
              <div><span>{{item.organizationText}}</span><span>{{item.departmentText}}</span></div>
              <div><span>{{item.text}}</span></div>
              <div><span class='left'>￥{{item.services[0].price}}/次</span><span class='right'>{{item.customerCount}}人已问诊</span></div>
            </div>
          </li>
        </div>
        <notice v-show='notice_show' :message="notice_show"></notice>
        <loading v-show='load_show'></loading>
      </div>
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
      notice_show: '',
      beforeSearch: true,
      price: '',
      historyList: [],
      docList: [],
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
    hospitalPorts(state) {
      if (state.hospitalPort === '') {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalPort
    },
    hospitalId(state) {
      if (state.hospitalId === '') {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalId
    },
  }),
  activated() {
    this.$store.commit('changePageType', 'package-page');
    let params = this.$route.query
    console.log(params)

    this.getInfo()
  },
  methods: {
    getInfo() {
      this.price=''
      this.docList=[]
      this.getHistory();
    },
    getMore(e) {
      if (!this.getting) {
        let target = e.target || e.srcElement;
        let listHeight = this.$refs['listBox'].offsetHeight;
        let bottom = target.scrollTop + document.documentElement.offsetHeight;
        if (this.totalPages > 0 && (bottom >= listHeight - 200)) {
          this.getting = true;
          this.search(this.price, this.currentPage + 1)
        } else {
          if (this.totalPages ===0) {
                this.getting = true;
          this.notice_show = `没有更多了`
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
          }
        }
      }
    },
    search(price, page) {
      if(page==1){
        this.docList=[]
      }
      this.price=price
      this.$refs.search.blur()
      this.load_show=true
      const me = this;
      const defualtHeaderUrl = '/static/images/defualt-header.png';
      let searchHistory = [];
      let value = price;
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/g.test(value)) {
        this.notice_show = '请输入医生姓名（汉字/英文/数字）'
        setTimeout(() => {
          this.notice_show = ''
        }, 1500)
        return;
      }
      searchHistory = searchHistory.concat(this.historyList);
      if (!searchHistory.find(h => h.name === value)) {
        searchHistory.unshift({ name: value });
      }
      if (searchHistory.length > 10) {
        searchHistory.pop();
      }
      this.historyList = searchHistory

      value = encodeURI(value);
      // wx.setStorageSync('searchHistory', searchHistory)

      localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

      console.log(JSON.parse(localStorage.getItem('searchHistory')))
      let url = `${me.$conf.url}/internethospital/api/doctors?page-index=${page}&page-size=10&name=${value}`;
      if (me.hospitalPort) {
        url = `${url}&organization-id=${me.hospitalId}`
      }
      console.log('url::', url)
      console.log('value::', value)
      me.$axios.get(url, { 'content-type': 'application/json' }).then(res => {
        if (page === 1) {
          this.totalPages = res.data.totalPages;
        } else {
          this.totalPages -= 1;
          console.log(this.totalPages)
        }
        console.log(res);
          let content = res.data.content
          content = content.filter(con => con.services.length > 0);
          for (let i in content) {
            let serverIdx = content[i].services.indexOf(content[i].services.find(ser => ser.code === 'CONSULT'));
            if (serverIdx > 0) {
              content[i].services[0] = [content[i].services[serverIdx], content[i].services[serverIdx] = content[i].services[0]][0];
            }
            if (!content[i].doctorAvatar) {
              content[i].doctorAvatar = defualtHeaderUrl;
            } else {
              content[i].doctorAvatar = `${content[i].doctorAvatar}-doctor_list`
            }
            if (content[i].services.find(ser => ser.code === 'CONSULT_FREE') && (content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity || content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity > 0)) {
              content[i].volunteers = content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity
            }
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

          me.docList = this.docList.concat(content)

          me.beforeSearch = false
          this.currentPage = page;
          this.load_show=false;
             this.getting = false;
     
      })

    },
    cancel() {
      console.log('back to index');
      // wx.navigateBack({ changed: true });
      this.$router.back()
    },
    getHistory() {
      console.log('OK')
      const me = this;
      me.historyList = []
      let searchHistory = JSON.parse(localStorage.getItem('searchHistory'))

      if (searchHistory) {
        me.beforeSearch = true
        me.historyList = searchHistory
         console.log( me.historyList)
      }
    },
    cleanHistory() {
      localStorage.removeItem('searchHistory')
      this.notice_show = '清除成功'
      setTimeout(() => {
        this.notice_show = ''
        this.$router.go(0)
      }, 1500)

    },
    jumpTo(item) {
      console.log(item)
      this.$store.commit('changePageType', 'package-page');
      let url;
        if(item.doctorId){
          url=`/doctor/${item.doctorId}`
        }else{
           url=`/nurse/${item.doctorId}`
        }
      this.$router.push(url);
    }

  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}

.search-bar {
  position: fixed;
  top: 0;
  box-sizing: border-box;
  width: 100vw;
  height: 11.73vw;
  background-color: #16A9F6;
  padding: 1.86vw 4vw;
}

.search-bar>div {
  display: flex;
  box-sizing: border-box;
  width: 80vw;
  padding-left: 9.33vw;
  padding-right: 9.33vw;

  justify-content: center;
  line-height: 8vw;
  vertical-align: bottom;
  background-color: white;
  border-radius: 4vw;
  background-image: url('data:image/png;base64,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');
  background-size: 3.73vw;
  background-repeat: no-repeat;
  background-position: 2.6vw center;
}

.search-bar input {
  display: block;
  width: 100%;
  min-height: auto;
  height: 8vw;
  font-size: vm(26);
  color: #737E81;
}

.search-bar span {
  font-size: vm(28);
  color: white;
  line-height: 8vw;
}

.section {
  margin-top: 12vw
}
.history>.title {
  box-sizing: border-box;
  width: 100vw;
  margin: 2.6vw auto;
  padding: 0 4vw;
}

.history>.title::after {
  content: '';
  display: block;
  clear: both;
}

.history>.title>.left {
  font-size: vm(26);
  color: #999999;
}

.history>.title>.right {
  width: 6.4vw;
}

.history>.content {
  box-sizing: border-box;
  width: 100vw;
  padding: 0 4vw;
}

.history>.content::after {
  content: '';
  display: block;
  clear: both;
}

.history>.content>i {
  padding: vm(10) vm(18);
  background-color: #F0F0F0;
  font-size: vm(28);
  border-radius: vm(4);
  margin-right: vm(30);
  margin-bottom: vm(30);
  color: #666666;
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

.doctor li>img {
  width: vm(100);
  height: vm(100);
  border-radius: 50%;
  overflow: hidden;
  margin-right: vm(22);
}

/* .doctor li>image{
  width: 100rpx;
  margin-right: 22rpx;
} */
.doctor li>div.left {
  width: vm(568);
}

.doctor li>div.left>div {
  margin-bottom: vm(15);
  line-height: vm(30);
  vertical-align: bottom;
}

.doctor li>div.left>div::after {
  content: '';
  display: block;
  clear: both;
}

.doctor li>div.left>div>span {
  display: inline-block;
  font-size: vm(26);
  color: #999999;
  vertical-align: bottom;
}

.doctor li>div.left>div:first-child>span:first-child {
  font-size: vm(32);
  font-weight: bold;
  margin-right: 2.6vw;
  color: #333333;
}

.doctor li>div.left>div:first-child>div {
  display: inline-block;
  margin-left: vm(10);
}

.doctor li i {
  padding: vm(5);
  color: #ffffff;
  font-size: vm(20);
  border-radius: vm(4);
  margin-left: vm(10);
  vertical-align: top
}

.doctor li>div.left>div:first-child>span:nth-child(2-4) {
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

.doctor li>div.left>div:nth-child(2)>span {
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
