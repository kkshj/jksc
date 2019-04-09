<template>
  <div class="page" @scroll='getMore'>
    <div class='search-bar'>
        <img class='search-img' src="static/images/nurse-top.png">
     <!--  <router-link to='/search'>
        <div class="weash"></div>
        <div class='left'>
          <input placeholder='搜索医生' disabled />
        </div>
      </router-link> -->
    </div>
    <div class='screen'>
      <div v-if='!hospitalPort' data-name='hospital' @click='quickSearch("hospital")'>
        <span :class="[searchType === 'hospital' ?colr.chos :colr.co,hospitalChosen?colr.chang:colr.co]">{{hospitalChosen ? hospitalChosen.text : '医院'}}</span>
      </div>
      <div data-name='department' @click='quickSearch("department")'>
        <span :class='[searchType === "department"?colr.chos:colr.co,secondChosen?colr.chang:colr.co]'>{{secondChosen ? secondChosen.text : '科室'}}</span>
      </div>
      <div data-name='automaticSort' @click='quickSearch("automaticSort")' :class='searchType?colr.chang:colr.co'>
        <span :class='[searchType === "automaticSort" ?colr.chos:colr.co]'>排序</span>
      </div>
    </div>
    <div class='quickSearchBoard department' v-if='searchType == "department"' @click='cancelSearch'>
      <div>
        <ul class='left first'>
          <li v-for='(item,index) in firstDepartment' :data-id='item.id' :class='firstChosen.id === item.id ? colr.chos :colr.co' @click='chooseFirstD(item.id)'>{{item.text}}</li>
        </ul>
        <ul class='right second'>
          <li v-for='(item,index) in secondDepartment' :data-id='item.id' :class='secondChosen&&(secondChosen.id === item.id)? colr.chos :colr.co' @click='chooseSecondD(item.id)'>{{item.text}}</li>
        </ul>
      </div>
    </div>
    <div class='quickSearchBoard hospital' v-if='searchType === "hospital"' @click='cancelSearch'>
      <div>
        <li v-for='(item,index) in hospitalList' :data-id='item.id' @click='chooseHospital(item.id)' :class='hospitalChosen && (hospitalChosen.id === item.id) ? colr.chos :colr.co'>
          <img :src='item.logoUrl' class='left'>
          <span class='left'>{{item.text}}</span>
          <small class='left' v-if='item.label'>{{item.label}}</small>
        </li>
      </div>
    </div>
    <div class='quickSearchBoard automaticSort' v-if='searchType === "automaticSort"' @click='cancelSearch'>
      <div>
        <li :class='[showType == "CONSULT" ? colr.chos : colr.co]' data-type='CONSULT' @click='sortList("CONSULT")'>推荐排序</li>
        <!-- <li class='{{showType === "CONSULT_FREE" ? "chosen" : ""}}'  data-type='CONSULT_FREE' bindtap='sortList'>按义诊数排序</li> -->
      </div>
    </div>
    <div class='emp' v-if='docList.length === 0'>
      <img src='static/images/empty-doctor.png'>
      <span>没有匹配到符合该条件的医生</span>
    </div>
    <div class='section' v-if='docList.length > 0' ref='secList'>
      <div class='doctor'>
        <ul>
          <li v-for='(item,index) in docList' v-if='showType === "CONSULT_FREE" ? item.volunteers > 0 : true' :key='item.nurseId' :data-code='item.code' @click='jumpTo(item.nurseId)'>
            <img :src='item.doctorAvatar' class='left'>
            <div class='left'>
              <div>
                <span class='left'>{{item.nurseName}}</span>
                <span class='left'>{{item.positionalTitleText ? item.positionalTitleText : item.standPositionalTitleText}}</span>
                <div class='left'><small v-for='(tag,idx) in item.labels' v-if='idx < 2' style='tag.colour ?"background-color:"+ tag.colour : "color: #333333"'>{{tag.text}}</small></div>
                <span class='right' v-if='item.volunteers'>义诊{{item.volunteers}}</span>
              </div>
              <div><span>{{item.organizationText}}</span><span>{{item.departmentText}}</span></div>
              <div><span>{{item.text}}</span></div>
              <div><span class='left'>￥{{item.services[0].price}}/次</span><span class='right'>{{item.customerCount}}人已问诊</span></div>
            </div>
          </li>
        </ul>
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
  name: "doctor",
  data() {
    return {
      message: '',
      load_show: false,
      notice_show: '',
      searchType: '',
      docList: [],
      firstDepartment: [],
      firstChosen: null,
      secondDepartment: [],
      secondChosen: null,
      hospitalList: [],
      hospitalChosen: null,
      sortType: 'CONSULTATION_QUANTITY',
      showType: '',
      pages: 1,
      hadMore: false,
      hospitalPort: false,
      standDepartment: false,
      colr: {
        co: '',
        chos: 'chosen',
        chang: 'changed'
      }
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
      if (state.hospitalPort === '' && JSON.parse(localStorage.getItem('hospitalInfo'))) {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalPort
    },
    hospitalId(state) {
      if (state.hospitalId === '' && JSON.parse(localStorage.getItem('hospitalInfo'))) {
        this.$store.commit('setHospital', JSON.parse(localStorage.getItem('hospitalInfo')));
      }
      return state.hospitalId
    },

  }),
  beforeRouteLeave(to, from, next) {
    if (to.path == '/home') {
      this.$destroy()
    }
    next();
  },
  activated() {
    let params = this.$route.query
    this.hadMore = true
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      this.hospitalList = [];
      this.pages = 1
      this.getLaodInfo(params)
    },
    getLaodInfo(params) {
      const me = this;
      if (params.type === 'department' && params.departmentId === 'another') {
        let data = params.type
        me.quickSearch(data);
        me.getFirstInfo('refresh');
        return;
      }
      if (params.type === 'department') {
        let urlD = `${this.$conf.url}/internethospital/api/departments/${params.departmentId}`;
        console.log(params);

        this.standDepartment = true
        this.$axios.get(urlD, { headers: this.$store.state.header }).then(res => {
          console.log(res)
          if (res.statusCode >= 200 && res.statusCode <= 399) {

            me.secondChosen = res.data

            me.getFirstInfo('refresh');
            return;
          } else {
            this.notice_show = '链接出错，请检查网络链接'
            setTimeout(() => {
              this.notice_show = ''
              me.searchType = ''
            }, 2000)
          }
        }).catch(err => {
          this.notice_show = err.response.data.message
          setTimeout(() => {
            this.notice_show = ''
          }, 2000)
        })
      }
      if (params.type !== 'department') {
        this.showType = params.type
        console.log(this.showType)
        this.getFirstInfo('refresh');
      }
    },
    getFirstInfo(type) {
      this.load_show = true
      const me = this;
      if (this.hospitalPorts) {
        this.hospitalPort = true
      }
      const defualtHeaderUrl = 'static/images/defualt-header.png';
      let url = `${this.$conf.url}/internethospital/api/nurses?page-index=${this.pages}&page-size=10`;
      url = this.showType === 'CONSULT_FREE' ? `${url}&product-code=CONSULT_FREE` : `${url}&product-code=CONSULT&product-code=CONSULT_FREE`;
      url = `${url}&sort-method=${this.sortType}`;
      if (this.hospitalPorts) {
        url = `${url}&organization-id=${this.hospitalId}`
      }
      if (this.hospitalChosen) {
        if (this.hospitalChosen.id !== 'default') {
          url = `${url}&organization-id=${this.hospitalChosen.id}`
        }
      }
      if (this.secondChosen) {
        if (this.secondChosen.id !== 'default') {
          if (!this.secondChosen.parentId) {
            if (this.hospitalPorts && !this.standDepartment) {
              url = `${url}&parent-department-id=${this.secondChosen.id}`;
            } else {
              url = `${url}&parent-standard-department-id=${this.secondChosen.id}`;
            }
          } else {
            if (this.hospitalPorts && !this.standDepartment) {
              url = `${url}&department-id=${this.secondChosen.id}`;
            } else {
              url = `${url}&standard-department-id=${this.secondChosen.id}`;
            }
          }
        }
      }
      this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
        console.log(res)
        if (this.pages === 1) {
          this.totalPages = res.data.totalPages;
        } else {
          this.totalPages -= 1;
        }
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
          if (content[i].services.find(ser => ser.code === 'CONSULT_FREE')) {
            content[i].volunteers = content[i].services.find(ser => ser.code === 'CONSULT_FREE').inventoryQuantity
          }
          if (content[i].services[0] && content[i].services[0].price.toString().indexOf('.') < 0) {
            content[i].services[0].price = '' + content[i].services[0].price + '.00'
          } else if (content[i].services[0] && (content[i].services[0].price.toString().slice(content[i].services[0].price.toString().indexOf('.') + 1).length !== 2)) {
            content[i].services[0].price = '' + content[i].services[0].price + '0';
          }
          content[i].text = content[i].text.length < 35 ? content[i].text : content[i].text.slice(0, 36) + '...';
          let customerOrders = content[i].statistics.filter(s => s.scene === 'CONSULTATION' && s.orderTypeId == null);
          let customerCount = 0;
          for (let item of customerOrders) {
            customerCount += item.quantity
          }
          content[i].customerCount = customerCount;
        }
        console.log(content)
        this.load_show = false
        if (type === 'refresh') {
          me.docList = content
          this.hadMore = false
          return;
        }
        if (type === 'more') {
          content = me.docList.concat(content);
          if (content.length === 0) {

            this.notice_show = '没有更多了'
            setTimeout(() => {
              this.notice_show = ''
            }, 2000)
            this.hadMore = false
          }
          this.hadMore = false
          this.docList = content

          return;
        }
      }).catch(err => {
        this.notice_show = err.response.data.message
        setTimeout(() => {
          this.notice_show = ''

        }, 2000)
      })

    },
    getMore(e) {
      let target = e.target || e.srcElement;
      let scrollHeight = this.$refs.secList.offsetHeight
      let offsetHeight = document.documentElement.offsetHeight
      console.log(this.hadMore)
        if(target.scrollTop<=0){
           this.pages=1
          this.getFirstInfo('refresh')        
        }
      if (!this.hadMore) {
        if (this.totalPages > 0 && (offsetHeight + target.scrollTop >= scrollHeight - 200)) {
          let pages = this.pages + 1
          this.pages = pages
          this.hadMore = true
          this.getFirstInfo('more');
        } else {
          if (this.totalPages == 0) {

            this.notice_show = '没有更多了'
            this.hadMore = true
            setTimeout(() => {
              this.notice_show = ''

            }, 2000)
          }
        }
      }
    },
    quickSearch(e) {
      console.log(e)
      const me = this;
      const name = e
      this.standDepartment = false
      if (name === this.searchType) {
        this.searchType = ''
      } else {
        if (name === 'hospital') {
          const urlH = `${this.$conf.url}/internethospital/api/organizations?page-index=1&page-size=10000`;
          this.$axios.get(urlH).then(res => {
            console.log(res);
            if (res.status >= 200 && res.status <= 399) {
              let defaultHospital = {
                id: 'default',
                logoUrl: 'static/images/default-hospital.png',
                text: '所有医院'
              }
              let content = res.data.content;

              res.data.content.unshift(defaultHospital)

              me.hospitalList = content

            } else {
              this.notice_show = '获取医院列表失败，请稍后再试'
              setTimeout(() => {
                this.notice_show = ''
                me.searchType = ''

              }, 2000)

            }
          }).catch(err => {
            this.notice_show = err.response.data.message
            setTimeout(() => {
              this.notice_show = ''
            }, 2000)

          })

        } else if (name === 'department') {
          let urlD = `${this.$conf.url}/internethospital/api/departments?page-index=1&page-size=1000&show-all=true&stand-department=true`;
          if (this.hospitalPorts) {
            urlD = `${this.$conf.url}/internethospital/api/departments?page-index=1&page-size=1000&show-all=true&organization-id=${this.hospitalId}`;
          }
          this.$axios.get(urlD, { headers: this.$store.state.header }).then(res => {
            let defaultDepartment = {
              id: 'default',
              text: '默认'
            }
            res.data.content.unshift(defaultDepartment);

            me.firstDepartment = res.data.content

            let urlSD;
            if (!me.secondChosen) {

              me.firstChosen = res.data.content[0]

              let secondDepartment = [];
              secondDepartment.push(defaultDepartment);

              me.secondDepartment = secondDepartment

            } else {
              let firstChosen;
              if (me.secondChosen.parentId) {
                let urlSD = `${me.$conf.url}/internethospital/api/departments?page-index=1&page-size=1000&parent-id=${me.secondChosen.parentId}`;
                firstChosen = res.data.content.find(f => f.id === me.secondChosen.parentId);
              } else {
                urlSD = `${me.$conf.url}/internethospital/api/departments?page-index=1&page-size=1000&parent-id=${me.secondChosen.id}`;
                firstChosen = res.data.content.find(f => f.id === me.secondChosen.id);
              }

              me.firstChosen = firstChosen
              this.$axios.get(urlSD, { headers: this.$store.state.header }).then(res => {
                if (resp.status >= 200 && resp.status <= 399) {
                  if (me.firstChosen.id !== 'default') {
                    me.firstChosen.text = me.firstChosen.text.indexOf('（全部）') > 0 ? me.firstChosen.text : me.firstChosen.text + '（全部）'
                  }
                  resp.data.content.unshift(me.firstChosen);

                  me.secondDepartment = resp.data.content

                  if (me.secondChosen) {

                    me.secondChosen = me.secondChosen

                  }
                }
              }).catch(err => {
                this.notice_show = err.response.data.message
                setTimeout(() => {
                  this.notice_show = ''
                }, 2000)
              })

            }

          }).catch(err => {
            this.notice_show = err.response.data.message
            setTimeout(() => {
              this.notice_show = ''
            }, 2000)
          })
        }
        me.searchType = name

      }
    },
    chooseFirstD(id) {
      console.log(id)
      const me = this;
      const urlSD = `${this.$conf.url}/internethospital/api/departments?page-index=1&page-size=1000&parent-id=${id}`;
      const data = this.firstDepartment.find(d => d.id === id);

      this.firstChosen = data
      this.$axios.get(urlSD).then(res => {
          if (me.firstChosen.id !== 'default') {
            data.text = data.text.indexOf('（全部）') > 0 ? data.text : data.text + '（全部）'
          }
          res.data.content.unshift(data);
          this.secondDepartment = res.data.content
      }).catch(err => {
        this.notice_show = err.response.data.message
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      })
    },
    chooseSecondD(id) {
      console.log(id)
      const me = this;
      const data = me.secondDepartment.find(d => d.id === id);
      if (data.id !== 'default') {
        this.secondChosen = data
      } else {
        this.secondChosen = ''
      }
      this.pages = 1
      me.getFirstInfo('refresh');
      setTimeout(() => {
        this.searchType = ''
      }, 300);
    },
    chooseHospital(id) {
      console.log(id)
      const me = this;
      const hospital = me.hospitalList.find(h => h.id === id);
      hospital.text = hospital.text.length <= 6 ? hospital.text : hospital.text.slice(0, 5) + '...';
      if (hospital.id !== 'default') {
        this.hospitalChosen = hospital
      } else {
        this.hospitalChosen = ''
      }
      this.pages = 1
      me.getFirstInfo('refresh')
      setTimeout(() => {
        this.searchType = ''
      }, 300);
    },
    sortList(e) {
      const me = this;
      const type = e;
      this.showType = type
      this.pages = 1
      me.getFirstInfo('refresh');
      setTimeout(() => {
        this.searchType = ''
      }, 300);
    },
    cancelSearch(e) {
      const me = this;
      console.log(e)
      if (!e.target.dataset.id) {
        console.log(44)
        this.searchType = ''
        this.$store.commit('changePageType', 'package-page');
      }
    },
    jumpTo(code) {
      this.$store.commit('changePageType', 'package-page');
      this.$router.push(`/nurse/${code}`);
    }

  }
}

</script>
<style scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw;
}

.search-img{
  width: 100%;
  height: vm(240)
}
.search-bar {
  position: fixed;
  top: 0;
  box-sizing: border-box;
  width: 100vw;

  background-color: #16A9F6;
  z-index: 100;
}

.search-bar div {

  background-color: transparent;
  border-radius: 4vw;
  background-size: 3.73vw;
  background-repeat: no-repeat;
  background-position: 2.6vw center;
}

.weash {

  width: 10vw;
  height: 10vw;
  background-image: url('data:image/png;base64,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');
  background-size: 3.73vw;
  background-repeat: no-repeat;
  position: absolute;

  top: 4vw;
  left: 6vw;
}

.search-bar input {
  background-color: rgba(255, 255, 255, .8);
  box-sizing: border-box;
  width: 90vw;
  height: 8vw;
  padding-left: 9.33vw;
  padding-right: 9.33vw;
  border-radius: 4vw;
  font-size: vm(26);
  color: #737E81;
}

.screen {
  width: 100vw;
  height: 10.66vw;
  position: fixed;
  top: 32vw;
  z-index: 100;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(153, 153, 153, .3);
}

.screen>div {
  flex: 1;
  box-sizing: border-box;
  text-align: center;
  line-height: vm(60);
  margin: vm(10) 0;
  border-right: #e2e2e2 1px solid;
}

.screen span {
  font-size: vm(28);
  padding-right: vm(30);
  padding-left: vm(10);
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAB3klEQVRYR+2UsU4bQRCG/1njnBVwQk3Je9DwDqlJEZEQhBRRcFYQeBwixFFEkRCRbRpoeQga3iNl6iRHpD1h76DFZ8VKbM/53FDsdqe5mf3n+2eW8MQOPTE9CII0RwKhQEgjoMXDDAVCGgEtPnWGmHkhFRzB0TYI7b6R46/MP7Wio/EPzMsVRx8heAcj53XCATP3JtWYKmiv2Vzpi7kFsApBJoYu7sntnzH/LiJqh/lF1dExCd6AEAH4XiG3dtpq/Sgl6JGQoy8AdvICPSG6vie3pYnKxbQJeAVgYZAvZ3WD3dKEfAlmNneOvgmwAaAGoCdAp/o82k8ajV/jOvU2GUefCXibi7EEXC0Zec/MbhrdQu9QHJ+87NfsJwhtihc1xb4xNlki6VZs7TBJxjcwKrCQIJ/wKCrKEhl07c9/9o2ziYBOJYviImJ80cKCNPsya6msTaUIDZMm2QcRGtkmKyTdakGb5hI0yb686GCbiNqpfdboFpiZfwd8JstGk/32pWLOIfI63z4ftiC6rJPb1rap1DukPX7evl6UtfB30DtpFjXLkBneVZrQsMBektTdH7vuv81i7eY0jlOtkbnfoXkumDV3bkKzXqj9HwQFQhoBLR5mKBDSCGjxMEMaoQcYIdMlzs5xsQAAAABJRU5ErkJggg==');
  background-size: vm(24);
  background-repeat: no-repeat;
  background-position: right center;
  color: #999999;
  width: 80%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.screen span.chosen {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACZ0lEQVRYR+2UPWhTURiGn+/eJCZpa7GmNyJYFMHFTVycRJxEdDCaaEZFq2gtCB2FWqSDgoUiSB0UxNoQBxVEEARFQafiDwhFEQftj0mlFU1vIT+fXBsEQXLS1kqHe+BOL+d8D895zxWW2ZJlxoMPZLoR35BvyGTAlPsd8g2ZDJjyRXUoNlRYK6KXRKztSrmzbWPjneGtUjQNrZUvGCh+47tDKNCv6AEECzQvSOcXJ3KbHVJaKNSCgNoGddVswL0G7AUP5vcatQmmx1PBp/8NKHZPm2zX7VXhOBAA3OrX4kEI+lWUXRMj0WG6pTJfsPkZymoorm6PwmkgAjILesXCelSh0gdsqgK8U+RoPhl+hojOB6p+oMcacHLuBeAkEJobIjeL4p6aSrZ8c27NbMOWQdANgAfxBrUSuYPhD/8caHNWQ3l1PSs9VTNF0PvrpiOp4fbqq1IVJ+vuAy4Da+Yg9FUwIHtGE9HP9ULVZcjJFNoRzoPEgBLCXaXSkU82TvwxKKu2QyENVh/K6l8OhSe2ZZ8Y279ipB4oI1DrUOGIWOL1o2nulnheRA5NJcOf4C/9yKrdqm5C0KsgzUBZ4UGwXDo8ll45aYKqCRQf+rFTLclUzVRQXleCunsy0TBe8+ABDTrNbgfCOaCx2reBXCrivcyaqyaQk5npwpJeVG2UF1alfGwi3fTWdKiXxx9qg07PnkH1LEIQyOdSUce0tyZQLFPYIpY1aKkWyiVtn3x/8SXd3XX/W9Zf/xieica9V9mlSH8+FeldFJBp81LkxlIvxdBaZ/pAJuO+Id+QyYAp9zvkGzIZMOU/AeFZxCUTWc5pAAAAAElFTkSuQmCC');
}

.screen span.changed {
  color: #666666;
}

.screen>div:last-child {
  border-right: none;
}

.quickSearchBoard {
  width: 100vw;
  position: fixed;
  z-index: 99;
  top: 22.39vw;
  bottom: 0;
  background-color: rgba(0, 0, 0, .3);
}

.quickSearchBoard>div {
  width: 100vw;
  max-height: vm(900);
  background-color: #ffffff;
  overflow-y: scroll;
  box-sizing: border-box;
  margin-top: 5vw;
}

.quickSearchBoard li {
  box-sizing: border-box;
  padding: 0 vm(30);
  display: block;
  height: vm(88);
  line-height: vm(88);
  font-size: vm(30);
  color: #333333;
  border-bottom: #E2E2E2 1px solid;
}

.quickSearchBoard li:last-child {
  border-bottom: none;
}

.quickSearchBoard.department>div {
  position: relative;
}

.quickSearchBoard.department>div li {
  border-bottom: none;
}

.quickSearchBoard.department .first {
  position: absolute;
  top: 15vw;
  bottom: 0;
  width: 37.33vw;
  background-color: #EFF5F8;
  overflow: scroll;
}

.quickSearchBoard.department .first>li {
  width: 100%;
  color: #666666;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.quickSearchBoard.department .first>li.chosen {
  background-color: #ffffff;
  color: #333333;
}

.quickSearchBoard.department .second {
  padding-top: 15vw;
  width: 62.66vw;
  height: vm(900);
  overflow: scroll;
}

.quickSearchBoard.department .second>li {
  width: 100%;
  color: #333333;
  transition: color .3s;
}

.quickSearchBoard.department .second>li.chosen {
  color: #16A9F6;
}

.quickSearchBoard.hospital li {
  height: vm(110);
  line-height: vm(110);
  transition: color .3s;
}

.quickSearchBoard.hospital li.chosen {
  color: #16A9F6;
}

.quickSearchBoard.hospital li>img {
  width: vm(80);
  height: vm(80);
  margin-top: vm(15);
  margin-right: vm(30);
}

.quickSearchBoard.hospital li>small {
  width: vm(110);
  height: vm(32);
  text-align: center;
  line-height: vm(32);
  font-size: vm(22);
  color: #FE9B00;
  margin-left: vm(20);
  border: #FE9B00 1px solid;
  border-radius: vm(16);
  margin-top: vm(39);
}


.quickSearchBoard.automaticSort li {
  transition: color .3s;
}

.quickSearchBoard.automaticSort li.chosen {
  color: #16A9F6;
}

.emp>img {
  display: block;
  width: vm(250);
  margin: vm(400) auto vm(20);
}

.emp>span {
  display: block;
  text-align: center;
  font-size: vm(28);
  color: #737E7F;
  opacity: .5;
}

.section {
  margin-top: 43vw;
  height: auto;

  background-color: #e2e2e2;
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

.doctor li small {
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
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAHz0lEQVRYR72ZC2zV9RXHP+d/b18ERtW5uUHUTGdkinslzmVVNMucmTwK9NqioMjKpdCCwKZE0NEOkg0pIpTeNpXi5C0XWx4+Bogri1um21hM3CIKmg0dbMCwUKSPe/9n+f37oP///d/be/HxS5o0/Z/H93dev3NOhQyPVlZatB7Nx9bLCdo3gxSAfhPlaoRLgSzgLOgxkEMof8XmAJYcQdtOysro+QxVOuSSLpNWYtH6wAhERyMyCuX7QH56/BoDeQc4gOo+ArpXqjecS4+3myotoDr7vi+QlbUQtBgY1mO1TPT00irQCvIPLGuxVK97JV0hKYHq7Nk5BE/fjATrQb+RrtA06dpRrcHOXiGr1v5nIJ6kQLVy1mBa2yqAnwFfHEjQRX6Pg+5DdIk8ufGPqWT4Au1OmCN1IJOBQRcJIhO2wyDlsvLZvcmYEoDqrNBgcnKXo5RloulToD1EXCZJzfq/+clyAXVi0jo9F5FffE6W9GI6iGixrNx42PvBDXTe5FtRmtDPLCbTMLzsIbe9WJZFW/sT9wHVR6YNoaPTBPSNHmnnEd5A7VoY9Hu6Ws8RyL6SAD9EpQQY0VNP3WGkKMJHwIcgr2DpHuL2kZ6qeCOWlKDc0ZOo/XnPo7qAY50RiUbjvVgcAid5/vfuUkQedYPUMyDLyJJVfgVa54XyiGfdiWXdi2ohSLbDr9qGyA7U3k57V4s0uK3TozPI6cN3oFQj3OTSq/omEhgrq9b/yw30oftvQuO7gKv6MdioRugYvEAaGj5O5TMNh4aSkzMaS5ejcgrsOeTm/kWeWHc2JZ95cOZMuQGxX0MZ6tINj8rqTU/0AXWseeqdhxGWeF6cD1B7rNRs9c1CPwBaVnI1VvykRKJtaQRjH4k+dO88bFYg/V5KleMEO7/W2xuIzgtdSiy4CeQuj/mbuS0WknsuxEkmyjOh1XmTryWm+0Gv9GCYImu2bDR/Ey0vvg7L+hNwiYtI5H5ZvXlDJgovllbnTs0n1vEMQqFbhuyVms0/7gY6e9IklM0+SkbImi1vp6tcKyaZhqPf0SpZs7UyHX6tDGVzMlgNzPbIeB8J3CY1mz4QrShpAKYnCMzNGpxJK6YVJR6gZAC00uLE20sQFrrvykkClMjqrftFy0uM27+XALR2qyXgVZ7UQFruASoZADXZX1FShfK4O/w4h0q51G551sToMeCKBARWcKjUbDqTjusMjZYXuy+lUiWRdF1/e5ATX14GzPfo6wIekdrnnhKdVdwJasYHT3jo9VIXPZQ20Fn3JLo+si29GDWNEFIHmG6t3xEb0cekdtuvRBMV9BDKRIk81/S5AC2b8iWsjueBAq+5gMUS2bZEdGbIuHdIIiCtlrrtDycYemYo7bj1vaRolUS2uyyt4YnXE7BeAy7zxGgMZaHURZcboIdQva7vTTAwTAeg8mfyGOWdGnVmkWk3Lkxbmf9eJfUeoGVFM4B6HwztYM+X+ufrRGcWvYByt8/tj4OMk/roG67qWFb0ySwKLqBqrjyj6CDCt3wwtGIxTSLbm0TDRY8j+ksfok6Ux/jqyBVSWWn3ftcZEz8ZUBE30JkT7saWF3zDROXfYI+RhqaDouFQAdivIn6ZzwFyAiGpiZ7oA1pW5J/Jai/2ZGwLIgd8ALRI/fYWp6TNLcznY6sJcfpSv/MmgUCBaXJESycMx+K3wA0+lKaOTZWGJr8n1kWu4QmJ5amhKWV50ukTpiBEgMH+OHWlNDQ7tVU0FMojP/YkMMPVZl3gfI+cQd8eqPhreHziW9+wIylQLQsNIx7bgnBrEmt2Eec70tj8lgPUcUHp+AkI60D7N6/9C281HwUXSTTamayu6vRCN1DzhCYBqqFQgPzO5WDNAQ34y5QX5enm0b3fuoFOGzuEgOwFuSUJkJPYOk0ad+7+VICGx5ejugLISSLvHCJ3SUOzqa3OuTDclRbejuhLKHm+zMLriNwnDTt6BjQ3lZaO87heqmSt2/XONHH04J2ItR708iQgTYXZiK0Vsm5X3yjjHpd/Ou7XwM8REt3RXeZ3k9M1QyIvHfcq0dJCbzy2yNodTnb3Hp02vgDLjqCMTLqeU45iUyLP7HSteNxAp/7kCqys3yDqdNUJxxmBZR+BgKkEputK+2h4fAHxuKkew1NuEVUf5Gzuhv6jssv1fbcuHXMLKuuBr6cAuxOx58va3e8PhFTD4Sxix8YimF1WMncbMe3ASmnc5W6evTHqclHp2B9hay0iScCqCYM/gC7hvbZXpaUl5usAM0bH2ssRMVvBryS/lHaAPE171yLZ9LJvD5x87Vha+F00thYVvze4V+dxsFZxNnuVRN0rbw2PG0mX/RTCD1Jkd29KVxPIXeq3qOhVlHqRGy68hphZ5dijQHKTW0R+h60L6IodwsrNJTs+GmUpaAorYrL7Q4RF0rh7wGl3wNW4swWJtT8ImB+zl7KSADZLrT3dY43zD4hkdIbd1MlmbKmjLft1b+L4yR8QqGFyXpJL2ocR0yIQ00wnzlgDZZXzXUzv8DIaX0an/VayeLxooK5EC48ZRJeYJ/cB0Gt7Goq87gWZBntojVsNqA7HenAK2I/YjTS++PdMptu0YjSVkZyGd2rhVQS4BtsejtiXIdYgZ9modCCcweK/EP8nefa7UuOfzWk5It1/36Qr7LOk+z+SiBFYWut4IwAAAABJRU5ErkJggg==');
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

.doctor li>div.left>view:last-child>span:first-child {
  color: #666666;

}

</style>
