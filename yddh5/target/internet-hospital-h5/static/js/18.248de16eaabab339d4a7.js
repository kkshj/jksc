webpackJsonp([18],{"4HeA":function(i,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=t("3cXf"),s=t.n(n),a=t("HzJ8"),o=t.n(a),r=t("mMon"),c=t("eoeZ"),l=t("uVW5"),h=t("9rMa"),d={data:function(){return{message:"",load_show:!1,notice_show:"",recordType:"past",illness:[{id:"1-1",name:"哮喘",chosen:!1},{id:"1-2",name:"肾炎",chosen:!1},{id:"1-3",name:"癫痫",chosen:!1},{id:"1-4",name:"高脂血症",chosen:!1},{id:"1-5",name:"高尿酸血症",chosen:!1},{id:"1-6",name:"高血压",chosen:!1},{id:"1-7",name:"心脏病",chosen:!1},{id:"1-8",name:"脑卒中",chosen:!1},{id:"1-9",name:"糖尿病",chosen:!1}],infectious:[{id:"2-1",name:"肺结核",chosen:!1},{id:"2-2",name:"病毒性肝炎",chosen:!1},{id:"2-3",name:"血吸虫病",chosen:!1},{id:"2-4",name:"淋病",chosen:!1}],operations:[{id:"3-1",name:"骨折",chosen:!1},{id:"3-2",name:"烧伤",chosen:!1},{id:"3-3",name:"烫伤",chosen:!1},{id:"3-4",name:"颅脑手术",chosen:!1},{id:"3-5",name:"颈部手术",chosen:!1},{id:"3-6",name:"胸部手术",chosen:!1},{id:"3-7",name:"腹部手术",chosen:!1},{id:"3-8",name:"背部手术",chosen:!1},{id:"3-9",name:"四只手术",chosen:!1},{id:"3-10",name:"头部外伤",chosen:!1},{id:"3-11",name:"肌腱损伤",chosen:!1},{id:"3-12",name:"刀刺伤",chosen:!1},{id:"3-13",name:"刀砍伤",chosen:!1},{id:"3-14",name:"皮肤软组织损伤",chosen:!1}],marriages:[{id:"4-1",name:"已婚",chosen:!1},{id:"4-2",name:"未婚",chosen:!1}],birth:[{id:"5-1",name:"未生育",chosen:!1},{id:"5-2",name:"备孕期",chosen:!1},{id:"5-3",name:"怀孕期",chosen:!1},{id:"5-4",name:"已生育",chosen:!1}],family:[{id:"6-1",name:"高血压",chosen:!1},{id:"6-2",name:"糖尿病",chosen:!1},{id:"6-3",name:"心脏病",chosen:!1},{id:"6-4",name:"脑梗",chosen:!1},{id:"6-5",name:"脑出血",chosen:!1},{id:"6-6",name:"癌症",chosen:!1},{id:"6-7",name:"过敏性疾病",chosen:!1},{id:"6-8",name:"哮喘",chosen:!1},{id:"6-9",name:"癫痫病",chosen:!1},{id:"6-10",name:"白癜风",chosen:!1},{id:"6-11",name:"近视",chosen:!1}],drugs:[{id:"7-1",name:"青霉素",chosen:!1},{id:"7-2",name:"头孢类抗生素",chosen:!1},{id:"7-3",name:"破伤风抗毒素",chosen:!1},{id:"7-4",name:"普鲁卡因",chosen:!1},{id:"7-5",name:"地卡因",chosen:!1},{id:"7-6",name:"磺胺类药物",chosen:!1},{id:"7-7",name:"维生素B1",chosen:!1},{id:"7-8",name:"泛影葡胺",chosen:!1},{id:"7-9",name:"阿司匹林",chosen:!1}],foods:[{id:"8-1",name:"芒果",chosen:!1},{id:"8-2",name:"牛奶",chosen:!1},{id:"8-3",name:"海鲜",chosen:!1},{id:"8-4",name:"笋",chosen:!1},{id:"8-5",name:"香菇",chosen:!1},{id:"8-6",name:"黄瓜",chosen:!1},{id:"8-7",name:"花粉",chosen:!1},{id:"8-8",name:"油漆",chosen:!1},{id:"8-9",name:"皮毛",chosen:!1},{id:"8-10",name:"化妆品",chosen:!1}],habit:[{id:"9-1",name:"吸烟",chosen:!1},{id:"9-2",name:"饮酒",chosen:!1},{id:"9-3",name:"熬夜",chosen:!1},{id:"9-4",name:"低头",chosen:!1},{id:"9-5",name:"久坐",chosen:!1},{id:"9-6",name:"久站",chosen:!1},{id:"9-7",name:"跷二郎腿",chosen:!1},{id:"9-8",name:"强忍大小便",chosen:!1},{id:"9-9",name:"饭后卧床",chosen:!1},{id:"9-10",name:"如厕看书报",chosen:!1},{id:"9-11",name:"不喜喝水",chosen:!1}],presentHistory:"",obstericalHistory:"",familyHistory:"",allergicHistory:"",personalHabit:""}},components:{NoticeDialog:r.a,Notice:c.a,Loading:l.a},computed:Object(h.b)({questing:function(i){return""===i.questing&&JSON.parse(localStorage.getItem("questing"))&&this.$store.commit("setQuesting",JSON.parse(localStorage.getItem("questing"))),i.questing}}),activated:function(){this.$store.commit("changePageType","package-page");var i=this.$route.query;console.log(i),this.getInfo(i)},methods:{getInfo:function(i){this.getFirstInfo(i)},choseThis:function(i){if(console.log(i),this.illness.find(function(e){return e.id===i})){for(var e in this.illness)this.illness[e].id===i&&(this.illness[e].chosen?this.illness[e].chosen=!1:this.illness[e].chosen=!0);this.illness=this.illness}else if(this.infectious.find(function(e){return e.id===i})){for(var t in this.infectious)this.infectious[t].id===i&&(this.infectious[t].chosen?this.infectious[t].chosen=!1:this.infectious[t].chosen=!0);this.infectious=this.infectious}else if(this.operations.find(function(e){return e.id===i}))for(var n in this.operations)this.operations[n].id===i&&(this.operations[n].chosen?this.operations[n].chosen=!1:this.operations[n].chosen=!0);else if(this.marriages.find(function(e){return e.id===i}))for(var s in this.marriages)this.marriages[s].id===i?this.marriages[s].chosen?this.marriages[s].chosen=!1:this.marriages[s].chosen=!0:this.marriages[s].chosen=!1;else if(this.birth.find(function(e){return e.id===i}))for(var a in this.birth)this.birth[a].id===i?this.birth[a].chosen?this.birth[a].chosen=!1:this.birth[a].chosen=!0:this.birth[a].chosen=!1,this.birtthis.birth;else if(this.family.find(function(e){return e.id===i}))for(var o in this.family)this.family[o].id===i&&(this.family[o].chosen?this.family[o].chosen=!1:this.family[o].chosen=!0);else if(this.drugs.find(function(e){return e.id===i}))for(var r in this.drugs)this.drugs[r].id===i&&(this.drugs[r].chosen?this.drugs[r].chosen=!1:this.drugs[r].chosen=!0);else if(this.foods.find(function(e){return e.id===i}))for(var c in this.foods)this.foods[c].id===i&&(this.foods[c].chosen?this.foods[c].chosen=!1:this.foods[c].chosen=!0);else if(this.habit.find(function(e){return e.id===i}))for(var l in this.habit)this.habit[l].id===i&&(this.habit[l].chosen?this.habit[l].chosen=!1:this.habit[l].chosen=!0)},changeRecord:function(i){this.recordType=i},getFirstInfo:function(i){var e=this,t=i.presentHistory.split(","),n=i.obstericalHistory.split(","),s=i.familyHistory.split(","),a=i.allergicHistory.split(","),r=i.personalHabit.split(","),c=function(i){if(e.illness.find(function(e){return e.name===i}))for(var t in e.illness)e.illness[t].name===i&&(e.illness[t].chosen=!0);else if(e.infectious.find(function(e){return e.name===i}))for(var n in e.infectious)e.infectious[n].name===i&&(e.infectious[n].chosen=!0);else if(e.operations.find(function(e){return e.name===i}))for(var s in e.operations)e.operations[s].name===i&&(e.operations[s].chosen=!0);else e.presentHistory=i},l=!0,h=!1,d=void 0;try{for(var f,u=o()(t);!(l=(f=u.next()).done);l=!0){c(f.value)}}catch(i){h=!0,d=i}finally{try{!l&&u.return&&u.return()}finally{if(h)throw d}}var m=function(i){if(e.marriages.find(function(e){return e.name===i}))for(var t in e.marriages)e.marriages[t].name===i&&(e.marriages[t].chosen=!0);else if(e.birth.find(function(e){return e.name===i}))for(var n in e.birth)e.birth[n].name===i&&(e.birth[n].chosen=!0);else e.obstericalHistory=i},v=!0,y=!1,p=void 0;try{for(var g,_=o()(n);!(v=(g=_.next()).done);v=!0){m(g.value)}}catch(i){y=!0,p=i}finally{try{!v&&_.return&&_.return()}finally{if(y)throw p}}var b=function(i){if(e.family.find(function(e){return e.name===i}))for(var t in e.family)e.family[t].name===i&&(e.family[t].chosen=!0);else e.familyHistory=i},H=!0,x=!1,C=void 0;try{for(var k,w=o()(s);!(H=(k=w.next()).done);H=!0){b(k.value)}}catch(i){x=!0,C=i}finally{try{!H&&w.return&&w.return()}finally{if(x)throw C}}var T=function(i){if(e.drugs.find(function(e){return e.name===i}))for(var t in e.drugs)e.drugs[t].name===i&&(e.drugs[t].chosen=!0);else if(e.foods.find(function(e){return e.name===i}))for(var n in e.foods)e.foods[n].name===i&&(e.foods[n].chosen=!0);else e.allergicHistory=i},I=!0,N=!1,S=void 0;try{for(var P,R=o()(a);!(I=(P=R.next()).done);I=!0){T(P.value)}}catch(i){N=!0,S=i}finally{try{!I&&R.return&&R.return()}finally{if(N)throw S}}var q=function(i){if(e.habit.find(function(e){return e.name===i}))for(var t in e.habit)e.habit[t].name===i&&(e.habit[t].chosen=!0);else e.personalHabit=i},L=!0,J=!1,O=void 0;try{for(var $,F=o()(r);!(L=($=F.next()).done);L=!0){q($.value)}}catch(i){J=!0,O=i}finally{try{!L&&F.return&&F.return()}finally{if(J)throw O}}},beforeDestroy:function(){var i=[],e=[],t=[],n=[],a=[];if(this.illness.find(function(i){return i.chosen})){i=i.concat(this.illness.filter(function(i){if(i.chosen)return i.name})),this.infectious.find(function(i){return i.chosen})&&(i=i.concat(this.infectious.filter(function(i){if(i.chosen)return i.name}))),this.operations.find(function(i){return i.chosen})&&(i=i.concat(this.operations.filter(function(i){if(i.chosen)return i.name}))),this.marriages.find(function(i){return i.chosen})&&(e=e.concat(this.marriages.filter(function(i){if(i.chosen)return i.name}))),this.data.birth.find(function(i){return i.chosen})&&(e=e.concat(this.birth.filter(function(i){if(i.chosen)return i.name}))),this.family.find(function(i){return i.chosen})&&(t=t.concat(this.family.filter(function(i){if(i.chosen)return i.name}))),this.drugs.find(function(i){return i.chosen})&&(n=n.concat(this.drugs.filter(function(i){if(i.chosen)return i.name}))),this.foods.find(function(i){return i.chosen})&&(n=n.concat(this.foods.filter(function(i){if(i.chosen)return i.name}))),this.habit.find(function(i){return i.chosen})&&(a=a.concat(this.habit.filter(function(i){if(i.chosen)return i.name})));var r=this.presentHistory?[this.presentHistory]:[],c=!0,l=!1,h=void 0;try{for(var d,f=o()(i);!(c=(d=f.next()).done);c=!0){var u=d.value;console.log(u),r.push(u.name)}}catch(i){l=!0,h=i}finally{try{!c&&f.return&&f.return()}finally{if(l)throw h}}console.log(r),localStorage.setItem("presentHistory",s()(r));var m=this.obstericalHistory?[this.obstericalHistory]:[],v=!0,y=!1,p=void 0;try{for(var g,_=o()(e);!(v=(g=_.next()).done);v=!0){var b=g.value;m.push(b.name)}}catch(i){y=!0,p=i}finally{try{!v&&_.return&&_.return()}finally{if(y)throw p}}localStorage.setItem("obstericalHistory",s()(m));var H=this.familyHistory?[this.familyHistory]:[],x=!0,C=!1,k=void 0;try{for(var w,T=o()(t);!(x=(w=T.next()).done);x=!0){var I=w.value;H.push(I.name)}}catch(i){C=!0,k=i}finally{try{!x&&T.return&&T.return()}finally{if(C)throw k}}localStorage.setItem("familyHistory",s()(H));var N=this.allergicHistory?[this.allergicHistory]:[],S=!0,P=!1,R=void 0;try{for(var q,L=o()(n);!(S=(q=L.next()).done);S=!0){var J=q.value;N.push(J.name)}}catch(i){P=!0,R=i}finally{try{!S&&L.return&&L.return()}finally{if(P)throw R}}localStorage.setItem("allergicHistory",s()(N));var O=this.personalHabit?[this.personalHabit]:[],$=!0,F=!1,M=void 0;try{for(var j,D=o()(a);!($=(j=D.next()).done);$=!0){var z=j.value;O.push(z.name)}}catch(i){F=!0,M=i}finally{try{!$&&D.return&&D.return()}finally{if(F)throw M}}localStorage.setItem("personalHabit",s()(O))}}}},f={render:function(){var i=this,e=i.$createElement,t=i._self._c||e;return t("div",{staticClass:"page"},[t("div",{staticClass:"btn-box"},[t("button",{class:"past"===i.recordType?"chosen":"",attrs:{"data-type":"past"},on:{click:function(e){i.changeRecord("past")}}},[i._v("既往史"),t("i")]),i._v(" "),t("button",{class:"marriage"===i.recordType?"chosen":"",attrs:{"data-type":"marriage"},on:{click:function(e){i.changeRecord("marriage")}}},[i._v("婚育史"),t("i")]),i._v(" "),t("button",{class:"family"===i.recordType?"chosen":"",attrs:{"data-type":"family"},on:{click:function(e){i.changeRecord("family")}}},[i._v("家族史"),t("i")]),i._v(" "),t("button",{class:"allergy"===i.recordType?"chosen":"",attrs:{"data-type":"allergy"},on:{click:function(e){i.changeRecord("allergy")}}},[i._v("过敏史"),t("i")]),i._v(" "),t("button",{class:"habit"===i.recordType?"chosen":"",attrs:{"data-type":"habit"},on:{click:function(e){i.changeRecord("habit")}}},[i._v("个人习惯"),t("i")])]),i._v(" "),"past"===i.recordType?t("div",[t("span",{staticClass:"title"},[i._v("疾病史")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.illness,function(e,n){return t("li",{key:e.id,staticClass:"left ",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("传染病")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.infectious,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("手术使")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.operations,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("补充说明")]),i._v(" "),t("div",{staticClass:"input-box"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:i.presentHistory,expression:"presentHistory"}],attrs:{placeholder:"如果没有找到适合您的信息，请在此补充说明...",type:"text"},domProps:{value:i.presentHistory},on:{input:function(e){e.target.composing||(i.presentHistory=e.target.value)}}})])]):i._e(),i._v(" "),"marriage"===i.recordType?t("div",[t("span",{staticClass:"title"},[i._v("婚姻状况")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.marriages,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("生育状态")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.birth,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("补充说明")]),i._v(" "),t("div",{staticClass:"input-box"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:i.obstericalHistory,expression:"obstericalHistory"}],attrs:{placeholder:"如果没有找到适合您的信息，请在此补充说明...",type:"text"},domProps:{value:i.obstericalHistory},on:{input:function(e){e.target.composing||(i.obstericalHistory=e.target.value)}}})])]):i._e(),i._v(" "),"family"===i.recordType?t("div",[t("span",{staticClass:"title"},[i._v("家族史（父母、兄弟姐妹）")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.family,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("补充说明")]),i._v(" "),t("div",{staticClass:"input-box"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:i.familyHistory,expression:"familyHistory"}],attrs:{placeholder:"如果没有找到适合您的信息，请在此补充说明...",type:"text"},domProps:{value:i.familyHistory},on:{input:function(e){e.target.composing||(i.familyHistory=e.target.value)}}})])]):i._e(),i._v(" "),"allergy"===i.recordType?t("div",[t("span",{staticClass:"title"},[i._v("过敏药物")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.drugs,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("食物过敏")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.foods,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("补充说明")]),i._v(" "),t("div",{staticClass:"input-box"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:i.allergicHistory,expression:"allergicHistory"}],attrs:{placeholder:"如果没有找到适合您的信息，请在此补充说明...",type:"text"},domProps:{value:i.allergicHistory},on:{input:function(e){e.target.composing||(i.allergicHistory=e.target.value)}}})])]):i._e(),i._v(" "),"habit"===i.recordType?t("div",[t("span",{staticClass:"title"},[i._v("个人习惯")]),i._v(" "),t("div",{staticClass:"mark-box"},i._l(i.habit,function(e,n){return t("li",{key:e.id,staticClass:"left",class:e.chosen?"chosen":"",attrs:{"data-id":e.id},on:{click:function(t){i.choseThis(e.id)}}},[i._v(i._s(e.name))])})),i._v(" "),t("span",{staticClass:"title"},[i._v("补充说明")]),i._v(" "),t("div",{staticClass:"input-box"},[t("textarea",{directives:[{name:"model",rawName:"v-model",value:i.personalHabit,expression:"personalHabit"}],attrs:{placeholder:"如果没有找到适合您的信息，请在此补充说明...",type:"text"},domProps:{value:i.personalHabit},on:{input:function(e){e.target.composing||(i.personalHabit=e.target.value)}}})])]):i._e(),i._v(" "),t("notice",{directives:[{name:"show",rawName:"v-show",value:i.notice_show,expression:"notice_show"}],attrs:{message:i.notice_show}}),i._v(" "),t("loading",{directives:[{name:"show",rawName:"v-show",value:i.load_show,expression:"load_show"}]})],1)},staticRenderFns:[]};var u=t("C7Lr")(d,f,!1,function(i){t("9LLl")},"data-v-6a6da290",null);e.default=u.exports},"9LLl":function(i,e){}});
//# sourceMappingURL=18.248de16eaabab339d4a7.js.map