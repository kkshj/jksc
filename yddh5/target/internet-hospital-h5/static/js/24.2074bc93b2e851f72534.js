webpackJsonp([24],{g6No:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("mMon"),s=a("eoeZ"),o=a("uVW5"),n=a("9rMa"),c={data:function(){return{message:"",load_show:!1,notice_show:"",cardList:[],id:"",cardId:"",notice:!0}},components:{NoticeDialog:i.a,Notice:s.a,Loading:o.a},computed:Object(n.b)({header:function(t){return""===t.header&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.header}}),activated:function(){this.$store.commit("changePageType","package-page");var t=this.$route.params;this.getInfo(t)},methods:{getInfo:function(t){this.id=t.id,this.getFirstInfo(t.id)},getFirstInfo:function(t){var e=this,a=this.$conf.url+"/internethospital/api/patients/"+t+"/medical-cards";this.$axios.get(a,{headers:this.$store.state.header}).then(function(t){for(var a in console.log(t),t.data){for(var i=[],s=0;s<t.data[a].cardNumber.length;s+=4)console.log(t.data[a].cardNumber.slice(s,s+4)),i.push(t.data[a].cardNumber.slice(s,s+4));t.data[a].cardNumber=i.join(" ")}e.cardList=t.data})},addNew:function(){var t="/patient/card/create/"+this.id;this.$router.push(t)},confirmDelete:function(t){this.notice=!0,this.cardId=t},dontDo:function(){this.notice=!1},deleteCard:function(t){var e=this,a=this,i=this.$conf.url+"/internethospital/api/patients/"+this.id+"/medical-cards/"+this.cardId;this.$axios.delete(i,{Authorization:"Bearer "+this.token}).then(function(t){console.log(t),e.notice=!1,e.notice_show="删除成功！",setTimeout(function(){e.notice_show="",a.getFirstInfo(a.id)},2e3)})}}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"page"},[0===t.cardList.length?a("div",{staticClass:"addCard",on:{click:t.addNew}},[t._v("\n      添加本人就诊卡\n    ")]):t._e(),t._v(" "),t.cardList.length>0?a("div",{staticClass:"title"},[a("span",{staticClass:"left"},[t._v("医疗就诊卡")]),t._v(" "),a("span",{staticClass:"right",on:{click:t.addNew}},[t._v("添加")])]):t._e(),t._v(" "),t._l(t.cardList,function(e,i){return a("div",{key:e.id,staticClass:"card"},[a("div",[a("img",{staticClass:"left",attrs:{src:e.hospitalLogoUrl}}),t._v(" "),a("span",{staticClass:"left"},[t._v(t._s(e.hospitalText))]),t._v(" "),a("i",{staticClass:"right"},[t._v(t._s(e.cardType))])]),t._v(" "),a("span",[t._v(t._s(e.cardNumber))])])}),t._v(" "),a("div",{staticClass:"bottom"}),t._v(" "),a("notice",{directives:[{name:"show",rawName:"v-show",value:t.notice_show,expression:"notice_show"}],attrs:{message:t.notice_show}}),t._v(" "),a("loading",{directives:[{name:"show",rawName:"v-show",value:t.load_show,expression:"load_show"}]})],2)},staticRenderFns:[]};var d=a("C7Lr")(c,r,!1,function(t){a("nL0c")},"data-v-3d9b2fac",null);e.default=d.exports},nL0c:function(t,e){}});
//# sourceMappingURL=24.2074bc93b2e851f72534.js.map