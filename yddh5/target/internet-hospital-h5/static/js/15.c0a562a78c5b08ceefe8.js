webpackJsonp([15],{"+ab4":function(t,e){},"2J+O":function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=o("mMon"),i=o("eoeZ"),n=o("uVW5"),a=o("9rMa"),r={data:function(){return{message:"",load_show:!1,notice_show:"",docInfo:null,patients:[],patient:null,alert:!1,choose:!1,clauseShow:!1,visTypeArr:[],visAlert:!1,visType:null,getUserInfo:!1,typeCode:"",proId:"",orderId:"",orderHeaderId:"",amount:0,couponCount:0,useThisCoupon:null,hospitalPort:!1,hadCoupon:!0,createdPatient:!1}},components:{NoticeDialog:s.a,Notice:i.a,Loading:n.a},beforeRouteLeave:function(t,e,o){(/doctor/g.exec(t.path)||/chat/g.exec(t.path)||/payment/g.exec(t.path))&&(localStorage.removeItem("useThisCoupon"),this.$destroy()),o()},computed:Object(a.b)({openId:function(t){return""===t.openId&&JSON.parse(localStorage.getItem("loginInfo"))&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.openId},header:function(t){return""===t.header&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.header},userId:function(t){return""===t.userId&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.userId}}),activated:function(){var t=this.$route.query;console.log(t),this.getInfo(t)},methods:{getInfo:function(t){var e=this;this.createdPatient&&this.changePatient();var o=JSON.parse(localStorage.getItem("useThisCoupon"));if(console.log(o),o){this.useThisCoupon=o;var s=setInterval(function(){o&&(e.confirmPrice(o.couponProductId),clearInterval(s))},1e3)}this.hospitalPort&&(this.hospitalPort=!0),t.orderHeaderId?(console.log(t.orderHeaderId),this.orderHeaderId=t.orderHeaderId,this.getOrderInfo(t.orderHeaderId)):(this.typeCode=t.type,this.proId=t.proId,this.getFirstInfo(t.id))},getFirstInfo:function(t){var e=this,o=this,s=this.$conf.url+"/internethospital/api/doctors/"+t;this.$axios.get(s,{headers:this.$store.state.header}).then(function(t){var s=t.data.services.indexOf(t.data.services.find(function(t){return"CONSULT_FREE"===t.code&&t.inventoryQuantity>0}));s>=0?t.data.services[0]=[t.data.services[s],t.data.services[s]=t.data.services[0]][0]:(s=t.data.services.indexOf(t.data.services.find(function(t){return"CONSULT"===t.code})))>0&&(t.data.services[0]=[t.data.services[s],t.data.services[s]=t.data.services[0]][0]),t.data.organizationText.length>11&&(t.data.organizationText=t.data.organizationText.slice(0,11)+"..."),t.data.doctorAvatar?t.data.doctorAvatar=t.data.doctorAvatar+"-doctor_list":t.data.doctorAvatar="static/images/defualt-header.png",t.data.services[0]&&t.data.services[0].price&&t.data.services[0].price.toString().indexOf(".")<0?t.data.services[0].price=t.data.services[0].price+".00":t.data.services[0]&&t.data.services[0].price&&2!==t.data.services[0].price.toString().slice(t.data.services[0].price.toString().indexOf(".")+1).length&&(t.data.services[0].price=t.data.services[0].price+"0"),o.docInfo=t.data,o.amount=t.data.services[0].price,e.getCouponInfo()}).catch(function(t){e.notice_show="链接出错，请检查网络链接",setTimeout(function(){e.notice_show=""},2e3)})},getOrderInfo:function(t){var e=this,o=this,s=this.$conf.url+"/internethospital/api/orders/consultations?order-header-id="+t+"&page-index=1&page-size=10";this.$axios.get(s,{headers:this.$store.state.header}).then(function(t){var e=t.data.content[0];console.log(e),e.doctorAvatar||(e.doctorAvatar="static/images/defualt-header.png"),e&&e.amount&&e.amount.toString().indexOf(".")<0?e.amount=e.amount+".00":e&&e.amount&&2!==e.amount.toString().slice(e.amount.toString().indexOf(".")+1).length&&(e.amount=e.amount+"0");var s={doctorAvatar:e.doctorAvatar,doctorName:e.doctorName,departmentText:e.departmentText,organizationText:e.organizationText,services:[{price:e.originalAmount}]};o.docInfo=s,o.patient={name:e.patientName},o.visType={type:e.reExamination?"复诊":"初诊"},o.amount=e.amount,o.choose=!0,o.useThisCoupon={},e.coupontAmount=e.coupontAmount?e.coupontAmount.toString().replace("-",""):0,o.useThisCoupon={amount:e.coupontAmount}}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})},getCouponInfo:function(){var t=this;if(this.hadCoupon){var e=this.$conf.url+"/internethospital/api/inventories/coupons?user-id="+this.userId+"&page-index=1&page-size=10000";this.$axios.post(e,{},{headers:this.$store.state.header}).then(function(e){var o=e.data.content.filter(function(e){return"AVAILABLE"===e.status&&(e.departmentId?e.departmentId===t.data.docInfo.departmentId:!e.organizationId||e.organizationId===t.data.docInfo.organizationId)});t.couponCount=o.length})}},choseCoupon:function(){(this.amount>0||!this.amount)&&this.couponCount>0&&!this.orderHeaderId&&this.$router.push({path:"/coupon/chose",query:{organizationId:this.docInfo.organizationId,departmentId:this.docInfo.departmentId}})},confirmPrice:function(t){var e=this,o=this.$conf.url+"/internethospital/api/orders/consultations/price",s={couponProductId:t,doctorId:this.docInfo.doctorId,departmentId:this.docInfo.departmentId,orderTypeCode:this.docInfo.services[0].code,organizationId:this.docInfo.organizationId,productId:this.docInfo.services[0].id};this.$axios.post(o,s,{headers:this.$store.state.header}).then(function(t){e.amount=t.data}).catch(function(t){e.notice_show=t,setTimeout(function(){e.notice_show=""},2e3)})},gotToPay:function(){var t=this,e=this;if(console.log(this.orderHeaderId),this.orderHeaderId)e.docInfo.services[0].free||0===e.amount?(e.disciount(this.orderHeaderId),this.notice_show="创建订单成功",setTimeout(function(){t.notice_show=""},2e3)):e.pay(e.orderHeaderId);else if(this.patient&&this.choose){var o=this.$conf.url+"/internethospital/api/orders/consultations",s={doctorId:this.docInfo.doctorId,orderTypeCode:this.typeCode,patientId:this.patient.id,productId:this.proId,userId:this.userId};this.useThisCoupon&&(s.couponId=this.useThisCoupon.couponId),console.log(s),this.load_show=!0,this.$axios.post(o,s,{headers:this.$store.state.header}).then(function(o){console.log(o),e.docInfo.services[0].free||0===e.amount?(console.log(77),t.load_show=!1,e.disciount(o.data.orderHeaderId),t.notice_show="创建订单成功",setTimeout(function(){t.notice_show=""},2e3)):e.pay(o.orderHeaderId)}).catch(function(e){t.load_show=!1,t.notice_show=e.response.data.message,setTimeout(function(){t.notice_show=""},2e3)})}else this.patient?(this.notice_show="请确认服务条款",setTimeout(function(){t.notice_show=""},2e3)):(this.notice_show="请选择就诊人",setTimeout(function(){t.notice_show=""},2e3))},disciount:function(t){var e=this,o=this.$conf.url+"/internethospital/api/orders/consultations?order-header-id="+t+"&page-index=1&page-size=1";this.$axios.get(o,{headers:this.$store.state.header}).then(function(t){console.log(t),setTimeout(function(){e.$router.push("/chat/"+t.data.content[0].orderHeaderId)},1500)}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})},pay:function(t){var e=this;this.load_show=!0;var o=this.$conf.url+"/internethospital/api/orders/"+t+"/pay-infors/wechat?open-id="+this.openId;this.$axios.post(o,{},{headers:this.$store.state.header}).then(function(t){e.load_show=!1}).catch(function(t){e.load_show=!1,console.log(t)})},notNow:function(){this.getUserInfo=!1,this.$router.push("/home")},makeChoise:function(t){console.log(t.detail.userInfo),t.detail.userInfo?(this.getUserInfo=!1,this.$store.commit("setUserInfo",t.detail.userInfo),this.$router.push("/register-login")):(this.getUserInfo=!1,this.$router.push("/home"))},dontDo:function(){this.clauseShow=!1,this.choose=!1},accept:function(){this.choose=!0,this.clauseShow=!1},checkClause:function(){this.orderHeaderId||(this.clauseShow=!0)},changeVis:function(){this.orderHeaderId||(this.visAlert=!0,this.visTypeArr=[{id:1,type:"初诊"},{id:2,type:"复诊"}])},changePatient:function(){var t=this;if(!this.orderHeaderId){this.alert=!0;var e=this,o=this.$conf.url+"/internethospital/api/patients?user-id="+this.userId+"&page-index=1&page-size=100";console.log(o),this.$axios.get(o,{Authorization:"Bearer "+this.token}).then(function(t){console.log(t),e.patients=t.data.content}).catch(function(e){t.notice_show=e.response.data.message,setTimeout(function(){t.notice_show=""},2e3)})}},agreeClause:function(){this.orderHeaderId||(this.choose=!this.choose)},changePatients:function(t){var e=this.patients.find(function(e){return e.id===t});this.patient=e,this.closeAlert()},closeAlert:function(){this.alert=!1,this.visAlert=!1,this.clauseShow=!1},getToAddPatient:function(){this.createdPatient=!0,this.$router.push("/patient/edit")}}},c={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"page"},[o("div",{staticClass:"srollder"},[o("div",{staticClass:"doctor_top"},[t._v("\n      急重症患者请到就近医院就诊，或直接拨打120！\n    ")]),t._v(" "),t.docInfo?o("div",{staticClass:"section"},[o("div",{staticClass:"nurseInfo"},[o("div",{staticClass:"infoBox"},[o("img",{staticClass:"left",attrs:{src:t.docInfo.doctorAvatar}}),t._v(" "),o("div",{staticClass:"left"},[o("div",[o("span",[t._v(t._s(t.docInfo.doctorName))]),t._v(" "),o("span",[t._v(t._s(t.docInfo.positionalTitleText?t.docInfo.positionalTitleText:t.docInfo.standPositionalTitleText))])]),t._v(" "),o("div",[o("span",[t._v(t._s(t.docInfo.organizationText))]),o("span",[t._v(t._s(t.docInfo.departmentText))])]),t._v(" "),o("div",[o("span",[t._v("￥"+t._s(t.docInfo.services[0].price?t.docInfo.services[0].price:0)+"/次")])])])])]),t._v(" "),o("div",{staticClass:"middel-part"},[o("div",{on:{click:t.changePatient}},[o("span",{staticClass:"left"},[t._v("就诊人")]),t._v(" "),o("span",{staticClass:"right"},[t._v(t._s(t.patient?t.patient.name:"请选择"))])]),t._v(" "),o("div",{staticClass:"price"},[o("span",{staticClass:"left"},[t._v("付款金额")]),t._v(" "),o("span",{staticClass:"right"},[t._v("￥"+t._s(t.docInfo.services[0].price?t.docInfo.services[0].price:0))])])]),t._v(" "),!t.hospitalPort&&t.hadCoupon?o("div",{staticClass:"middel-part"},[o("div",{staticClass:"coupon",on:{click:t.choseCoupon}},[o("span",{staticClass:"left"},[t._v("使用优惠券")]),t._v(" "),o("span",{staticClass:"right",class:t.useThisCoupon&&0===t.useThisCoupon.amount?"gray":""},[t._v(t._s(t.useThisCoupon?0===t.useThisCoupon.amount?"此订单未使用优惠券":"-￥"+t.useThisCoupon.amount:t.couponCount+"张可用"))])])]):t._e(),t._v(" "),t._m(0),t._v(" "),t._m(1),t._v(" "),o("div",{staticClass:"server-clause",on:{click:t.agreeClause}},[t.choose?t._e():o("img",{staticClass:"left",attrs:{src:"static/images/input-unchoose.png"}}),t._v(" "),t.choose?o("img",{staticClass:"left",attrs:{src:"static/images/input-choose.png"}}):t._e(),t._v(" "),o("div",{staticClass:"left text"},[t._v("我已阅读并同意"),o("span",{on:{click:t.checkClause}},[t._v("《互联网医院网络门诊问诊须知》")])])]),t._v(" "),o("div",{staticClass:"pay-box"},[o("div",{staticClass:"left text"},[t._v("实付"),o("span",[t._v("￥"+t._s(t.amount||0))])]),t._v(" "),o("button",{staticClass:"left",on:{click:t.gotToPay}},[t._v("立即支付")])])]):t._e()]),t._v(" "),t.alert?o("div",{staticClass:"alert",on:{click:t.closeAlert}},[o("div",t._l(t.patients,function(e,s){return o("button",{attrs:{"data-id":e.id},on:{click:function(o){t.changePatients(e.id)}}},[o("span",[t._v(t._s(e.name))])])})),t._v(" "),o("button",{on:{click:t.getToAddPatient}},[t._v("添加就诊人")])]):t._e(),t._v(" "),t.visAlert?o("div",{staticClass:"alert vis",on:{click:t.closeAlert}},[o("div",t._l(t.visTypeArr,function(e,s){return o("button",{attrs:{"data-id":e.id},on:{click:t.changeVisit}},[o("span",[t._v(t._s(e.type))])])}))]):t._e(),t._v(" "),o("div",{staticClass:"clause",class:t.clauseShow?"show":"",on:{click:t.closeAlert}},[o("div",[t._m(2),t._v(" "),o("div",[o("button",{on:{click:t.dontDo}},[t._v("不接受")]),t._v(" "),o("button",{on:{click:t.accept}},[t._v("接受")])])])]),t._v(" "),o("notice",{directives:[{name:"show",rawName:"v-show",value:t.notice_show,expression:"notice_show"}],attrs:{message:t.notice_show}}),t._v(" "),o("loading",{directives:[{name:"show",rawName:"v-show",value:t.load_show,expression:"load_show"}]})],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"docotr_notice"},[e("span",[this._v("问诊须知 "),e("br")]),this._v(" "),e("span",[this._v("1. 提问成功后，若医生在24小时内未回复，订单费用将在5个工作日内退回；"),e("br"),this._v("\n  2. 医生回复后，单次服务有效时间为24小时；"),e("br"),this._v("\n  3.问诊过程中，医生可能由于手术、出诊等情况暂时离开，您可继续提出有效问题，医生会抽空为您解答。\n  ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"pay-type"},[e("li",[e("img",{staticClass:"left",attrs:{src:"static/images/weChetPay.png"}}),this._v(" "),e("span",{staticClass:"left"},[this._v("微信支付")]),this._v(" "),e("img",{staticClass:"left",attrs:{src:"static/images/chosen.png"}})])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("span",[this._v("互联网医院网络门诊\\n问诊须知")]),this._v(" "),e("span",[this._v("一、服务内容：\\n互联网医院网络门诊是将各医院优质医疗资源整合到平台，为患者提供线上问诊服务，在线开具电子处方，药品配送到家的闭环式互联网诊疗服务。\\n网络门诊旨在给您更好的就医服务体验：\\n① 随时随地挂号问诊；\\n②  汇聚川内各大型医院专家医师；\\n③ 通过手机即可实现视频问诊；\\n④  在线购药，药品配送到家；\\n\\n二、服务流程：\\n①选择医院医生—＞填写个人问诊资料—＞支付挂号费用—＞医生接诊—＞问诊结束—＞查看诊断建议（电子处方）—＞在线支付药费—＞药品配送到家。\\n②选择医院医生—＞填写个人问诊资料—＞支付挂号费用—＞医生接诊—＞问诊结束—＞查看诊断建议（检验检查申请）—＞绑定就诊卡—＞到指定医院付费做检查。\\n\\n三、注意事项：\\n①  填写患者就诊资料时，应真实、详细、准确，便于医生诊断；\\n②  问诊过程中确保手机网络正常；\\n③ 等待接诊时应授权同意“互联网医院”应用，后台运行和提醒；\\n④ 问诊有效时长为24小时，介于医生工作性质特殊，有时无法立即回复，请您耐心等待；\\n\\n四、免责说明：\\n① 急诊患者请到就近医院就诊，或直接拨打120；\\n② 初诊患者请到实体医院就诊；\\n③  低龄儿童（6岁以下）在使用本平台在线问诊时，须有监护人和相关专业医师陪伴。\\n本平台为常见病、慢性病的复诊患者提供正规实体医疗机构线上问诊服务，患者问诊时须按医生要求提供真实、详细、准确的病情资料和检验检查资料，以便于医生诊断，医生依据上述资料予以诊断。如因患者提供不实的信息和资料，导致的医疗风险将完全由用户承担；如果用户自行治疗或未完全遵循医嘱自服药品出现问题，本平台运营方和医疗机构不承担任何责任。\\n\\n五：客服电话：\\n平台客服电话：400-800-1335\n   ")])])}]};var d=o("C7Lr")(r,c,!1,function(t){o("+ab4")},"data-v-7683ab4f",null);e.default=d.exports}});
//# sourceMappingURL=15.c0a562a78c5b08ceefe8.js.map