// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
"use strict";var jstracetoix=(()=>{var m=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames,A=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var N=(e,t,n)=>t in e?m(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,b=(e,t)=>{for(var n in t||(t={}))O.call(t,n)&&N(e,n,t[n]);if(A)for(var n of A(t))F.call(t,n)&&N(e,n,t[n]);return e};var v=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(t,n)=>(typeof require!="undefined"?require:t)[n]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var C=(e,t)=>{for(var n in t)m(e,n,{get:t[n],enumerable:!0})},j=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of B(t))!O.call(e,i)&&i!==n&&m(e,i,{get:()=>t[i],enumerable:!(o=D(t,i))||o.enumerable});return e};var L=e=>j(m({},"__esModule",{value:!0}),e);var M={};C(M,{DEFAULT_FORMAT:()=>x,c__:()=>W,d__:()=>$,init__:()=>T,t__:()=>P});var x={result:"{name}:`{value}`",input:"{name}:`{value}`",thread:"{id}: ",sep:" | ",new_line:!0},w=console.debug,S=!1,E=x,d={},p={};var y=()=>{},h=()=>{},I=(e=void 0)=>0,T=({stream:e=w,multithreading:t=!1,format:n=x}={})=>{y(),w=e,S=!1,E=n,d={},p={},h()},P=(e=void 0,t=void 0)=>{y(),p[I(t)]=e||`t${Object.keys(p).length}`,h()},W=(e,t)=>{let{name:n=void 0,allow:o=void 0,level:i=0}=t||{};y();let s=I();for(d[s]||(d[s]=[{index__:0,meta__:["meta__","index__"]}]);d[s].length<=i;)d[s].push({index__:0,meta__:["meta__","index__"]});let u=d[s][i],l=u.index__,_=u.meta__.length,f=typeof n=="function"?n(l,Object.keys(u).length-_,e):n||`i${Object.keys(u).length-_}`,a=e,r=o;return typeof o=="function"&&(r=o(l,f,e),typeof r!="boolean"&&(a=r,r=!0)),(r===void 0||r)&&(u[f]=a),u.index__=l+1,h(),e},$=(e,t={})=>{let{name:n="_",allow:o=void 0,before:i=void 0,after:s=void 0,inputs:u=void 0,format:l=void 0}=t||{};y();let _=I(),f=d[_]||[{}],a=b(b({},f[f.length-1]),u||{});if(a.thread_id__=_,a.input_count__=a.index__||0,a.allow__=!0,a.meta__=[...a.meta__||["meta__"],"allow__","allow_input_count__","input_count__","thread_id__",n],a[n]=e,delete a.index__,a.meta__=a.meta__.filter(r=>r!=="index__"),a.allow_input_count__=Object.keys(a).length-a.meta__.length+1,typeof o=="function"&&(o=o(a),typeof o!="boolean"&&(a[n]=o,o=!0)),o!==!1){l=l||E;let r="";S&&l.thread&&(r+=l.thread.replace("{id}",p[_]||`${_}`));let k=(c,R,g)=>c.replace("{name}",R).replace("{value}",typeof g=="object"?JSON.stringify(g):g);for(let c in a)a.meta__.includes(c)||(r+=k(l.input,c,a[c])+l.sep);l.result&&(r+=k(l.result,n,a[n])),a.meta__+=["output__"],a.output__=r,(i===void 0||i(a))&&(r=a.output__+(l.new_line?`
`:""),w(r))}else a.allow__=!1;return s&&s(a),d[_]&&(d[_].pop(),d[_].length===0&&delete d[_]),h(),e};return L(M);})();
for(key of Object.keys(jstracetoix).filter((key) => key.includes("__"))) { window[key]=jstracetoix[key]; }
//# sourceMappingURL=jstracetoix.js.map
