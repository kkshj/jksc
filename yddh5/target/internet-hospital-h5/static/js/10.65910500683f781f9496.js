webpackJsonp([10],{"j+lG":function(t,e){},pB6j:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("mMon"),n=s("eoeZ"),a=s("uVW5"),o=s("9rMa"),d={name:"list",components:{NoticeDialog:i.a,Notice:n.a,Loading:a.a},computed:Object(o.b)({userId:function(t){return""===t.userId&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.userId},header:function(t){return""===t.header&&this.$store.commit("setUser",JSON.parse(localStorage.getItem("loginInfo"))),t.header}}),data:function(){return{addressList:[],choseAdd:!1,notice:"",deleteId:""}},activated:function(){this.getInfo(),"choose"===this.$route.query.type&&(this.choseAdd=!0)},beforeRouteLeave:function(t,e,s){this.$destroy(),s()},methods:{getInfo:function(){this.getAddresses()},getAddresses:function(){var t=this,e=this.$conf.url+"/internethospital/api/user/"+this.userId+"/shipping-addresses";this.$axios.get(e,{headers:this.header}).then(function(e){for(var s in console.log(e),e.data)e.data[s].address=e.data[s].address.replace("|","");t.addressList=e.data}).catch(function(e){t.notice=e.response.data.message,setTimeout(function(){t.notice=""},2e3)})},toDefault:function(t){var e=this,s=this.addressList.find(function(e){return e.id===t});if(!s.defaultAddress){var i=this.$conf.url+"/internethospital/api/user/"+this.userId+"/shipping-addresses/"+t;s.defaultAddress=!0,delete s.id,this.$axios.put(i,s,{headers:this.header}).then(function(t){e.notice="设置成功",setTimeout(function(){e.notice="",e.getInfo()},2e3)}).catch(function(t){e.notice=t.response.data.message,setTimeout(function(){e.notice="",e.getInfo()},2e3)})}},deleteAddress:function(t){var e=this;if(t){var s=this.$conf.url+"/internethospital/api/user/{userId}/shipping-addresses/"+this.deleteId;this.$axios.delete(s,{headers:this.header}).then(function(t){e.deleteId="",e.notice="删除成功",setTimeout(function(){e.notice="",e.getInfo()},2e3)}).catch(function(t){e.notice=t.response.data.message,setTimeout(function(){e.notice="",e.getInfo()},2e3)})}else this.deleteId=""},chooseAddress:function(t){this.choseAdd&&(localStorage.setItem("addressId",t),this.$router.back())},jumpTo:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"create";this.$router.push("/"+t+"/"+e)}}},c={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"page"},[0===t.addressList.length?s("div",{staticClass:"emp"},[s("img",{attrs:{src:"/static/images/empty-address.png"}}),t._v(" "),s("span",[t._v("你还没有添加配送地址")])]):t._e(),t._v(" "),s("ul",{staticClass:"section",attrs:{"scroll-y":""}},t._l(t.addressList,function(e){return s("li",{on:{click:function(s){t.chooseAddress(e.id)}}},[s("span",[t._v(t._s(e.recipient)+"    "+t._s(e.phone))]),t._v(" "),s("span",[t._v(t._s(e.address))]),t._v(" "),t.choseAdd?t._e():s("div",[s("div",{staticClass:"left",on:{click:function(s){t.toDefault(e.id)}}},[e.defaultAddress?s("img",{staticClass:"left",attrs:{src:"/static/images/address-default.png"}}):s("img",{staticClass:"left",attrs:{src:"/static/images/address-to-default.png"}}),t._v(" "),s("span",{staticClass:"left"},[t._v(t._s(e.defaultAddress?"默认地址":"设为默认地址"))])]),t._v(" "),s("div",{staticClass:"right",on:{click:function(s){t.deleteId=e.id}}},[s("img",{staticClass:"left",attrs:{src:"/static/images/delete-line.png"}}),t._v(" "),s("span",{staticClass:"left"},[t._v("删除")])]),t._v(" "),s("div",{staticClass:"right",on:{click:function(s){t.jumpTo("address",e.id)}}},[s("img",{staticClass:"left",attrs:{src:"/static/images/edit-line.png"}}),t._v(" "),s("span",{staticClass:"left"},[t._v("编辑")])])])])})),t._v(" "),s("div",{staticClass:"btn-box"},[s("button",{on:{click:function(e){t.jumpTo("address")}}},[t._v("新增地址")])]),t._v(" "),t.notice?s("notice",{attrs:{message:t.notice}}):t._e(),t._v(" "),t.deleteId?s("notice-dialog",{attrs:{message:"确定要删除该配送地址吗？","button-confirm-text":"确定","button-cancel-text":"取消"},on:{touchConfirm:t.deleteAddress}}):t._e()],1)},staticRenderFns:[]};var r=s("C7Lr")(d,c,!1,function(t){s("j+lG")},"data-v-f2bcd144",null);e.default=r.exports}});
//# sourceMappingURL=10.65910500683f781f9496.js.map