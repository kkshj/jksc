import Vue from 'vue'
import Vuex from 'vuex'

import 'es6-promise/auto'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pageType: 'main-page',
    hospitalPort: false,
    hospitalId: '',
    questing: true,
    userInfo: null,
    authorization: true,
    login: false,
    token: '',
    header: null,
    userSign: '',
    userName: '',
    userId: '',
    openId: '',
    firstName: '',
    imId: '',
    doctorCode: '',
    nurseCode: '',
    couponCode: ''
  },
  mutations: {
    changePageType (state, type) {
      state.pageType = type;
      localStorage.setItem('pageType', type);
    },
    setHospital(state, hospital) {
      state.hospitalPort = hospital.port;
      state.hospitalId = hospital.id;
      localStorage.setItem('hospitalInfo', JSON.stringify(hospital));
    },
    setQuesting (state) {
      state.questing = !state.questing;
      localStorage.setItem('questing', state.questing);
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    setUser(state, user) {
      state.token = user.access_token;
      state.header = { 'Authorization': 'Bearer ' + user.access_token };
      state.userSign = user.user_sign;
      state.userName = user.username;
      state.userId = user.user_id;
      state.openId = user.open_id;
      state.firstName = user.first_name;
      state.imId = user.im_id;
      localStorage.setItem('loginInfo', JSON.stringify(user));
    },
    setPageCode(state, page) {
      state.doctorCode = page.doctorCode;
      state.nurseCode = page.nurseCode;
      state.couponCode = page.couponCode;
      localStorage.setItem('pageCode', JSON.stringify(page));
    }
  }
})

export default store
 