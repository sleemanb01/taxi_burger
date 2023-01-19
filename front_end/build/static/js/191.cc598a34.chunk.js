"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[191],{816:function(e,n,t){t.d(n,{U:function(){return s}});var i=t(9439),r=t(2791),a=t(4267),u=t(184),s=function(e){var n=e.id,t=e.center,s=void 0!==t&&t,l=e.onInput,o=e.errorText,c=(0,r.useState)(null),d=(0,i.Z)(c,2),p=d[0],f=d[1],v=(0,r.useState)(null),h=(0,i.Z)(v,2),m=h[0],E=h[1],x=(0,r.useState)(!0),I=(0,i.Z)(x,2),g=I[0],C=I[1],N=(0,r.useRef)(null);(0,r.useEffect)((function(){if(p){var e=new FileReader;e.onload=function(){E(e.result)},e.readAsDataURL(p)}}),[p]);return(0,u.jsxs)("div",{className:"form-control",children:[(0,u.jsx)("input",{id:n,ref:N,style:{display:"none"},type:"file",accept:".jpg,.png,.jpeg",onChange:function(e){var t=null,i=g;e.target.files&&1===e.target.files.length?(t=e.target.files[0],f(t),C(!0),i=!0):(C(!1),i=!1),l(n,t,i)}}),(0,u.jsxs)("div",{className:"image-upload ".concat(s&&"center"),children:[(0,u.jsxs)("div",{className:"image-upload__preview",children:[m&&(0,u.jsx)("img",{src:m,alt:"Preview"}),!m&&(0,u.jsx)("p",{children:"Please pick an image."})]}),(0,u.jsx)(a.z,{type:"button",onClick:function(){N.current.click()},children:"PICK IMAGE"})]}),!g&&(0,u.jsx)("p",{children:o})]})}},8226:function(e,n,t){t.d(n,{I:function(){return l}});var i=t(9439),r=t(2791),a=t(5221),u=t(8749),s=t(184);function l(e){var n=e.id,t=e.label,l=e.element,o=e.type,c=e.placeHolder,d=e.rows,p=e.validators,f=e.errorText,v=e.onInput,h={value:e.initValue||"",isTouched:!1,isValid:e.initialIsValid||!1},m=(0,r.useReducer)(a.Bw,h),E=(0,i.Z)(m,2),x=E[0],I=E[1],g=x.value,C=x.isValid;(0,r.useEffect)((function(){v(n,g,C)}),[n,g,C,v]);var N=function(e){var n={val:e.target.value,type:u.hd.CHNAGE,validators:p};I(n)},T=function(){var e={val:x.value,type:u.hd.TOUCH,validators:p};I(e)},j="input"===l?(0,s.jsx)("input",{id:n,type:o,placeholder:c,onChange:N,onBlur:T,value:x.value}):(0,s.jsx)("textarea",{id:n,rows:d||3,onChange:N,onBlur:T,value:x.value});return(0,s.jsxs)("div",{className:"form-control ".concat(!x.isValid&&x.isTouched&&"form-control--invalid"),children:[(0,s.jsx)("label",{htmlFor:n,children:t}),j,!x.isValid&&x.isTouched&&(0,s.jsx)("p",{children:f})]})}},8895:function(e,n,t){t.r(n),t.d(n,{default:function(){return g}});var i=t(4165),r=t(5861),a=t(9439),u=t(2791),s=t(4707),l=t(4795),o=t(8618),c=t(5221),d=t(7689),p=t(8749),f=t(7594),v=t(4267),h=t(8226),m=t(5309),E=t(9805),x=t(816),I=t(184);var g=function(){var e=(0,l.c)(c._9.inputs,c._9.isValid),n=(0,a.Z)(e,2),t=n[0],g=n[1],C=(0,d.s0)(),N=(0,u.useContext)(s.V).user,T=(0,o.x)(),j=T.isLoading,y=T.error,A=T.sendRequest,V=T.clearError,Z=function(){var e=(0,r.Z)((0,i.Z)().mark((function e(n){var r;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.preventDefault(),t){e.next=3;break}return e.abrupt("return");case 3:return(r=new FormData).append("name",t.inputs.name.value),r.append("quantity",t.inputs.quantity.value),r.append("image",t.inputs.image.value),e.prev=7,e.next=10,A(f.vC,"POST",r,{Authorization:"Barer "+N.token});case 10:C("/"),e.next=15;break;case 13:e.prev=13,e.t0=e.catch(7);case 15:case"end":return e.stop()}}),e,null,[[7,13]])})));return function(n){return e.apply(this,arguments)}}();return N.isAdmin||C("/"),(0,I.jsxs)(u.Fragment,{children:[(0,I.jsx)(m.C,{error:y,onClear:V}),(0,I.jsxs)("form",{className:"stock-form",onSubmit:Z,children:[j&&(0,I.jsx)(E.Z,{asOverlay:!0}),(0,I.jsx)(h.I,{id:"name",element:"input",type:"text",label:"name",validators:[p.J7.REQUIRE],errorText:f.BH,onInput:g}),(0,I.jsx)(h.I,{id:"quantity",element:"input",label:"quantity",validators:[p.J7.MIN,p.J7.MAX],errorText:f.gt,onInput:g}),(0,I.jsx)(x.U,{id:"image",onInput:g,errorText:f.fo}),(0,I.jsx)(v.z,{type:"submit",disabled:!t.isValid,children:"ADD STOCK"})]})]})}},4795:function(e,n,t){t.d(n,{c:function(){return s}});var i=t(9439),r=t(2791),a=t(8749),u=t(5221),s=function(e,n){var t=(0,r.useReducer)(u.aB,{inputs:e,isValid:n}),s=(0,i.Z)(t,2),l=s[0],o=s[1];return[l,(0,r.useCallback)((function(e,n,t){var i={type:a.hd.CHNAGE,input:{value:n,isValid:t},inputId:e};o(i)}),[]),(0,r.useCallback)((function(e,n){var t={inputs:e,isValid:n},i={type:a.hd.SET,input:t};o(i)}),[])]}},5221:function(e,n,t){t.d(n,{aB:function(){return p},Bw:function(){return c},_9:function(){return d},W0:function(){return o}});var i=t(4942),r=t(1413),a=t(8749),u=t(7762),s=t(7594),l=function(e,n){var t,i=!0,r=(0,u.Z)(n);try{for(r.s();!(t=r.n()).done;){var l=t.value;l===a.J7.REQUIRE&&(i=i&&e.trim().length>0),l===a.J7.MINLENGTH&&(i=i&&e.trim().length>=s.bG),l===a.J7.MAXLENGTH&&(i=i&&e.trim().length<=s.Qt),l===a.J7.MIN&&(i=i&&+e>=s.KX),l===a.J7.MAX&&(i=i&&+e<=s.k2),l===a.J7.EMAIL&&(i=i&&/^\S+@\S+\.\S+$/.test(e)),l===a.J7.FILE&&(i=i&&!!e.name.match(/\.(jpg|jpeg|png|gif)$/))}}catch(o){r.e(o)}finally{r.f()}return i},o={value:"",isTouched:!1,isValid:!1},c=function(e,n){switch(n.type){case a.hd.CHNAGE:var t=n.val;return(0,r.Z)((0,r.Z)({},e),{},{value:t,isValid:l(t,n.validators)});case a.hd.TOUCH:return(0,r.Z)((0,r.Z)({},e),{},{isTouched:!0});default:return e}},d={inputs:{name:o,quantity:o,image:o},isValid:!1},p=function(e,n){switch(n.type){case a.hd.CHNAGE:n.input=n.input;var t=!0;for(var u in e.inputs)e.inputs[u]&&(t=u===n.inputId?t&&n.input.isValid:t&&e.inputs[u].isValid);return(0,r.Z)((0,r.Z)({},e),{},{inputs:(0,r.Z)((0,r.Z)({},e.inputs),{},(0,i.Z)({},n.inputId,{value:n.input.value,isValid:n.input.isValid})),isValid:t});case a.hd.SET:return n.input=n.input,{inputs:n.input.inputs,isValid:n.input.isValid};default:return e}}},8749:function(e,n,t){var i,r,a;t.d(n,{J7:function(){return i},hd:function(){return r}}),function(e){e[e.REQUIRE=0]="REQUIRE",e[e.MINLENGTH=1]="MINLENGTH",e[e.MAXLENGTH=2]="MAXLENGTH",e[e.MIN=3]="MIN",e[e.MAX=4]="MAX",e[e.EMAIL=5]="EMAIL",e[e.FILE=6]="FILE"}(i||(i={})),function(e){e[e.CHNAGE=0]="CHNAGE",e[e.TOUCH=1]="TOUCH",e[e.SET=2]="SET"}(r||(r={})),function(e){e[e.OK=200]="OK",e[e.Created=201]="Created",e[e.Accepted=202]="Accepted",e[e.No_Content=204]="No_Content",e[e.Bad_Request=400]="Bad_Request",e[e.Unauthorized=401]="Unauthorized",e[e.Not_Found=404]="Not_Found",e[e.Internal_Server_Error=500]="Internal_Server_Error",e[e.Unprocessable_Entity=422]="Unprocessable_Entity"}(a||(a={}))}}]);
//# sourceMappingURL=191.cc598a34.chunk.js.map