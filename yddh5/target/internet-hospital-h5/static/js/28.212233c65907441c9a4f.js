webpackJsonp([28],{eJPG:function(t,e){},mizu:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("mMon"),i=s("eoeZ"),o=s("uVW5"),n=s("9rMa"),r={data:function(){return{message:"",load_show:!1,notice_show:"",inquisitionList:[],totalPages:0,currentPage:1,getting:!1}},components:{NoticeDialog:a.a,Notice:i.a,Loading:o.a},computed:Object(n.b)({header:function(t){return""===t.header&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.header},userId:function(t){return""===t.userId&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.userId}}),activated:function(){this.$store.commit("changePageType","package-page"),this.getInfo()},methods:{getInfo:function(){this.inquisitionList=[],this.getting=!0,this.getFirstInfo(1)},getFirstInfo:function(t){var e=this;this.load_show=!0;if(this.userId){var s=this.$conf.url+"/internethospital/api/orders/consultations?user-id="+this.userId+"&page-index="+t+"&page-size=10";this.$axios.get(s,{headers:this.$store.state.header}).then(function(s){console.log(s),1===t?e.totalPages=s.data.totalPages:e.totalPages-=1;var a=s.data.content;for(var i in a=a.filter(function(t){return"CANCELED"!==t.statusCode}))a[i].doctorAvatar||a[i].nurseAvatar?(a[i].doctorAvatar&&a[i].doctorAvatar.indexOf("qnfiles")>0&&(a[i].doctorAvatar=a[i].doctorAvatar+"-doctor_list"),a[i].nurseAvatar&&a[i].nurseAvatar.indexOf("qnfiles")>0&&(a[i].nurseAvatar=a[i].nurseAvatar+"-doctor_list")):a[i].doctorAvatar="/static/images/defualt-header.png",a[i].amount&&a[i].amount.toString().indexOf(".")<0?a[i].amount=a[i].amount+".00":a[i].amount&&2!==a[i].amount.toString().slice(a[i].amount.toString().indexOf(".")+1).length&&(a[i].amount=a[i].amount+"0");e.load_show=!1,e.inquisitionList=e.inquisitionList.concat(a),console.log(e.inquisitionList),e.currentPage=t,e.getting=!1})}else this.notice_show="请先完成注册，即将为您跳转到注册页面",setTimeout(function(){e.notice_show="",e.$router.push("/register-login")},2e3)},getMore:function(t){var e=this;if(!this.getting){var s=t.target||t.srcElement,a=this.$refs.listBox.offsetHeight,i=s.scrollTop+document.documentElement.offsetHeight;this.totalPages>0&&i>=a-200?(this.getting=!0,this.getFirstInfo(this.currentPage+1)):0===this.totalPages&&(this.getting=!0,this.notice_show="没有更多了",setTimeout(function(){e.notice_show=""},2e3))}},getToDetail:function(t,e,s){var a=void 0;a="AUTO_COMPLETED"!==t&&"DOCTOR_COMPLETED"!==t||e?"/inquisition/"+s:"/inquisition/evaluate/"+s,this.$router.push(a)}}},u={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"page",on:{scroll:t.getMore}},[0===t.inquisitionList.length?s("div",{staticClass:"emp"},[s("img",{attrs:{src:"static/images/empty-inquisition.png"}}),t._v(" "),s("span",[t._v("你还没有问诊订单")])]):t._e(),t._v(" "),s("ul",{ref:"listBox",staticClass:"section"},t._l(t.inquisitionList,function(e,a){return s("li",{attrs:{"data-type":"item.statusCode","data-evaluate":"item.hasEvaluate","data-id":"item.orderHeaderId"},on:{click:function(s){t.getToDetail(e.statusCode,e.hasEvaluate,e.orderHeaderId)}}},[s("div",{staticClass:"header"},[s("img",{staticClass:"left",attrs:{src:"/static/images/patient.png"}}),t._v(" "),s("span",{staticClass:"left"},[t._v(t._s(e.patientName))]),t._v(" "),s("span",{staticClass:"right"},[t._v(t._s(e.statusText))])]),t._v(" "),s("div",{staticClass:"doctor"},[s("img",{staticClass:"left",attrs:{src:e.doctorAvatar||e.nurseAvatar}}),t._v(" "),s("div",{staticClass:"left"},[s("div",[s("span",{staticClass:"left"},[t._v(t._s(e.doctorName||e.nurseName))]),t._v(" "),e.doctorPositionalTitleText||e.nursePositionalTitleText?s("span",{staticClass:"left"},[t._v(t._s(e.doctorPositionalTitleText||e.nursePositionalTitleText))]):t._e()]),t._v(" "),s("div",[s("span",[t._v(t._s(e.organizationText))]),s("span",[t._v(t._s(e.departmentText))])]),t._v(" "),s("div",[s("span",{staticClass:"left"},[t._v("诊费 ￥"+t._s(e.amount||0))])])])]),t._v(" "),s("button",{staticClass:"right",class:"CREATED"!==e.statusCode&&"DOCTOR_COMPLETED"!==e.statusCode&&"AUTO_COMPLETED"!==e.statusCode||e.hasEvaluate?"":"fun-btn",attrs:{"data-status":"item.statusCode","data-id":"item.orderHeaderId","data-hasevaluate":"item.hasEvaluate"},on:{click:function(s){t.getToDetail(e.statusCode,e.hasEvaluate,e.orderHeaderId)}}},[t._v(t._s("CREATED"===e.statusCode?"去付款":"DOCTOR_COMPLETED"!==e.statusCode&&"AUTO_COMPLETED"!==e.statusCode||e.hasEvaluate?"查看详情":"去评价"))])])})),t._v(" "),s("notice",{directives:[{name:"show",rawName:"v-show",value:t.notice_show,expression:"notice_show"}],attrs:{message:t.notice_show}}),t._v(" "),s("loading",{directives:[{name:"show",rawName:"v-show",value:t.load_show,expression:"load_show"}]})],1)},staticRenderFns:[]};var c=s("C7Lr")(r,u,!1,function(t){s("eJPG")},"data-v-15ed3216",null);e.default=c.exports}});
//# sourceMappingURL=28.212233c65907441c9a4f.js.map