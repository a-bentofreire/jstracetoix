// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
// Version: 1.2.1
"use strict";var jstracetoix=(()=>{var g=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames,N=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,v=Object.prototype.propertyIsEnumerable;var A=(e,t,r)=>t in e?g(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,w=(e,t)=>{for(var r in t||(t={}))F.call(t,r)&&A(e,r,t[r]);if(N)for(var r of N(t))v.call(t,r)&&A(e,r,t[r]);return e};var E=(e,t)=>{for(var r in t)g(e,r,{get:t[r],enumerable:!0})},$=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of L(t))!F.call(e,l)&&l!==r&&g(e,l,{get:()=>t[l],enumerable:!(o=B(t,l))||o.enumerable});return e};var q=e=>$(g({},"__esModule",{value:!0}),e);var V={};E(V,{DEFAULT_FORMAT:()=>R,c__:()=>J,d__:()=>U,init__:()=>P,t__:()=>D});var k=console.debug,I=()=>!1,T=e=>{},b=(e=void 0)=>0,p=()=>{},m=()=>{},C=e=>{k(e)},M=e=>{k=e||k};var R={result:"{name}:`{value}`",input:"{name}:`{value}`",thread:"{id}: ",sep:" | ",new_line:!0},O=R,_={},y={},h=!0,P=({stream:e=void 0,multithreading:t=!1,format:r=R,enabled:o=!0}={})=>{p(),M(e),T(t),O=r,_={},y={},h=o,m()},D=(e=void 0,t=void 0)=>{h&&(p(),y[b(t)]=e||`t${Object.keys(y).length}`,m())},J=(e,t)=>{if(!h)return e;let{name:r=void 0,allow:o=void 0,level:l=0}=t||{};p();let s=b();for(_[s]||(_[s]=[{index__:0,meta__:["meta__","index__"]}]);_[s].length<=l;)_[s].push({index__:0,meta__:["meta__","index__"]});let u=_[s][l],a=u.index__,d=u.meta__.length,f=typeof r=="function"?r(a,Object.keys(u).length-d,e):r||`i${Object.keys(u).length-d}`,n=e,i=o;try{typeof o=="function"&&(i=o(a,f,e),typeof i!="boolean"&&(n=i,i=!0))}finally{(i===void 0||i)&&(u[f]=n),u.index__=a+1,m()}return e},U=(e,t={})=>{if(!h)return e;let{name:r="_",allow:o=void 0,before:l=void 0,after:s=void 0,inputs:u=void 0,format:a=void 0}=t||{};p();let d=b(),f=_[d]||[{}],n=w(w({},f[f.length-1]),u||{});n.thread_id__=d,n.input_count__=n.index__||0,n.allow__=!0,n.meta__=[...n.meta__||["meta__"],"allow__","allow_input_count__","input_count__","thread_id__",r],n[r]=e,delete n.index__,n.meta__=n.meta__.filter(i=>i!=="index__"),n.allow_input_count__=Object.keys(n).length-n.meta__.length+1;try{if(typeof o=="function"&&(o=o(n),typeof o!="boolean"&&(n[r]=o,o=!0)),o!==!1){a=a||O;let i="";I()&&a.thread&&(i+=a.thread.replace("{id}",y[d]||`${d}`));let S=(c,j,x)=>c.replace("{name}",j).replace("{value}",typeof x=="object"?JSON.stringify(x):x);if(a.input)for(let c in n)n.meta__.includes(c)||(i+=S(a.input,c,n[c])+(a.sep||""));a.result&&(i+=S(a.result,r,n[r])),n.meta__+=["output__"],n.output__=i,(l===void 0||l(n))&&C(n.output__+(a.new_line?`
`:""))}else n.allow__=!1;s&&s(n)}finally{_[d]&&(_[d].pop(),_[d].length===0&&delete _[d]),m()}return e};return q(V);})();
for(const key of Object.keys(jstracetoix).filter((key) => key.includes("__"))) { window[key]=jstracetoix[key]; }
//# sourceMappingURL=jstracetoix.js.map
