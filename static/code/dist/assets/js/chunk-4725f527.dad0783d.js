(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4725f527"],{"0d6e":function(e,t,c){"use strict";c("b507")},"2d50":function(e,t,c){"use strict";c("d2bd")},"5a55":function(e,t,c){"use strict";c.d(t,"a",(function(){return n})),c.d(t,"b",(function(){return o})),c.d(t,"c",(function(){return a}));const n="110000|110100|110101|110102|110103|110104|110105|110106|110200|110201|110202|110203|110204|110205|110206|110207|110208|110209|110210",o="100000|100100|100101|100102|100103|100104|100105|100200|100201",a="150000|150100|150101|150102|150104|150105|150106|150107|150210|150300|150301|150302|150303|150304|150305|150306|150307|150400|150401|150402|150403|150500|150501|150600|150700|150701|150702|150703|150704|150705|150706|150800|150900|150903|150904|150905|150906|150907|150908|150909|151000|151001|151002|151003|151100|151200|151300|151400|151401|151402|151403|151404|151405"},7705:function(e,t,c){"use strict";c.r(t);var n=c("f2bf");const o=Object(n["withScopeId"])("data-v-7f3d9e68"),a=o((e,t,c,o,a,i)=>{const s=Object(n["resolveComponent"])("base-map"),r=Object(n["resolveComponent"])("nav-pane"),d=Object(n["resolveComponent"])("image-describe");return Object(n["openBlock"])(),Object(n["createBlock"])("div",null,[Object(n["createVNode"])(s,{onMapCreated:i.onMapCreated},null,8,["onMapCreated"]),Object(n["createVNode"])(r,{mode:"景点",onConfirmClick:i.confirmClick},null,8,["onConfirmClick"]),Object(n["createVNode"])(d,{ref:"imgDesc",img:a.img,content:a.content},null,8,["img","content"])])});var i=c("3779"),s=c("93cb"),r=c("3e6b"),d=c("f403"),l=c("2ce2"),p=c("6fba"),u=(c("4d02"),c("c33e"),c("fd37")),b={name:"jdNav",components:{ImageDescribe:u["a"],NavPane:s["a"],BaseMap:i["a"]},data(){return{map:null,jdLayer:new r["a"]({}),select:null,popup:null,img:"",content:{}}},mounted(){},methods:{onMapCreated(e){this.map=e,this.map.addLayer(this.jdLayer),this.select=new l["a"]({}),this.map.addInteraction(this.select),this.popup=new p["a"]({popupClass:"default",closeBox:!0,onshow:function(){console.log("You opened the box")},onclose:function(){console.log("You close the box")},autoPan:!0,autoPanAnimation:{duration:250}}),this.map.addOverlay(this.popup),this.initSelect()},async confirmClick(e){let t=await e.source;this.map.getView().setCenter(e.point.split(",")),this.jdLayer.setSource(t),this.map.render()},change(e,t){return new Promise(c=>{this.img=e,this.content=t,c("ok")})},initSelect(){this.select.getFeatures().on(["add"],e=>{const t=e.element;if(t.getGeometry()instanceof d["a"]){let e=t.getProperties().properties,c=e["photos"]&&e["photos"].length?e["photos"][0].url:"",n={"名字":e.name,"地址":e.address,"电话":e["tel"]};this.change(c,n).then(()=>{let e=this.$refs.imgDesc.$el.outerHTML;this.popup.show(t.getGeometry().getFirstCoordinate(),e)})}}),this.select.getFeatures().on(["remove"],(function(){this.popup.hide()}))}}},m=c("6b0d"),h=c.n(m);const f=h()(b,[["render",a],["__scopeId","data-v-7f3d9e68"]]);t["default"]=f},"93cb":function(e,t,c){"use strict";var n=c("f2bf");const o=Object(n["withScopeId"])("data-v-60d8cdc6");Object(n["pushScopeId"])("data-v-60d8cdc6");const a={class:"nav-pane"},i={class:"name"},s=Object(n["createTextVNode"])(" m "),r=Object(n["createTextVNode"])("确定"),d=Object(n["createTextVNode"])("重置");Object(n["popScopeId"])();const l=o((e,t,c,l,p,u)=>{const b=Object(n["resolveComponent"])("el-autocomplete"),m=Object(n["resolveComponent"])("el-form-item"),h=Object(n["resolveComponent"])("el-input-number"),f=Object(n["resolveComponent"])("el-button"),j=Object(n["resolveComponent"])("el-form");return Object(n["openBlock"])(),Object(n["createBlock"])("div",a,[Object(n["createVNode"])(j,{"label-suffix":"：","label-width":"auto",inline:"","label-position":"right"},{default:o(()=>[Object(n["createVNode"])(m,{label:"起点"},{default:o(()=>[Object(n["createVNode"])(b,{modelValue:p.startInput,"onUpdate:modelValue":t[1]||(t[1]=e=>p.startInput=e),"fetch-suggestions":u.querySearchAsyncStart,placeholder:"请输起点查找"+c.mode,onSelect:u.handleSelectStart},{default:o(({item:e})=>[Object(n["createVNode"])("div",i,Object(n["toDisplayString"])(e.name),1)]),_:1},8,["modelValue","fetch-suggestions","placeholder","onSelect"])]),_:1}),Object(n["createVNode"])(m,{label:"范围"},{default:o(()=>[Object(n["createVNode"])(h,{min:1e3,max:1e4,"model-value":p.distance},null,8,["model-value"]),s]),_:1}),Object(n["createVNode"])(m,{style:{display:"flex","justify-content":"center","align-items":"center"}},{default:o(()=>[Object(n["createVNode"])(f,{onClick:u.confirmClick},{default:o(()=>[r]),_:1},8,["onClick"]),Object(n["createVNode"])(f,{onClick:u.resetClick},{default:o(()=>[d]),_:1},8,["onClick"])]),_:1})]),_:1})])});var p=c("365c"),u=c("ed08"),b=c("5a55"),m=c("a1e9"),h={name:"NavPane",props:{mode:{type:String,default:()=>""}},data(){return{startInput:"",endInput:"",targetLocation:"",originLocation:"",distance:3e3}},methods:{async querySearchAsyncStart(e,t){let c=await p["a"].getInputTips({keywords:e}),n=c.data.tips;t(n)},async handleSelectStart(e){let t=Object(m["s"])(e);this.startInput=t.name,this.originLocation=t.location},async querySearchAsyncEnd(e,t){let c=await p["a"].getInputTips({keywords:e}),n=c.data.tips;t(n)},handleSelectEnd(e){this.endInput=e.name,this.targetLocation=e.location},confirmClick(){let e={"酒店":b["b"],"景点":b["a"],"车站":b["c"]};this.$emit("confirmClick",{source:Object(u["b"])(this.originLocation,this.distance,e[this.mode],this.mode),point:this.originLocation})},resetClick(){}}},f=(c("0d6e"),c("6b0d")),j=c.n(f);const O=j()(h,[["render",l],["__scopeId","data-v-60d8cdc6"]]);t["a"]=O},b507:function(e,t,c){},d2bd:function(e,t,c){},fd37:function(e,t,c){"use strict";var n=c("f2bf");const o=Object(n["withScopeId"])("data-v-7e8f25bd");Object(n["pushScopeId"])("data-v-7e8f25bd");const a={class:"image-describe"},i={class:"image"},s={class:"content"};Object(n["popScopeId"])();const r=o((e,t,c,o,r,d)=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",a,[Object(n["createVNode"])("div",i,[Object(n["createVNode"])("img",{style:{width:"200px",height:"200px"},src:c.img},null,8,["src"])]),Object(n["createVNode"])("div",s,[(Object(n["openBlock"])(!0),Object(n["createBlock"])(n["Fragment"],null,Object(n["renderList"])(Object.keys(c.content),e=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",{class:"content-item",key:e},[Object(n["createVNode"])("span",null,Object(n["toDisplayString"])(e)+":",1),Object(n["createVNode"])("span",null,Object(n["toDisplayString"])(c.content[e]),1)]))),128))])])));var d={name:"ImageDescribe",props:{img:{type:String},content:{type:Object}}},l=(c("2d50"),c("6b0d")),p=c.n(l);const u=p()(d,[["render",r],["__scopeId","data-v-7e8f25bd"]]);t["a"]=u}}]);
//# sourceMappingURL=chunk-4725f527.dad0783d.js.map