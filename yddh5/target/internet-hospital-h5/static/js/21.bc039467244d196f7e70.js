webpackJsonp([21],{"8pyX":function(t,e){},wM3v:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=s("mMon"),n=s("eoeZ"),i=s("uVW5"),a=s("9rMa"),r={data:function(){return{message:"",load_show:!1,notice_show:"",nurseInfo:null,patients:[],patient:null,alert:!1,choose:!1,clauseShow:!1,visTypeArr:[],visAlert:!1,visType:null,getUserInfo:!1,typeCode:"",proId:"",orderId:"",orderHeaderId:"",amount:0,couponCount:0,useThisCoupon:null,hospitalPort:!1,hadCoupon:!0,createdPatient:!1}},components:{NoticeDialog:o.a,Notice:n.a,Loading:i.a},beforeRouteLeave:function(t,e,s){console.log(55),(/doctor/g.exec(t.path)||/payment/g.exec(t.path)||/chat/g.exec(t.path))&&(console.log(77),localStorage.removeItem("useThisCoupon"),this.$destfroy()),s()},computed:Object(a.b)({openId:function(t){return""===t.openId&&JSON.parse(localStorage.getItem("loginInfo"))&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.openId},hospitalId:function(t){return""===t.hospitalId&&JSON.parse(localStorage.getItem("hospitalInfo"))&&this.$store.commit("setHospital",JSON.parse(localStorage.getItem("hospitalInfo"))),t.hospitalId},hospitalPorts:function(t){return""===t.hospitalPort&&JSON.parse(localStorage.getItem("hospitalInfo"))&&this.$store.commit("setHospital",JSON.parse(localStorage.getItem("hospitalInfo"))),t.hospitalPort},header:function(t){return""===t.header&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.header},userId:function(t){return""===t.userId&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.userId}}),activated:function(){var t=this.$route.query;console.log(t),this.getInfo(t)},methods:{getInfo:function(t){var e=this;this.createdPatient&&this.changePatient();var s=JSON.parse(localStorage.getItem("useThisCoupon"));if(s){this.useThisCoupon=s;var o=setInterval(function(){s&&(e.confirmPrice(s.couponProductId),clearInterval(o))},1e3)}this.hospitalPort&&(this.hospitalPort=!0),t.orderHeaderId?(console.log(t.orderHeaderId),this.orderHeaderId=t.orderHeaderId,this.getOrderInfo(t.orderHeaderId)):(this.typeCode=t.type,this.proId=t.proId,this.getFirstInfo(t.id))},getFirstInfo:function(t){var e=this,s=this,o=this.$conf.url+"/internethospital/api/nurses/"+t;this.$axios.get(o,{headers:this.$store.state.header}).then(function(t){if(console.log(t),t.status>=200&&t.status<=399){var o=t.data.services.indexOf(t.data.services.find(function(t){return"CONSULT_FREE"===t.code&&t.inventoryQuantity>0}));o>=0?t.data.services[0]=[t.data.services[o],t.data.services[o]=t.data.services[0]][0]:(o=t.data.services.indexOf(t.data.services.find(function(t){return"CONSULT"===t.code})))>0&&(t.data.services[0]=[t.data.services[o],t.data.services[o]=t.data.services[0]][0]),t.data.organizationText.length>11&&(t.data.organizationText=t.data.organizationText.slice(0,11)+"..."),t.data.nurseAvatar?t.data.nurseAvatar=t.data.nurseAvatar+"-doctor_list":t.data.nurseAvatar="static/images/defualt-header.png",t.data.services[0]&&t.data.services[0].price&&t.data.services[0].price.toString().indexOf(".")<0?t.data.services[0].price=t.data.services[0].price+".00":t.data.services[0]&&t.data.services[0].price&&2!==t.data.services[0].price.toString().slice(t.data.services[0].price.toString().indexOf(".")+1).length&&(t.data.services[0].price=t.data.services[0].price+"0"),s.nurseInfo=t.data,s.amount=t.data.services[0].price,e.getCouponInfo()}else e.notice_show=""+t.data.message,setTimeout(function(){e.notice_show="",e.$router.back()},2e3)}).catch(function(t){e.notice_show="链接出错，请检查网络链接",setTimeout(function(){e.notice_show=""},2e3)})},getOrderInfo:function(t){var e=this,s=this,o=this.$conf.url+"/internethospital/api/orders/consultations?user-id="+this.userId+"&page-index=1&page-size=10000";this.$axios.get(o,{headers:this.$store.state.header}).then(function(o){if(o.status>=200||o.status<=399){var n=o.data.content.find(function(e){return e.orderHeaderId===t});console.log(n),n.nurseAvatar||(n.nurseAvatar="static/images/defualt-header.png"),n&&n.amount&&n.amount.toString().indexOf(".")<0?n.amount=n.amount+".00":n&&n.amount&&2!==n.amount.toString().slice(n.amount.toString().indexOf(".")+1).length&&(n.amount=n.amount+"0");var i={nurseAvatar:n.nurseAvatar,nurseName:n.nurseName,departmentText:n.departmentText,organizationText:n.organizationText,services:[{price:n.originalAmount}]};s.nurseInfo=i,s.patient={name:n.patientName},s.visType={type:n.reExamination?"复诊":"初诊"},s.amount=n.amount,s.choose=!0,n.coupontAmount=n.coupontAmount?n.coupontAmount.toString().replace("-",""):0,s.useThisCoupon={amount:n.coupontAmount}}else e.notice_show=""+(o.data.message||o.data),setTimeout(function(){e.notice_show="",e.$router.back()},2e3)}).catch(function(t){e.notice_show="链接出错，请检查网络链接",setTimeout(function(){e.notice_show=""},2e3)})},getCouponInfo:function(){var t=this;if(this.hadCoupon){var e=this.$conf.url+"/internethospital/api/inventories/coupons?user-id="+this.userId+"&page-index=1&page-size=10000";this.$axios.post(e,{},{headers:this.$store.state.header}).then(function(e){var s=e.data.content.filter(function(e){return"AVAILABLE"===e.status&&(e.departmentId?e.departmentId===t.nurseInfo.departmentId:!e.organizationId||e.organizationId===t.nurseInfo.organizationId)});console.log(s.length),t.couponCount=s.length})}},choseCoupon:function(){if((this.amount>0||!this.amount)&&this.couponCount>0&&!this.orderHeaderId){var t="/coupon/chose?organizationId="+this.nurseInfo.organizationId+"&departmentId="+this.nurseInfo.departmentId;this.$router.push(t)}},confirmPrice:function(t){var e=this,s=this.$conf.url+"/internethospital/api/orders/consultations/price",o={couponProductId:t,nurseId:this.nurseInfo.nurseId,departmentId:this.nurseInfo.departmentId,orderTypeCode:this.nurseInfo.services[0].code,organizationId:this.nurseInfo.organizationId,productId:this.nurseInfo.services[0].id};this.$axios.post(s,o,{headers:this.$store.state.header}).then(function(t){e.amount=t.data,console.log(t)}).catch(function(t){e.notice_show=t.data.message,setTimeout(function(){e.notice_show=""},2e3)})},gotToPay:function(){var t=this,e=this;if(this.orderHeaderId)e.nurseInfo.services[0].free||0===e.amount?(this.notice_show="创建订单成功",setTimeout(function(){t.notice_show=""},2e3),e.disciount(this.orderHeaderId)):e.pay(this.orderHeaderId);else if(this.patient&&this.choose){var s=this.$conf.url+"/internethospital/api/orders/consultations",o={nurseId:this.nurseInfo.nurseId,orderTypeCode:this.typeCode,patientId:this.patient.id,productId:this.proId,userId:this.userId};this.useThisCoupon&&(o.couponId=this.useThisCoupon.couponId),this.$axios.post(s,o,{headers:this.$store.state.header}).then(function(s){console.log(s),s.status>=200&&s.status<=399?e.nurseInfo.services[0].free||0===e.amount?(e.load_show=!0,t.notice_show="创建订单成功",setTimeout(function(){t.notice_show=""},2e3),e.disciount(s.orderHeaderId)):e.pay(s.orderHeaderId):(e.load_show=!1,t.notice_show=""+(s.data.message||s.data),setTimeout(function(){t.notice_show=""},2e3))}).catch(function(e){t.notice_show="链接出错，请检查网络链接",setTimeout(function(){t.notice_show=""},2e3)})}else this.patient?(this.notice_show="请确认服务条款",setTimeout(function(){t.notice_show=""},2e3)):(this.notice_show="请选择就诊人",setTimeout(function(){t.notice_show=""},2e3))},disciount:function(t){var e=this,s=this.$conf.url+"/internethospital/api/orders/consultations?order-header-id="+t+"&page-index=1&page-size=1";this.$axios.get(s,{headers:this.$store.state.header}).then(function(t){console.log(t);var s="/chat/"+t.content[0].orderHeaderId;setTimeout(function(){e.$router.push(s)},1500)})},pay:function(t){var e=this,s=this.$conf.url+"/internethospital/api/orders/"+t+"/pay-infors/wechat?open-id="+this.openId;this.$axios.post(s,{},{headers:this.$store.state.header}).then(function(t){e.load_show=!1}).catch(function(t){e.load_show=!1,console.log(t)})},notNow:function(){this.getUserInfo=!1,this.$router.push("/home")},makeChoise:function(t){console.log(t.detail.userInfo),t.detail.userInfo?(this.getUserInfo=!1,this.$store.commit("setAuthorization",!0),this.$store.commit("setUserInfo",t.detail.userInfo),this.$router.push("/register-login")):(this.getUserInfo=!1,this.$router.push("/home"))},dontDo:function(){this.clauseShow=!1,this.choose=!1},accept:function(){this.choose=!0,this.clauseShow=!1},checkClause:function(){this.orderHeaderId||(this.clauseShow=!0)},changeVis:function(){this.orderHeaderId||(this.visAlert=!0,this.visTypeArr=[{id:1,type:"初诊"},{id:2,type:"复诊"}])},changePatient:function(){var t=this;if(!this.orderHeaderId){this.alert=!0;var e=this.$conf.url+"/internethospital/api/patients?user-id="+this.userId+"&page-index=1&page-size=100";this.$axios.get(e,{headers:this.$store.state.header}).then(function(e){console.log(e),t.patients=e.data.content}).catch(function(e){t.notice_show=e.response.data.message,setTimeout(function(){t.notice_show=""},2e3)})}},agreeClause:function(){this.orderHeaderId||(this.choose=!this.choose)},changePatients:function(t){console.log(t);var e=this.patients.find(function(e){return e.id===t});this.patient=e,this.closeAlert()},closeAlert:function(){this.alert=!1,this.visAlert=!1,this.clauseShow=!1},getToAddPatient:function(){this.createdPatient=!0,this.$router.push("/patient/edit")}}},c={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"page"},[s("div",{staticClass:"scrolled"},[s("div",{staticClass:"doctor_top"},[t._v("\n        急重症患者请到就近医院就诊，或直接拨打120！\n      ")]),t._v(" "),t.nurseInfo?s("div",{staticClass:"section"},[s("div",{staticClass:"nurseInfo"},[s("div",{staticClass:"infoBox"},[s("img",{staticClass:"left",attrs:{src:t.nurseInfo.nurseAvatar}}),t._v(" "),s("div",{staticClass:"left"},[s("div",[s("span",[t._v(t._s(t.nurseInfo.nurseName))]),t._v(" "),s("span",[t._v(t._s(t.nurseInfo.positionalTitleText?t.nurseInfo.positionalTitleText:t.nurseInfo.standPositionalTitleText))])]),t._v(" "),s("div",[s("span",[t._v(t._s(t.nurseInfo.organizationText))]),s("span",[t._v(t._s(t.nurseInfo.departmentText))])]),t._v(" "),s("div",[s("span",[t._v("￥"+t._s(t.nurseInfo.services[0].price?t.nurseInfo.services[0].price:0)+"/次")])])])])]),t._v(" "),s("div",{staticClass:"middel-part"},[s("div",{on:{click:t.changePatient}},[s("span",{staticClass:"left"},[t._v("就诊人")]),t._v(" "),s("span",{staticClass:"right"},[t._v(t._s(t.patient?t.patient.name:"请选择"))])]),t._v(" "),s("div",{staticClass:"price"},[s("span",{staticClass:"left"},[t._v("付款金额")]),t._v(" "),s("span",{staticClass:"right"},[t._v("￥"+t._s(t.nurseInfo.services[0].price?t.nurseInfo.services[0].price:0))])])]),t._v(" "),!t.hospitalPort&&t.hadCoupon?s("div",{staticClass:"middel-part"},[s("div",{staticClass:"coupon",on:{click:t.choseCoupon}},[s("span",{staticClass:"left"},[t._v("使用优惠券")]),t._v(" "),s("span",{staticClass:"right",class:t.useThisCoupon&&0===t.useThisCoupon.amount?"gray":""},[t._v(t._s(t.useThisCoupon?0===t.useThisCoupon.amount?"此订单未使用优惠券":"-￥"+t.useThisCoupon.amount:t.couponCount+"张可用"))])])]):t._e(),t._v(" "),t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),s("div",{staticClass:"server-clause",on:{click:t.agreeClause}},[t.choose?t._e():s("img",{staticClass:"left",attrs:{src:"static/images/input-unchoose.png"}}),t._v(" "),t.choose?s("img",{staticClass:"left",attrs:{src:"static/images/input-choose.png"}}):t._e(),t._v(" "),s("div",{staticClass:"left text"},[t._v("我已阅读并同意"),s("span",{on:{click:t.checkClause}},[t._v("《互联网医院网络门诊问诊须知》")])])]),t._v(" "),s("div",{staticClass:"pay-box"},[s("div",{staticClass:"left text"},[t._v("实付"),s("span",[t._v("￥"+t._s(t.amount||0))])]),t._v(" "),s("button",{staticClass:"left",on:{click:t.gotToPay}},[t._v("立即支付")])])]):t._e()]),t._v(" "),t.alert?s("div",{staticClass:"alert",on:{click:t.closeAlert}},[s("div",t._l(t.patients,function(e,o){return s("button",{attrs:{"data-id":"item.id"},on:{click:function(s){t.changePatients(e.id)}}},[s("span",[t._v(t._s(e.name))])])})),t._v(" "),s("button",{on:{click:t.getToAddPatient}},[t._v("添加就诊人")])]):t._e(),t._v(" "),t.visAlert?s("div",{staticClass:"alert vis",on:{click:t.closeAlert}},[s("div",t._l(t.visTypeArr,function(e,o){return s("button",{attrs:{"data-id":"item.id"},on:{click:t.changeVisit}},[s("span",[t._v(t._s(e.type))])])}))]):t._e(),t._v(" "),s("div",{staticClass:"clause",class:t.clauseShow?"show":"",on:{click:t.closeAlert}},[s("div",[t._m(3),t._v(" "),s("div",[s("button",{on:{click:t.dontDo}},[t._v("不接受")]),t._v(" "),s("button",{on:{click:t.accept}},[t._v("接受")])])])]),t._v(" "),s("notice",{directives:[{name:"show",rawName:"v-show",value:t.notice_show,expression:"notice_show"}],attrs:{message:t.notice_show}}),t._v(" "),s("loading",{directives:[{name:"show",rawName:"v-show",value:t.load_show,expression:"load_show"}]})],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"notice"},[e("span",[this._v("问诊须知")]),this._v(" "),e("span",[this._v("1. 急重症患者不适合网上诊疗和咨询，请及时前往医院就诊；\\n2. 发起问诊后，24小时内医生未回复，订单费用将全额退回；\\n3.请在医生回复后24小时内完成问诊。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"docotr_notice"},[e("span",[this._v("问诊须知\\n")]),this._v(" "),e("span",[this._v("1. 提问成功后，若医生在24小时内未回复，订单费用将在5个工作日内退回；\n    2. 医生回复后，单次服务有效时间为24小时；\n    3.问诊过程中，医生可能由于手术、出诊等情况暂时离开，您可继续提出有效问题，医生会抽空为您解答。\n    ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"pay-type"},[e("li",[e("img",{staticClass:"left",attrs:{src:"static/images/weChetPay.png"}}),this._v(" "),e("span",{staticClass:"left"},[this._v("微信支付")]),this._v(" "),e("img",{staticClass:"left",attrs:{src:"static/images/chosen.png"}})])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("span",[this._v("互联网医院网络门诊\\n问诊须知")]),this._v(" "),e("span",[this._v("一、服务内容：\\n互联网医院网络门诊是将各医院优质医疗资源整合到平台，为患者提供线上问诊服务，在线开具电子处方，药品配送到家的闭环式互联网诊疗服务。\\n网络门诊旨在给您更好的就医服务体验：\\n① 随时随地挂号问诊；\\n②  汇聚川内各大型医院专家医师；\\n③ 通过手机即可实现视频问诊；\\n④  在线购药，药品配送到家；\\n\\n二、服务流程：\\n①选择医院医生—＞填写个人问诊资料—＞支付挂号费用—＞医生接诊—＞问诊结束—＞查看诊断建议（电子处方）—＞在线支付药费—＞药品配送到家。\\n②选择医院医生—＞填写个人问诊资料—＞支付挂号费用—＞医生接诊—＞问诊结束—＞查看诊断建议（检验检查申请）—＞绑定就诊卡—＞到指定医院付费做检查。\\n\\n三、注意事项：\\n①  填写患者就诊资料时，应真实、详细、准确，便于医生诊断；\\n②  问诊过程中确保手机网络正常；\\n③ 等待接诊时应授权同意“互联网医院”应用，后台运行和提醒；\\n④ 问诊有效时长为24小时，介于医生工作性质特殊，有时无法立即回复，请您耐心等待；\\n\\n四、免责说明：\\n① 急诊患者请到就近医院就诊，或直接拨打120；\\n② 初诊患者请到实体医院就诊；\\n③  低龄儿童（6岁以下）在使用本平台在线问诊时，须有监护人和相关专业医师陪伴。\\n本平台为常见病、慢性病的复诊患者提供正规实体医疗机构线上问诊服务，患者问诊时须按医生要求提供真实、详细、准确的病情资料和检验检查资料，以便于医生诊断，医生依据上述资料予以诊断。如因患者提供不实的信息和资料，导致的医疗风险将完全由用户承担；如果用户自行治疗或未完全遵循医嘱自服药品出现问题，本平台运营方和医疗机构不承担任何责任。\\n\\n五：客服电话：\\n平台客服电话：400-800-1335\n")])])}]};var u=s("C7Lr")(r,c,!1,function(t){s("8pyX")},"data-v-4b4fd656",null);e.default=u.exports}});
//# sourceMappingURL=21.bc039467244d196f7e70.js.map