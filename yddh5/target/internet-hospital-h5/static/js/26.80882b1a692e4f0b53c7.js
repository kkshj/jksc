webpackJsonp([26],{CDjs:function(t,e){},yqOf:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=s("HzJ8"),i=s.n(o),n=s("mMon"),a=s("eoeZ"),r=s("uVW5"),c=s("9rMa"),h={name:"doctor",data:function(){return{message:"",load_show:!1,notice_show:"",searchType:"",docList:[],firstDepartment:[],firstChosen:null,secondDepartment:[],secondChosen:null,hospitalList:[],hospitalChosen:null,sortType:"CONSULTATION_QUANTITY",showType:"",pages:1,hadMore:!1,hospitalPort:!1,standDepartment:!1,colr:{co:"",chos:"chosen",chang:"changed"}}},components:{NoticeDialog:n.a,Notice:a.a,Loading:r.a},computed:Object(c.b)({hospitalPorts:function(t){return""===t.hospitalPort&&JSON.parse(localStorage.getItem("hospitalInfo"))&&this.$store.commit("setHospital",JSON.parse(localStorage.getItem("hospitalInfo"))),t.hospitalPort},hospitalId:function(t){return""===t.hospitalId&&JSON.parse(localStorage.getItem("hospitalInfo"))&&this.$store.commit("setHospital",JSON.parse(localStorage.getItem("hospitalInfo"))),t.hospitalId}}),beforeRouteLeave:function(t,e,s){"/home"==t.path&&this.$destroy(),s()},activated:function(){var t=this.$route.query;this.hadMore=!0,this.getInfo(t)},methods:{getInfo:function(t){this.hospitalList=[],this.pages=1,this.getLaodInfo(t)},getLaodInfo:function(t){var e=this,s=this;if("department"===t.type&&"another"===t.departmentId){var o=t.type;return s.quickSearch(o),void s.getFirstInfo("refresh")}if("department"===t.type){var i=this.$conf.url+"/internethospital/api/departments/"+t.departmentId;console.log(t),this.standDepartment=!0,this.$axios.get(i,{headers:this.$store.state.header}).then(function(t){if(console.log(t),t.statusCode>=200&&t.statusCode<=399)return s.secondChosen=t.data,void s.getFirstInfo("refresh");e.notice_show="链接出错，请检查网络链接",setTimeout(function(){e.notice_show="",s.searchType=""},2e3)}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})}"department"!==t.type&&(this.showType=t.type,console.log(this.showType),this.getFirstInfo("refresh"))},getFirstInfo:function(t){var e=this;this.load_show=!0;var s=this;this.hospitalPorts&&(this.hospitalPort=!0);var o=this.$conf.url+"/internethospital/api/nurses?page-index="+this.pages+"&page-size=10";o=(o="CONSULT_FREE"===this.showType?o+"&product-code=CONSULT_FREE":o+"&product-code=CONSULT&product-code=CONSULT_FREE")+"&sort-method="+this.sortType,this.hospitalPorts&&(o=o+"&organization-id="+this.hospitalId),this.hospitalChosen&&"default"!==this.hospitalChosen.id&&(o=o+"&organization-id="+this.hospitalChosen.id),this.secondChosen&&"default"!==this.secondChosen.id&&(o=this.secondChosen.parentId?this.hospitalPorts&&!this.standDepartment?o+"&department-id="+this.secondChosen.id:o+"&standard-department-id="+this.secondChosen.id:this.hospitalPorts&&!this.standDepartment?o+"&parent-department-id="+this.secondChosen.id:o+"&parent-standard-department-id="+this.secondChosen.id),this.$axios.get(o,{headers:this.$store.state.header}).then(function(o){console.log(o),1===e.pages?e.totalPages=o.data.totalPages:e.totalPages-=1;var n=o.data.content;for(var a in n=n.filter(function(t){return t.services.length>0})){var r=n[a].services.indexOf(n[a].services.find(function(t){return"CONSULT"===t.code}));r>0&&(n[a].services[0]=[n[a].services[r],n[a].services[r]=n[a].services[0]][0]),n[a].doctorAvatar?n[a].doctorAvatar=n[a].doctorAvatar+"-doctor_list":n[a].doctorAvatar="static/images/defualt-header.png",n[a].services.find(function(t){return"CONSULT_FREE"===t.code})&&(n[a].volunteers=n[a].services.find(function(t){return"CONSULT_FREE"===t.code}).inventoryQuantity),n[a].services[0]&&n[a].services[0].price.toString().indexOf(".")<0?n[a].services[0].price=n[a].services[0].price+".00":n[a].services[0]&&2!==n[a].services[0].price.toString().slice(n[a].services[0].price.toString().indexOf(".")+1).length&&(n[a].services[0].price=n[a].services[0].price+"0"),n[a].text=n[a].text.length<35?n[a].text:n[a].text.slice(0,36)+"...";var c=n[a].statistics.filter(function(t){return"CONSULTATION"===t.scene&&null==t.orderTypeId}),h=0,d=!0,l=!1,p=void 0;try{for(var u,f=i()(c);!(d=(u=f.next()).done);d=!0){h+=u.value.quantity}}catch(t){l=!0,p=t}finally{try{!d&&f.return&&f.return()}finally{if(l)throw p}}n[a].customerCount=h}return console.log(n),e.load_show=!1,"refresh"===t?(s.docList=n,void(e.hadMore=!1)):"more"===t?(0===(n=s.docList.concat(n)).length&&(e.notice_show="没有更多了",setTimeout(function(){e.notice_show=""},2e3),e.hadMore=!1),e.hadMore=!1,void(e.docList=n)):void 0}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})},getMore:function(t){var e=this,s=t.target||t.srcElement,o=this.$refs.secList.offsetHeight,i=document.documentElement.offsetHeight;if(console.log(this.hadMore),!this.hadMore)if(this.totalPages>0&&i+s.scrollTop>=o-200){var n=this.pages+1;this.pages=n,this.hadMore=!0,this.getFirstInfo("more")}else 0==this.totalPages&&(this.notice_show="没有更多了",this.hadMore=!0,setTimeout(function(){e.notice_show=""},2e3))},quickSearch:function(t){var e=this;console.log(t);var s=this,o=t;if(this.standDepartment=!1,o===this.searchType)this.searchType="";else{if("hospital"===o){var i=this.$conf.url+"/internethospital/api/organizations?page-index=1&page-size=10000";this.$axios.get(i).then(function(t){if(console.log(t),t.status>=200&&t.status<=399){var o=t.data.content;t.data.content.unshift({id:"default",logoUrl:"static/images/default-hospital.png",text:"所有医院"}),s.hospitalList=o}else e.notice_show="获取医院列表失败，请稍后再试",setTimeout(function(){e.notice_show="",s.searchType=""},2e3)}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})}else if("department"===o){var n=this.$conf.url+"/internethospital/api/departments?page-index=1&page-size=1000&show-all=true&stand-department=true";this.hospitalPorts&&(n=this.$conf.url+"/internethospital/api/departments?page-index=1&page-size=1000&show-all=true&organization-id="+this.hospitalId),this.$axios.get(n,{headers:this.$store.state.header}).then(function(t){var o={id:"default",text:"默认"};t.data.content.unshift(o),s.firstDepartment=t.data.content;var i=void 0;if(s.secondChosen){var n=void 0;if(s.secondChosen.parentId){s.$conf.url,s.secondChosen.parentId;n=t.data.content.find(function(t){return t.id===s.secondChosen.parentId})}else i=s.$conf.url+"/internethospital/api/departments?page-index=1&page-size=1000&parent-id="+s.secondChosen.id,n=t.data.content.find(function(t){return t.id===s.secondChosen.id});s.firstChosen=n,e.$axios.get(i,{headers:e.$store.state.header}).then(function(t){resp.status>=200&&resp.status<=399&&("default"!==s.firstChosen.id&&(s.firstChosen.text=s.firstChosen.text.indexOf("（全部）")>0?s.firstChosen.text:s.firstChosen.text+"（全部）"),resp.data.content.unshift(s.firstChosen),s.secondDepartment=resp.data.content,s.secondChosen&&(s.secondChosen=s.secondChosen))}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})}else{s.firstChosen=t.data.content[0];var a=[];a.push(o),s.secondDepartment=a}}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})}s.searchType=o}},chooseFirstD:function(t){var e=this;console.log(t);var s=this,o=this.$conf.url+"/internethospital/api/departments?page-index=1&page-size=1000&parent-id="+t,i=this.firstDepartment.find(function(e){return e.id===t});this.firstChosen=i,this.$axios.get(o).then(function(t){"default"!==s.firstChosen.id&&(i.text=i.text.indexOf("（全部）")>0?i.text:i.text+"（全部）"),t.data.content.unshift(i),e.secondDepartment=t.data.content}).catch(function(t){e.notice_show=t.response.data.message,setTimeout(function(){e.notice_show=""},2e3)})},chooseSecondD:function(t){var e=this;console.log(t);var s=this.secondDepartment.find(function(e){return e.id===t});"default"!==s.id?this.secondChosen=s:this.secondChosen="",this.pages=1,this.getFirstInfo("refresh"),setTimeout(function(){e.searchType=""},300)},chooseHospital:function(t){var e=this;console.log(t);var s=this.hospitalList.find(function(e){return e.id===t});s.text=s.text.length<=6?s.text:s.text.slice(0,5)+"...","default"!==s.id?this.hospitalChosen=s:this.hospitalChosen="",this.pages=1,this.getFirstInfo("refresh"),setTimeout(function(){e.searchType=""},300)},sortList:function(t){var e=this,s=t;this.showType=s,this.pages=1,this.getFirstInfo("refresh"),setTimeout(function(){e.searchType=""},300)},cancelSearch:function(t){console.log(t),t.target.dataset.id||(console.log(44),this.searchType="",this.$store.commit("changePageType","package-page"))},jumpTo:function(t){this.$store.commit("changePageType","package-page"),this.$router.push("/nurse/"+t)}}},d={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"page",on:{scroll:t.getMore}},[t._m(0),t._v(" "),s("div",{staticClass:"screen"},[t.hospitalPort?t._e():s("div",{attrs:{"data-name":"hospital"},on:{click:function(e){t.quickSearch("hospital")}}},[s("span",{class:["hospital"===t.searchType?t.colr.chos:t.colr.co,t.hospitalChosen?t.colr.chang:t.colr.co]},[t._v(t._s(t.hospitalChosen?t.hospitalChosen.text:"医院"))])]),t._v(" "),s("div",{attrs:{"data-name":"department"},on:{click:function(e){t.quickSearch("department")}}},[s("span",{class:["department"===t.searchType?t.colr.chos:t.colr.co,t.secondChosen?t.colr.chang:t.colr.co]},[t._v(t._s(t.secondChosen?t.secondChosen.text:"科室"))])]),t._v(" "),s("div",{class:t.searchType?t.colr.chang:t.colr.co,attrs:{"data-name":"automaticSort"},on:{click:function(e){t.quickSearch("automaticSort")}}},[s("span",{class:["automaticSort"===t.searchType?t.colr.chos:t.colr.co]},[t._v("排序")])])]),t._v(" "),"department"==t.searchType?s("div",{staticClass:"quickSearchBoard department",on:{click:t.cancelSearch}},[s("div",[s("ul",{staticClass:"left first"},t._l(t.firstDepartment,function(e,o){return s("li",{class:t.firstChosen.id===e.id?t.colr.chos:t.colr.co,attrs:{"data-id":e.id},on:{click:function(s){t.chooseFirstD(e.id)}}},[t._v(t._s(e.text))])})),t._v(" "),s("ul",{staticClass:"right second"},t._l(t.secondDepartment,function(e,o){return s("li",{class:t.secondChosen&&t.secondChosen.id===e.id?t.colr.chos:t.colr.co,attrs:{"data-id":e.id},on:{click:function(s){t.chooseSecondD(e.id)}}},[t._v(t._s(e.text))])}))])]):t._e(),t._v(" "),"hospital"===t.searchType?s("div",{staticClass:"quickSearchBoard hospital",on:{click:t.cancelSearch}},[s("div",t._l(t.hospitalList,function(e,o){return s("li",{class:t.hospitalChosen&&t.hospitalChosen.id===e.id?t.colr.chos:t.colr.co,attrs:{"data-id":e.id},on:{click:function(s){t.chooseHospital(e.id)}}},[s("img",{staticClass:"left",attrs:{src:e.logoUrl}}),t._v(" "),s("span",{staticClass:"left"},[t._v(t._s(e.text))]),t._v(" "),e.label?s("small",{staticClass:"left"},[t._v(t._s(e.label))]):t._e()])}))]):t._e(),t._v(" "),"automaticSort"===t.searchType?s("div",{staticClass:"quickSearchBoard automaticSort",on:{click:t.cancelSearch}},[s("div",[s("li",{class:["CONSULT"==t.showType?t.colr.chos:t.colr.co],attrs:{"data-type":"CONSULT"},on:{click:function(e){t.sortList("CONSULT")}}},[t._v("推荐排序")])])]):t._e(),t._v(" "),0===t.docList.length?s("div",{staticClass:"emp"},[s("img",{attrs:{src:"/static/images/empty-doctor.png"}}),t._v(" "),s("span",[t._v("没有匹配到符合该条件的医生")])]):t._e(),t._v(" "),t.docList.length>0?s("div",{ref:"secList",staticClass:"section"},[s("div",{staticClass:"doctor"},[s("ul",t._l(t.docList,function(e,o){return"CONSULT_FREE"!==t.showType||e.volunteers>0?s("li",{key:e.nurseId,attrs:{"data-code":e.code},on:{click:function(s){t.jumpTo(e.nurseId)}}},[s("img",{staticClass:"left",attrs:{src:e.doctorAvatar}}),t._v(" "),s("div",{staticClass:"left"},[s("div",[s("span",{staticClass:"left"},[t._v(t._s(e.nurseName))]),t._v(" "),s("span",{staticClass:"left"},[t._v(t._s(e.positionalTitleText?e.positionalTitleText:e.standPositionalTitleText))]),t._v(" "),s("div",{staticClass:"left"},t._l(e.labels,function(e,o){return o<2?s("small",{staticStyle:{'tag.colour ?"background-color':'"+ tag.colour : "color: #333333"'}},[t._v(t._s(e.text))]):t._e()})),t._v(" "),e.volunteers?s("span",{staticClass:"right"},[t._v("义诊"+t._s(e.volunteers))]):t._e()]),t._v(" "),s("div",[s("span",[t._v(t._s(e.organizationText))]),s("span",[t._v(t._s(e.departmentText))])]),t._v(" "),s("div",[s("span",[t._v(t._s(e.text))])]),t._v(" "),s("div",[s("span",{staticClass:"left"},[t._v("￥"+t._s(e.services[0].price)+"/次")]),s("span",{staticClass:"right"},[t._v(t._s(e.customerCount)+"人已问诊")])])])]):t._e()}))])]):t._e(),t._v(" "),s("notice",{directives:[{name:"show",rawName:"v-show",value:t.notice_show,expression:"notice_show"}],attrs:{message:t.notice_show}}),t._v(" "),s("loading",{directives:[{name:"show",rawName:"v-show",value:t.load_show,expression:"load_show"}]})],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"search-bar"},[e("img",{staticClass:"search-img",attrs:{src:"static/images/nurse-top.png"}})])}]};var l=s("C7Lr")(h,d,!1,function(t){s("CDjs")},"data-v-20357aa8",null);e.default=l.exports}});
//# sourceMappingURL=26.80882b1a692e4f0b53c7.js.map