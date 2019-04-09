webpackJsonp([14],{FKVf:function(s,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var e=i("mMon"),a=i("eoeZ"),r=i("uVW5"),n=i("9rMa"),c={name:"detail",components:{NoticeDialog:e.a,Notice:a.a,Loading:r.a},data:function(){return{prescription:null,notice:""}},computed:Object(n.b)({header:function(s){return""===s.header&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),s.header}}),activated:function(){this.getInfo()},methods:{getInfo:function(){this.getPrescription()},getPrescription:function(){var s=this,t=this.$conf.url+"/internethospital/api/orders/prescriptions/"+this.$route.params.id;this.$axios.get(t,{headers:this.header}).then(function(t){s.prescription=t.data}).catch(function(t){s.notice=t.response.data.message,setTimeout(function(){s.notice=""},2e3)})},jumpTo:function(s,t){this.$router.push("/"+s+"/"+t)}}},o={render:function(){var s=this,t=s.$createElement,i=s._self._c||t;return i("div",{staticClass:"page"},[s.prescription?i("p",{staticClass:"effective"},[s._v("本处方2日内效，有效截止日期"+s._s(s.prescription.expireDate))]):s._e(),s._v(" "),s.prescription?i("div",{staticClass:"detail"},[i("div",{staticClass:"title"},[i("span",[s._v(s._s(s.prescription.organizationText))]),s._v(" "),i("span",[s._v("处方笺")]),s._v(" "),i("span",[s._v("NO. "+s._s(s.prescription.orderHeaderNumber))])]),s._v(" "),i("div",{staticClass:"header"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-9"},[i("label",[s._v("姓名：")]),s._v(" "),i("span",[s._v(s._s(s.prescription.patientName))])]),s._v(" "),i("div",{staticClass:"col-9"},[i("label",[s._v("性别：")]),s._v(" "),i("span",[s._v(s._s("MAN"===s.prescription.patientGender?"男":"女"))])]),s._v(" "),i("div",{staticClass:"col-6"},[i("label",[s._v("年龄：")]),s._v(" "),i("span",[s._v(s._s(s.prescription.patientAge))])])]),s._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col-8"},[i("label",[s._v("科室：")]),s._v(" "),i("span",[s._v(s._s(s.prescription.departmentText))])]),s._v(" "),i("div",{staticClass:"col-16"},[i("label",[s._v("开方时间：")]),s._v(" "),i("span",[s._v(s._s(s.prescription.createdDate))])])]),s._v(" "),i("div",{staticClass:"row"},[s._m(0),s._v(" "),i("div",{staticClass:"col-18"},[i("span",[s._v(s._s(s.prescription.diagnosis))])])]),s._v(" "),s.prescription.logistics.shippingAddress?i("div",{staticClass:"row"},[s._m(1),s._v(" "),i("div",{staticClass:"col-18"},[i("span",[s._v(s._s(s.prescription.logistics.shippingAddress))])])]):s._e(),s._v(" "),s.prescription.logistics.expressNumber?i("div",{staticClass:"row"},[s._m(2),s._v(" "),i("div",{staticClass:"col-18"},[i("span",[s._v(s._s(s.prescription.logistics.expressNumber))])])]):s._e()]),s._v(" "),i("ul",{staticClass:"table"},[i("span",{staticClass:"min-title"},[s._v("Rp.")]),s._v(" "),s._l(s.prescription.items,function(t){return i("li",[i("div",[i("span",{staticClass:"left"},[s._v(s._s(t.medicineName))]),s._v(" "),i("span",{staticClass:"right"},[s._v("X"+s._s(t.shippingQuantity)+s._s(t.shippingUnitText))])]),s._v(" "),i("span",[s._v(s._s(t.usageText)+"，"+s._s(t.takeQuantity)+s._s(t.dosageUnitText)+"/次，"+s._s(t.frequencyText))])])})],2),s._v(" "),s.prescription.comment?i("div",{staticClass:"header"},[i("div",{staticClass:"row"},[i("label",[s._v("备注：")]),s._v(" "),i("span",[s._v(s._s(s.prescription.comment))])])]):s._e(),s._v(" "),i("div",{staticClass:"footer row"},[i("div",{staticClass:"col-12"},[i("label",[s._v("医生：")]),s._v(" "),i("img",{attrs:{src:"data:image/png;base64,"+(s.prescription.ywqSignPicture||s.prescription.ywqDoctorSignPicture)}})]),s._v(" "),s.prescription.ywqPharmacistSignPicture?i("div",{staticClass:"col-12"},[i("label",[s._v("药师：")]),s._v(" "),i("img",{attrs:{src:"data:image/png;base64,"+s.prescription.ywqPharmacistSignPicture}})]):s._e()])]):s._e(),s._v(" "),s.prescription&&s.prescription.logistics.shippingAddress?i("div",{staticClass:"site"},[s._m(3),s._v(" "),i("div",{staticClass:"site-14"},[i("span",[s._v("收件人")]),i("span",[s._v(s._s(s.prescription.logistics.contactPerson))])]),s._v(" "),i("div",{staticClass:"site-14"},[i("span",[s._v("联系电话")]),i("span",[s._v(s._s(s.prescription.logistics.contactPhone))])]),s._v(" "),i("div",{staticClass:"site-14"},[i("span",[s._v("配送地址")]),i("span",[s._v(s._s(s.prescription.logistics.shippingAddress))])])]):s._e(),s._v(" "),!s.prescription||"SIGNED"!==s.prescription.statusCode&&"AUDITED"!==s.prescription.statusCode?s._e():i("button",{staticClass:"btn-bottom",on:{click:function(t){s.jumpTo("prescription/payment",s.prescription.orderHeaderId)}}},[s._v("去拿药")]),s._v(" "),s.notice?i("notice",{attrs:{message:s.notice}}):s._e()],1)},staticRenderFns:[function(){var s=this.$createElement,t=this._self._c||s;return t("div",{staticClass:"col-6"},[t("label",[this._v("临床诊断：")])])},function(){var s=this.$createElement,t=this._self._c||s;return t("div",{staticClass:"col-6"},[t("label",[this._v("配送地址：")])])},function(){var s=this.$createElement,t=this._self._c||s;return t("div",{staticClass:"col-6"},[t("label",[this._v("快递单号：")])])},function(){var s=this.$createElement,t=this._self._c||s;return t("div",{staticClass:"site-12"},[t("label",[this._v("配送信息：")])])}]};var p=i("C7Lr")(c,o,!1,function(s){i("b03I")},"data-v-769f7669",null);t.default=p.exports},b03I:function(s,t){}});
//# sourceMappingURL=14.d9aec585374fc449cc38.js.map