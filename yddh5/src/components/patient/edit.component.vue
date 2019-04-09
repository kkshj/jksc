<template>
  <div class="page">
    <span class='title'>必填项</span>
    <div>
      <div class='form-item'>
        <label class='left'>真实姓名</label>
        <input class='right' v-model='realname' placeholder='请输入真实姓名' maxlength='11' type='text' @input='bindInputName(realname)'></input>
      </div>
      <div class='form-item' @click='bindGenderChange("gender")'>
        <label class='left'>性别</label>
        <!--   <picker class='right' bindchange="bindGenderChange" value='{{gender}}' range="{{genderArr}}">
          <view class="picker">
            {{genderArr[gender]}}
          </view>
        </picker> -->
        <div class="picker">{{gender==0?'男':'女'}}</div>
      </div>
      <div class='form-item'>
        <label class='left'>出生日期</label>
        <!-- <picker class='right' mode="date" bindchange="bindBirthChange" value='{{date}}'>
          <view class="picker">
            {{date}}
          </view>
        </picker> -->
        <div class="picker">
          <p type="" name="" @click='setDate'>{{date}}</p>
        </div>
      </div>
      <div class='form-item'>
        <label class='left'>手机号码</label>
        <input class='right' v-model='phone' placeholder='请输入手机号码' maxlength='11' type='number' @input='bindInputPhone(phone)'></input>
      </div>
    </div>
    <span class='title'>选填项</span>
    <div>
      <div class='form-item'>
        <label class='left'>身份证号码</label>
        <input class='right' v-model='identity' placeholder='请输入身份证号码' maxlength='18' type='idcard' @input='bindInputIdentity(identity)'></input>
      </div>
      <div class='fun-btn' @click='toMedicalCard' v-if="id&&id!='me'">
        <label class='left'>就诊卡/健康卡</label>
        <span class='right'>{{medicalCard}}张</span>
      </div>
      <div class='fun-btn' @click='toHealthRecords'>
        <label class='left'>健康信息</label>
        <span class='right' v-if="pastHistory">{{pastHistory.length>0 ? pastHistory[0] + '...' : obstericalHistory.length>0 ? obstericalHistory[0] + '...' : familyHistory.length>0 ? familyHistory[0] + '...' : allergicHistory.length>0 ? allergicHistory[0] + '...' : personalHabit.length>0 ? personalHabit[0] + '...' : ''}}</span>
      </div>
    </div>
    <button class='operation save' @click='clickButton'>保 存</button>
    <button v-if="!master && id" class='operation delete' @click='deletePatient'>删除就诊人</button>
    <div class="genders" v-show='gender_show'>
      <p @click='bindGenderChange(0)'>男</p>
      <p @click='bindGenderChange(1)'>女</p>
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
      gender_show: false,
      pastHistory: null,
      genderArr: '男',
      gender: 0,
      // date: new Date().format('yyyy-MM-dd'),
      date: '2018-05-04',
      medicalCard: '0',
      id: '',
      identity: '',
      realname: '',
      phone: '',
      presentHistory: [],
      obstericalHistory: [],
      familyHistory: [],
      allergicHistory: [],
      personalHabit: [],
      master: false,
      dontHasMaster: false
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
    firstName(state) {
      if (state.firstName === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.firstName
    },
    userName(state) {
      if (state.userName === '') {
        this.$store.commit('setUser', JSON.parse(localStorage.getItem('loginInfo')));
      }
      return state.userName
    }
  }),
  activated() {
    var params = this.$route.query
    this.id = params.id
    console.log(this.id)
    this.getInfo(params)
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == '/patient') {
      this.$destroy()
    }
    next();
  },
  methods: {
    getInfo(params) {
      console.log(localStorage.getItem('presentHistory'))
      if (JSON.parse(localStorage.getItem('presentHistory'))) {
        this.presentHistory = JSON.parse(localStorage.getItem('presentHistory'))
        console.log(JSON.parse(localStorage.getItem('presentHistory')))
      }
      if (JSON.parse(localStorage.getItem('obstericalHistory'))) {
        this.obstericalHistory = JSON.parse(localStorage.getItem('obstericalHistory'))
      }
      if (JSON.parse(localStorage.getItem('familyHistory'))) {
        this.familyHistory = JSON.parse(localStorage.getItem('familyHistory'))
      }
      if (JSON.parse(localStorage.getItem('allergicHistory'))) {

        this.allergicHistory = JSON.parse(localStorage.getItem('allergicHistory'))
      }
      if (JSON.parse(localStorage.getItem('personalHabit'))) {
        this.personalHabit = JSON.parse(localStorage.getItem('personalHabit'))
      }
      this.clickCount = 0
      if (params.id && params.id === 'me') {
        console.log(22);
        if (this.userInfo) {
          this.realname = this.userInfo.nickName.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "")
          this.master = true
        }

      } else if (params.id) {
        console.log(77)
        this.id = params.id
        this.getFirstInfo(params.id);
      }
    },
    setDate() {
      this.$picker.show({
        type: 'datePicker',
        date: '2018-05-15',
        endTime: '2050-12-12',
        startTime: '1900-01-01',
        onOk: (date) => {
          console.log(date)
          let arr = date.split('-')
          if (arr[1].length <= 1) {
            arr[1] = '0' + arr[1]
          }
          if (arr[2].length <= 1) {
            arr[2] = '0' + arr[2]
          }
          this.date = arr.join('-')
        }
      })
    },

    checkHasMaster() {
      const url = `${this.$conf.url}/internethospital/api/patients?user-id=${this.userId}&page-index=1&page-size=10`;
      this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
        if (!res.data.content.find(p => p.master)) {
          console.log('noMaster')
          this.dontHasMaster = true
        }
        this.create();
      }).catch(err => {
        console.log(err);
        this.checkHasMaster();
      })
    },
    getFirstInfo(id) {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/patients/${id}`;
      this.$axios.get(url, { headers: this.$store.state.header }).then(res => {
        console.log(res);
        if (res.status >= 200 && res.status <= 399) {
          me.realname = res.data.name
          me.gender = res.data.gender === 'MAN' ? 0 : 1
          me.date = res.data.birthday
          me.phone = res.data.phone
          me.identity = res.data.identityCard
          me.presentHistory = res.data.presentHistory
          me.obstericalHistory = res.data.obstericalHistory
          me.familyHistory = res.data.familyHistory
          me.allergicHistory = res.data.allergicHistory
          me.personalHabit = res.data.personalHabit
          me.master = res.data.master
        }
      })
      const urlC = `${this.$conf.url}/internethospital/api/patients/${id}/medical-cards`;
      this.$axios.get(urlC).then(res => {
        if (res.status >= 200 && res.status <= 399) {
          me.medicalCard = res.data.length
        }
      })
    },
    bindInputName(realname) {
      this.realname = realname
    },
    bindGenderChange(word) {
      if (word == 'gender') {
        this.gender_show = true
      } else if (word == 0) {
        this.gender_show = false
        this.gender = 0
      } else {
        this.gender_show = false
        this.gender = 1
      }
    },
    bindBirthChange(e) {
      this.date = e
    },
    bindInputPhone(phone) {
      this.phone = phone
    },
    bindCheckPhone() {
      if (!/^1\d{10}$/g.test(this.phone)) {
        this.notice_show = '请输入十一位手机号'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      }
    },
    bindInputIdentity(identity) {
      this.identity = identity
    },
    toMedicalCard() {
      const id = this.id;
      if (id) {
        const url = `/patient/card/${id}`
        this.$router.push(url)
      } else {
        this.notice_show = '首次录入就诊人无法创建就诊卡，请先创建就诊人'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
      }
    },
    toHealthRecords() {
      const id = 1;
      this.$router.push({
        path: '/patient/health-records',
        query: {
          presentHistory: this.presentHistory,
          obstericalHistory: this.obstericalHistory,
          familyHistory: this.familyHistory,
          allergicHistory: this.allergicHistory,
          personalHabit: this.personalHabit
        }
      })

    },
    clickButton() {
      if (this.id) {
        console.log(11)
        this.update();
      } else {
        console.log(22)
        this.checkHasMaster();
      }
    },
    create() {
      const me = this;
      if (!this.realname) {
        this.notice_show =  '请输入姓名'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else if (!this.phone) {
        this.notice_show = '请输入电话'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else if (!/^1\d{10}$/g.test(this.phone)) {
        this.notice_show = '请输入十一位手机号'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else if ((this.identity) && (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g.test(this.identity))) {
        this.notice_show = '请输入正确的身份证号码'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        this.clickCount = 0
      } else {
        const url = `${this.$conf.url}/internethospital/api/patients`;
        let data = {
          "birthday": this.date,
          "identityCard": this.identity,
          "name": this.realname,
          "gender": this.gender === 0 ? 'MAN' : 'LADY',
          "userId": this.userId,
          "userRealName": this.firstName,
          "username": this.userName,
          "phone": this.phone,
          "presentHistory": this.presentHistory,
          "obstericalHistory": this.obstericalHistory,
          "familyHistory": this.familyHistory,
          "allergicHistory": this.allergicHistory,
          "personalHabit": this.personalHabit,
          "master": this.master

        }
        if (this.master || this.dontHasMaster) {
          console.log(55)
          console.log(this.userId)
          console.log(this.firstName)
          console.log(this.userName)
          this.$axios.post(url, data, { headers: this.$store.state.header }).then(res => {
            console.log(res)
            this.load_show = false
            this.notice_show = '创建成功'
            setTimeout(() => {
              this.notice_show = ''
              this.$router.back()
            }, 1500)

          }).catch(err => {
            this.notice_show = '创建失败，请稍后再试'
            setTimeout(() => {
              this.notice_show = ''
            }, 1500)
          })
        } else(
          this.$axios.post(url, data, { headers: this.$store.state.header }).then(res => {
            console.log(res)
              this.load_show = false
              this.notice_show = '创建成功'
              setTimeout(() => {
                this.notice_show = ''
                this.$router.back()
              }, 1500)
          })
        )
      }
    },
    update() {
      const me = this;
      const url = `${this.$conf.url}/internethospital/api/patients/${this.id}`;
      if (!this.realname) {
        this.notice_show = '请输入姓名'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else if (!this.phone) {
        this.notice_show =  '请输入电话'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else if ((this.phone) && (!/^1\d{10}$/g.test(this.phone))) {
        this.notice_show =  '请输入十一位手机号'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else if ((this.identity) && (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g.test(this.identity))) {
        this.notice_show = '请输入正确的身份证号码'
        setTimeout(() => {
          this.notice_show = ''
        }, 2000)
        me.clickCount = 0
      } else {
        const data = {
          "birthday": this.date,
          "identityCard": this.identity,
          "name": this.realname,
          "gender": this.gender === 0 ? 'MAN' : 'LADY',
          "userId": this.userId,
          "phone": this.phone,
          "userRealName": this.firstName,
          "username": this.userName,
          "presentHistory": this.presentHistory,
          "obstericalHistory": this.obstericalHistory,
          "familyHistory": this.familyHistory,
          "allergicHistory": this.allergicHistory,
          "personalHabit": this.personalHabit,
          "master": this.master
        }
        if (this.master) {
          console.log(77)
          const urllr = `${this.$conf.url}/internethospital/api/patients/${this.id}`;
          const datas = {
            "birthday": this.date,
            "identityCard": this.identity,
            "name": this.realname,
            "gender": this.gender === 0 ? 'MAN' : 'LADY',
            "phone": this.phone,
            "presentHistory": this.presentHistory,
            "obstericalHistory": this.obstericalHistory,
            "familyHistory": this.familyHistory,
            "allergicHistory": this.allergicHistory,
            "personalHabit": this.personalHabit,
            "master": true
          }
          this.$axios.put(urllr, datas, { headers: this.$store.state.header }).then(res => {
            // wx.hideLoading();
            console.log(res)
            this.load_show = false
            if (res.status >= 200 && res.status <= 399) {
              this.notice_show = '修改成功'
              setTimeout(() => {
                this.notice_show = ''
                this.$router.back()
              }, 1500)

            }
          })
        } else {
          const urllr = `${this.$conf.url}/internethospital/api/patients/${this.id}`;
          const datas = {
            "birthday": this.date,
            "identityCard": this.identity,
            "name": this.realname,
            "gender": this.gender === 0 ? 'MAN' : 'LADY',
            "phone": this.phone,
            "presentHistory": this.presentHistory,
            "obstericalHistory": this.obstericalHistory,
            "familyHistory": this.familyHistory,
            "allergicHistory": this.allergicHistory,
            "personalHabit": this.personalHabit,
            "master": this.master
          }
          console.log(44)
          console.log(this.realname)
          console.log(this.master)
          this.$axios.put(urllr, datas, { headers: this.$store.state.header }).then(res => {
            console.log(res)
            this.load_show = false
            this.notice_show = '修改成功'
            setTimeout(() => {
              this.notice_show = ''
              this.$router.back()
            }, 1500)
          })
        }
      }
    },
    deletePatient() {
      const url = `${this.$conf.url}/internethospital/api/patients/${this.id}`;
      this.$axios.delete(url, { headers: this.$store.state.header }).then(res => {
        this.load_show = false
        this.notice_show = '删除成功'
        setTimeout(() => {
          this.notice_show = ''
          this.$router.back()
        }, 1500)

      }).catch(err => {
        this.notice_show = '当前用户非患者角色，无权删除就诊人'
        setTimeout(() => {
          this.notice_show = ''

        }, 1500)
      })

    },

  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}

.genders {
  width: 100vw;
  height: vm(400);
  z-index: 1000;
  position: fixed;
  background-color: #fff;
  bottom: 0;

  p {
    text-align: center;
    line-height: vm(100);
  }

  p:first-child {
    margin-top: vm(100);
  }
}

.title {
  display: block;
  margin: vm(20) vm(30);
  font-size: vm(28);
  color: #999999;
}

.form-item,
.fun-btn {
  width: 100vw;
  height: vm(88);
  box-sizing: border-box;
  padding: vm(28) vm(30);
  background-color: #ffffff;
  border-bottom: #e2e2e2 1px solid;
}

.form-item:last-child,
.fun-btn:last-child {
  border-bottom: none;
}

.form-item::after,
.fun-btn::after {
  content: '';
  display: block;
  clear: both;
}

.form-item>label,
.fun-btn>label {
  width: 30%;
  font-size: vm(30);
  color: #333333;
  line-height: vm(32);
}

.form-item>.picker {
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

.form-item>input,
.fun-btn>span {
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

.fun-btn {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAACN0lEQVR4Xu3av0pDMRgF8C/3VqGDqIvg6qBYoY4XX0BddOwj6CwULIK0durUXV/BxdlREV18ARcFN10UQbDtTeT6BxRuWyE2OYHTuU2bX89J4WuU8DFQQNFnsACBhiSEQASyO0SYICaICbITYILs/HgGMUFMkJ0AE2TnxzOICWKC7AQQErS1dTg2NfMwl32W20J6e9xodEa6q39c3MkZVK3Xy5JGayISmYK5TEqli0qlkv7jPka2lBug/WYiyqyKSGyM6mmdnq4sL12HgOQEaLfVmuy+vq1HIovZV50hSazPJkSuGuB1cwKUoey028X4+XlDTFT66IOWrinE50lpHrpuzoC+kQpPL5vaqAWlTBRC3ZwCZUi1Wm06HS+umkDq5hwotLp5AQqpbt6AQqmbV6AQ6uYdCL1uEEDIdYMBQq0bFBBi3eCA0OoGCYRUN1gglLpBA/Wtm9ZnL4+zl0dH292RTcq+FoYHyqubMerVROlJ++DghkA5syQC/YhF7niEFfsUyqaQvgdssGdQ/ojWnLv+RwQSCGnqCAeEUKufv4xQQCi1ggRCqhUcEFqtoIAQawUDhForCCDkWnkHQq+VV6AQauUNKJRaeQEKqVbOgXiBashYr9psJtLjFby+TNW9elmiaE0ppbTWV8kyL3H+wvq+BtyLY3OvOne8BjzqSbrD9aHGHQ73/ee3ItAQKgIR6M9tyn0iE8QEMUF2AkyQnR/PICaICbITYILs/HgGMUFMkJ3AkFe/A5eMGGfm7a/3AAAAAElFTkSuQmCC');
  background-size: vm(48);
  background-repeat: no-repeat;
  background-position: right vm(20) center;
  padding-right: vm(70);
  line-height: vm(34);
}

.operation {
  width: vm(580);
  height: vm(88);
  border-radius: vm(8);
  background-color: #16A9F6;
  color: #ffffff;
  font-size: vm(30);
  position: fixed;
  bottom: vm(170);
  left: 50%;
  margin-left: vm(-290);
}

.operation.delete {
  background-color: transparent;
  border: #FF624D 1px solid;
  color: #FF624D;
  bottom: vm(50);
}

</style>
