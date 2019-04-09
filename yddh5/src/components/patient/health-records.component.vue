<template>
  <div class="page">
    <div class='btn-box'>
      <button :class='recordType === "past" ? "chosen" : ""' data-type="past" @click='changeRecord("past")'>既往史<i></i></button>
      <button :class='recordType === "marriage" ? "chosen" : ""' data-type="marriage" @click='changeRecord("marriage")'>婚育史<i></i></button>
      <button :class='recordType === "family" ? "chosen" : ""' data-type="family" @click='changeRecord("family")'>家族史<i></i></button>
      <button :class='recordType === "allergy" ? "chosen" : ""' data-type="allergy" @click='changeRecord("allergy")'>过敏史<i></i></button>
      <button :class='recordType === "habit" ? "chosen" : ""' data-type="habit" @click='changeRecord("habit")'>个人习惯<i></i></button>
    </div>
    <div v-if='recordType === "past"'>
      <span class='title'>疾病史</span>
      <div class='mark-box'>
        <li class='left ' v-for='(item ,index) in illness' :class='item.chosen ? "chosen" : ""' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>传染病</span>
      <div class='mark-box'>
        <li class='left' v-for='(item,index) in infectious' :class='item.chosen ? "chosen" : ""' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>手术使</span>
      <div class='mark-box'>
        <li class='left' v-for='(item,index) in operations' :class='item.chosen ? "chosen" : ""' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>补充说明</span>
      <div class='input-box'>
        <textarea placeholder='如果没有找到适合您的信息，请在此补充说明...' v-model='presentHistory' type='text'></textarea>
      </div>
    </div>
    <div v-if='recordType === "marriage"'>
      <span class='title'>婚姻状况</span>
      <div class='mark-box'>
        <li class='left' v-for='(item,index) in marriages' :class='item.chosen ? "chosen" : ""' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>生育状态</span>
      <div class='mark-box'>
        <li :class='item.chosen ? "chosen" : ""' class='left' v-for='(item,index) in birth' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>补充说明</span>
      <div class='input-box'>
        <textarea placeholder='如果没有找到适合您的信息，请在此补充说明...' v-model='obstericalHistory' type='text'></textarea>
      </div>
    </div>
    <div v-if='recordType === "family"'>
      <span class='title'>家族史（父母、兄弟姐妹）</span>
      <div class='mark-box'>
        <li class='left' v-for='(item,index) in family' :class='item.chosen ? "chosen" : ""' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>补充说明</span>
      <div class='input-box'>
        <textarea placeholder='如果没有找到适合您的信息，请在此补充说明...' v-model='familyHistory' type='text'></textarea>
      </div>
    </div>
    <div v-if='recordType === "allergy"'>
      <span class='title'>过敏药物</span>
      <div class='mark-box'>
        <li class='left' v-for='(item,index) in drugs' :class='item.chosen ? "chosen" : ""' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>食物过敏</span>
      <div class='mark-box'>
        <li :class='item.chosen ? "chosen" : ""' class='left' v-for='(item,index) in foods' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>补充说明</span>
      <div class='input-box'>
        <textarea placeholder='如果没有找到适合您的信息，请在此补充说明...' v-model='allergicHistory' type='text'></textarea>
      </div>
    </div>
    <div v-if='recordType === "habit"'>
      <span class='title'>个人习惯</span>
      <div class='mark-box'>
        <li :class='item.chosen ? "chosen" : ""' class='left' v-for='(item,index) in habit' :key='item.id' :data-id='item.id' @click='choseThis(item.id)'>{{item.name}}</li>
      </div>
      <span class='title'>补充说明</span>
      <div class='input-box'>
        <textarea placeholder='如果没有找到适合您的信息，请在此补充说明...' v-model='personalHabit' type='text'></textarea>
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
      recordType: 'past',
      illness: [
        { id: '1-1', name: '哮喘', chosen: false },
        { id: '1-2', name: '肾炎', chosen: false },
        { id: '1-3', name: '癫痫', chosen: false },
        { id: '1-4', name: '高脂血症', chosen: false },
        { id: '1-5', name: '高尿酸血症', chosen: false },
        { id: '1-6', name: '高血压', chosen: false },
        { id: '1-7', name: '心脏病', chosen: false },
        { id: '1-8', name: '脑卒中', chosen: false },
        { id: '1-9', name: '糖尿病', chosen: false }
      ],
      infectious: [
        { id: '2-1', name: '肺结核', chosen: false },
        { id: '2-2', name: '病毒性肝炎', chosen: false },
        { id: '2-3', name: '血吸虫病', chosen: false },
        { id: '2-4', name: '淋病', chosen: false }
      ],
      operations: [
        { id: '3-1', name: '骨折', chosen: false },
        { id: '3-2', name: '烧伤', chosen: false },
        { id: '3-3', name: '烫伤', chosen: false },
        { id: '3-4', name: '颅脑手术', chosen: false },
        { id: '3-5', name: '颈部手术', chosen: false },
        { id: '3-6', name: '胸部手术', chosen: false },
        { id: '3-7', name: '腹部手术', chosen: false },
        { id: '3-8', name: '背部手术', chosen: false },
        { id: '3-9', name: '四只手术', chosen: false },
        { id: '3-10', name: '头部外伤', chosen: false },
        { id: '3-11', name: '肌腱损伤', chosen: false },
        { id: '3-12', name: '刀刺伤', chosen: false },
        { id: '3-13', name: '刀砍伤', chosen: false },
        { id: '3-14', name: '皮肤软组织损伤', chosen: false }
      ],
      marriages: [
        { id: '4-1', name: '已婚', chosen: false },
        { id: '4-2', name: '未婚', chosen: false }
      ],
      birth: [
        { id: '5-1', name: '未生育', chosen: false },
        { id: '5-2', name: '备孕期', chosen: false },
        { id: '5-3', name: '怀孕期', chosen: false },
        { id: '5-4', name: '已生育', chosen: false }
      ],
      family: [
        { id: '6-1', name: '高血压', chosen: false },
        { id: '6-2', name: '糖尿病', chosen: false },
        { id: '6-3', name: '心脏病', chosen: false },
        { id: '6-4', name: '脑梗', chosen: false },
        { id: '6-5', name: '脑出血', chosen: false },
        { id: '6-6', name: '癌症', chosen: false },
        { id: '6-7', name: '过敏性疾病', chosen: false },
        { id: '6-8', name: '哮喘', chosen: false },
        { id: '6-9', name: '癫痫病', chosen: false },
        { id: '6-10', name: '白癜风', chosen: false },
        { id: '6-11', name: '近视', chosen: false }
      ],
      drugs: [
        { id: '7-1', name: '青霉素', chosen: false },
        { id: '7-2', name: '头孢类抗生素', chosen: false },
        { id: '7-3', name: '破伤风抗毒素', chosen: false },
        { id: '7-4', name: '普鲁卡因', chosen: false },
        { id: '7-5', name: '地卡因', chosen: false },
        { id: '7-6', name: '磺胺类药物', chosen: false },
        { id: '7-7', name: '维生素B1', chosen: false },
        { id: '7-8', name: '泛影葡胺', chosen: false },
        { id: '7-9', name: '阿司匹林', chosen: false }
      ],
      foods: [
        { id: '8-1', name: '芒果', chosen: false },
        { id: '8-2', name: '牛奶', chosen: false },
        { id: '8-3', name: '海鲜', chosen: false },
        { id: '8-4', name: '笋', chosen: false },
        { id: '8-5', name: '香菇', chosen: false },
        { id: '8-6', name: '黄瓜', chosen: false },
        { id: '8-7', name: '花粉', chosen: false },
        { id: '8-8', name: '油漆', chosen: false },
        { id: '8-9', name: '皮毛', chosen: false },
        { id: '8-10', name: '化妆品', chosen: false }
      ],
      habit: [
        { id: '9-1', name: '吸烟', chosen: false },
        { id: '9-2', name: '饮酒', chosen: false },
        { id: '9-3', name: '熬夜', chosen: false },
        { id: '9-4', name: '低头', chosen: false },
        { id: '9-5', name: '久坐', chosen: false },
        { id: '9-6', name: '久站', chosen: false },
        { id: '9-7', name: '跷二郎腿', chosen: false },
        { id: '9-8', name: '强忍大小便', chosen: false },
        { id: '9-9', name: '饭后卧床', chosen: false },
        { id: '9-10', name: '如厕看书报', chosen: false },
        { id: '9-11', name: '不喜喝水', chosen: false }
      ],
      presentHistory: '',
      obstericalHistory: '',
      familyHistory: '',
      allergicHistory: '',
      personalHabit: ''
    }
  },
  components: {
    NoticeDialog,
    Notice,
    Loading
  },
  computed: mapState({
    //方式一：箭头函数
    questing(state) {
      if (state.questing === '' && JSON.parse(localStorage.getItem('questing'))) {
        this.$store.commit('setQuesting', JSON.parse(localStorage.getItem('questing')));
      }
      return state.questing
    },
  }),
  activated() {
    this.$store.commit('changePageType', 'package-page');
    let params = this.$route.query
    console.log(params)
    this.getInfo(params)
  },
  methods: {
    getInfo(params) {
      this.getFirstInfo(params)
    },
    choseThis(id) {
      console.log(id);
      if (this.illness.find(i => i.id === id)) {
        for (let i in this.illness) {
          if (this.illness[i].id === id) {
            if (!this.illness[i].chosen)
              this.illness[i].chosen = true;
            else
              this.illness[i].chosen = false;
          }
        }
        this.illness = this.illness
      } else if (this.infectious.find(i => i.id === id)) {
        for (let i in this.infectious) {
          if (this.infectious[i].id === id) {
            if (!this.infectious[i].chosen)
              this.infectious[i].chosen = true;
            else
              this.infectious[i].chosen = false;
          }
        }
        this.infectious = this.infectious

      } else if (this.operations.find(i => i.id === id)) {
        for (let i in this.operations) {
          if (this.operations[i].id === id) {
            if (!this.operations[i].chosen)
              this.operations[i].chosen = true;
            else
              this.operations[i].chosen = false;
          }
        }
      } else if (this.marriages.find(i => i.id === id)) {
        for (let i in this.marriages) {
          if (this.marriages[i].id === id) {
            if (!this.marriages[i].chosen)
              this.marriages[i].chosen = true;
            else
              this.marriages[i].chosen = false;
          } else {
            this.marriages[i].chosen = false;
          }
        }
      } else if (this.birth.find(i => i.id === id)) {
        for (let i in this.birth) {
          if (this.birth[i].id === id) {
            if (!this.birth[i].chosen)
              this.birth[i].chosen = true;
            else
              this.birth[i].chosen = false;
          } else {
            this.birth[i].chosen = false;
          }

          this.birtthis.birth
        }
      } else if (this.family.find(i => i.id === id)) {
        for (let i in this.family) {
          if (this.family[i].id === id) {
            if (!this.family[i].chosen)
              this.family[i].chosen = true;
            else
              this.family[i].chosen = false;
          }
        }
      } else if (this.drugs.find(i => i.id === id)) {
        for (let i in this.drugs) {
          if (this.drugs[i].id === id) {
            if (!this.drugs[i].chosen)
              this.drugs[i].chosen = true;
            else
              this.drugs[i].chosen = false;
          }
        }

      } else if (this.foods.find(i => i.id === id)) {
        for (let i in this.foods) {
          if (this.foods[i].id === id) {
            if (!this.foods[i].chosen)
              this.foods[i].chosen = true;
            else
              this.foods[i].chosen = false;
          }
        }

      } else if (this.habit.find(i => i.id === id)) {
        for (let i in this.habit) {
          if (this.habit[i].id === id) {
            if (!this.habit[i].chosen)
              this.habit[i].chosen = true;
            else
              this.habit[i].chosen = false;
          }
        }

      }
    },
    changeRecord(type) {
      this.recordType = type
    },
    getFirstInfo(params) {
      let presentHistory = params.presentHistory.split(',');
      let obstericalHistory = params.obstericalHistory.split(',');
      let familyHistory = params.familyHistory.split(',');
      let allergicHistory = params.allergicHistory.split(',');
      let personalHabit = params.personalHabit.split(',');
      for (let item of presentHistory) {
        if (this.illness.find(i => i.name === item)) {
          for (let i in this.illness) {
            if (this.illness[i].name === item) {
              this.illness[i].chosen = true;
            }
          }
        } else if (this.infectious.find(i => i.name === item)) {
          for (let i in this.infectious) {
            if (this.infectious[i].name === item) {
              this.infectious[i].chosen = true;
            }
          }
        } else if (this.operations.find(i => i.name === item)) {
          for (let i in this.operations) {
            if (this.operations[i].name === item) {
              this.operations[i].chosen = true;
            }
          }
        } else {
          this.presentHistory = item
        }
      }
      for (let item of obstericalHistory) {
        if (this.marriages.find(i => i.name === item)) {
          for (let i in this.marriages) {
            if (this.marriages[i].name === item) {
              this.marriages[i].chosen = true;
            }
          }

        } else if (this.birth.find(i => i.name === item)) {
          for (let i in this.birth) {
            if (this.birth[i].name === item) {
              this.birth[i].chosen = true;
            }
          }
        } else {
          this.obstericalHistory = item
        }
      }
      for (let item of familyHistory) {
        if (this.family.find(i => i.name === item)) {
          for (let i in this.family) {
            if (this.family[i].name === item) {
              this.family[i].chosen = true;
            }
          }
        } else {
          this.familyHistory = item
        }
      }
      for (let item of allergicHistory) {
        if (this.drugs.find(i => i.name === item)) {
          for (let i in this.drugs) {
            if (this.drugs[i].name === item) {
              this.drugs[i].chosen = true;
            }
          }
        } else if (this.foods.find(i => i.name === item)) {
          for (let i in this.foods) {
            if (this.foods[i].name === item) {
              this.foods[i].chosen = true;
            }
          }
        } else {
          this.allergicHistory = item
        }
      }
      for (let item of personalHabit) {
        if (this.habit.find(i => i.name === item)) {
          for (let i in this.habit) {
            if (this.habit[i].name === item) {
              this.habit[i].chosen = true;
            }
          }
        } else {
          this.personalHabit = item
        }
      }
    },
    beforeDestroy() {
      let presentHistory = [];
      let obstericalHistory = [];
      let familyHistory = [];
      let allergicHistory = [];
      let personalHabit = [];

      if (this.illness.find(i => i.chosen)) {
        presentHistory = presentHistory.concat(this.illness.filter(i => { if (i.chosen) return i.name }));
        if (this.infectious.find(i => i.chosen)) {
          presentHistory = presentHistory.concat(this.infectious.filter(i => { if (i.chosen) return i.name }));
        }
        if (this.operations.find(i => i.chosen)) {
          presentHistory = presentHistory.concat(this.operations.filter(i => { if (i.chosen) return i.name }));
        }

        if (this.marriages.find(i => i.chosen)) {
          obstericalHistory = obstericalHistory.concat(this.marriages.filter(i => { if (i.chosen) return i.name }));
        }
        if (this.data.birth.find(i => i.chosen)) {
          obstericalHistory = obstericalHistory.concat(this.birth.filter(i => { if (i.chosen) return i.name }));
        }

        if (this.family.find(i => i.chosen)) {
          familyHistory = familyHistory.concat(this.family.filter(i => { if (i.chosen) return i.name }));
        }

        if (this.drugs.find(i => i.chosen)) {
          allergicHistory = allergicHistory.concat(this.drugs.filter(i => { if (i.chosen) return i.name }));
        }
        if (this.foods.find(i => i.chosen)) {
          allergicHistory = allergicHistory.concat(this.foods.filter(i => { if (i.chosen) return i.name }));
        }

        if (this.habit.find(i => i.chosen)) {
          personalHabit = personalHabit.concat(this.habit.filter(i => { if (i.chosen) return i.name }));
        }

        let presentHistoryRec = this.presentHistory ? [this.presentHistory] : [];
        for (let item of presentHistory) {
          console.log(item)
          presentHistoryRec.push(item.name);
        }
        console.log(presentHistoryRec);
        // wx.setStorageSync('presentHistory', presentHistoryRec);
        localStorage.setItem('presentHistory', JSON.stringify(presentHistoryRec))
        let obstericalHistoryRec = this.obstericalHistory ? [this.obstericalHistory] : [];
        for (let item of obstericalHistory) {
          obstericalHistoryRec.push(item.name);
        }
        // wx.setStorageSync('obstericalHistory', obstericalHistoryRec);
        localStorage.setItem('obstericalHistory', JSON.stringify(obstericalHistoryRec))
        let familyHistoryRec = this.familyHistory ? [this.familyHistory] : [];
        for (let item of familyHistory) {
          familyHistoryRec.push(item.name);
        }
        // wx.setStorageSync('familyHistory', familyHistoryRec);
        localStorage.setItem('familyHistory', JSON.stringify(familyHistoryRec))
        let allergicHistoryRec = this.allergicHistory ? [this.allergicHistory] : [];
        for (let item of allergicHistory) {
          allergicHistoryRec.push(item.name);
        }
        // wx.setStorageSync('allergicHistory', allergicHistoryRec);
        localStorage.setItem('allergicHistory', JSON.stringify(allergicHistoryRec))
        let personalHabitRec = this.personalHabit ? [this.personalHabit] : [];
        for (let item of personalHabit) {
          personalHabitRec.push(item.name);
        }
        // wx.setStorageSync('personalHabit', personalHabitRec);
        localStorage.setItem('personalHabit', JSON.stringify(personalHabitRec))
      }

    }
  }
}

</script>
<style type="text/css" scoped lang='scss'>
@function vm($px) {
  @return ($px / 750) * 100vw
}

.page {
  padding-bottom: vm(50);
  background-color: #fff;
}

.btn-box {
  display: flex;
  width: 100vw;
  height: vm(80);
  border-bottom: #e2e2e2 1px solid;
}

.btn-box>button {
  flex: 1;
  font-size: vm(28);
  color: #999999;
  padding: 0;
  text-align: center;
  border-radius: 0;
  background-color: #ffffff;
  position: relative;
}

.btn-box>button.chosen {
  color: #333333;
}

.btn-box>button.chosen>i {
  position: absolute;
  display: block;
  width: vm(60);
  height: vm(6);
  left: 50%;
  bottom: 0;
  margin-left: vm(-30);
  background-color: #FE9B00;
}

.title {
  display: block;
  font-size: vm(30);
  color: #333333;
  margin-top: vm(50);
  margin-left: vm(30);
}

.mark-box {
  width: 100vw;
  box-sizing: border-box;
  padding: vm(30) vm(30) 0;
}

.mark-box::after {
  content: '';
  display: block;
  clear: both;
}

.mark-box>li {
  display: block;
  width: vm(200);
  height: vm(48);
  line-height: vm(48);
  border: #c8c8c8 1px solid;
  text-align: center;
  vertical-align: bottom;
  font-size: vm(28);
  color: #999999;
  border-radius: vm(4);
  margin-right: vm(38);
  margin-top: vm(30);
}

.mark-box>li.chosen {
  background-color: #16A9F6;
  border: #16A9F6 1px solid;
  color: #ffffff;
}

.mark-box>li:nth-child(3n) {
  margin-right: 0;
}

.input-box>textarea {
  width: vm(690);
  height: vm(150);
  box-sizing: border-box;
  font-size: vm(28);
  border: #8F8F8F 1px solid;
  border-radius: 4px;
  margin: vm(30) auto;
  padding: vm(20);
}

</style>
