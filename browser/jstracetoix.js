// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
// Version: 1.0.0
"use strict";var jstracetoix=(()=>{var g=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames,S=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var N=(e,t,o)=>t in e?g(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,x=(e,t)=>{for(var o in t||(t={}))A.call(t,o)&&N(e,o,t[o]);if(S)for(var o of S(t))B.call(t,o)&&N(e,o,t[o]);return e};var L=(e,t)=>{for(var o in t)g(e,o,{get:t[o],enumerable:!0})},E=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of j(t))!A.call(e,l)&&l!==o&&g(e,l,{get:()=>t[l],enumerable:!(r=O(t,l))||r.enumerable});return e};var $=e=>E(g({},"__esModule",{value:!0}),e);var U={};L(U,{DEFAULT_FORMAT:()=>k,c__:()=>D,d__:()=>J,init__:()=>q,t__:()=>P});var w=console.debug,F=()=>!1,I=e=>{},y=(e=void 0)=>0,p=()=>{},m=()=>{},T=e=>{w(e)},v=e=>{w=e||w};var k={result:"{name}:`{value}`",input:"{name}:`{value}`",thread:"{id}: ",sep:" | ",new_line:!0},C=k,_={},b={},q=({stream:e=void 0,multithreading:t=!1,format:o=k}={})=>{p(),v(e),I(t),C=o,_={},b={},m()},P=(e=void 0,t=void 0)=>{p(),b[y(t)]=e||`t${Object.keys(b).length}`,m()},D=(e,t)=>{let{name:o=void 0,allow:r=void 0,level:l=0}=t||{};p();let s=y();for(_[s]||(_[s]=[{index__:0,meta__:["meta__","index__"]}]);_[s].length<=l;)_[s].push({index__:0,meta__:["meta__","index__"]});let u=_[s][l],a=u.index__,d=u.meta__.length,c=typeof o=="function"?o(a,Object.keys(u).length-d,e):o||`i${Object.keys(u).length-d}`,n=e,i=r;try{typeof r=="function"&&(i=r(a,c,e),typeof i!="boolean"&&(n=i,i=!0))}finally{(i===void 0||i)&&(u[c]=n),u.index__=a+1,m()}return e},J=(e,t={})=>{let{name:o="_",allow:r=void 0,before:l=void 0,after:s=void 0,inputs:u=void 0,format:a=void 0}=t||{};p();let d=y(),c=_[d]||[{}],n=x(x({},c[c.length-1]),u||{});n.thread_id__=d,n.input_count__=n.index__||0,n.allow__=!0,n.meta__=[...n.meta__||["meta__"],"allow__","allow_input_count__","input_count__","thread_id__",o],n[o]=e,delete n.index__,n.meta__=n.meta__.filter(i=>i!=="index__"),n.allow_input_count__=Object.keys(n).length-n.meta__.length+1;try{if(typeof r=="function"&&(r=r(n),typeof r!="boolean"&&(n[o]=r,r=!0)),r!==!1){a=a||C;let i="";F()&&a.thread&&(i+=a.thread.replace("{id}",b[d]||`${d}`));let R=(f,M,h)=>f.replace("{name}",M).replace("{value}",typeof h=="object"?JSON.stringify(h):h);if(a.input)for(let f in n)n.meta__.includes(f)||(i+=R(a.input,f,n[f])+(a.sep||""));a.result&&(i+=R(a.result,o,n[o])),n.meta__+=["output__"],n.output__=i,(l===void 0||l(n))&&T(n.output__+(a.new_line?`
`:""))}else n.allow__=!1;s&&s(n)}finally{_[d]&&(_[d].pop(),_[d].length===0&&delete _[d]),m()}return e};return $(U);})();
for(const key of Object.keys(jstracetoix).filter((key) => key.includes("__"))) { window[key]=jstracetoix[key]; }
//# sourceMappingURL=jstracetoix.js.map
