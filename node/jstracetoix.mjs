// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
// Version: 0.1.5
import{threadId as T}from"worker_threads";var v=new SharedArrayBuffer(4),k=new Int32Array(v),y=!1,w=process.stdout,A=()=>y,S=t=>{y=t},R=t=>{w=t||w},I=t=>{w.write(t)},g=(t=void 0)=>t||T,m=()=>{for(;y&&Atomics.compareExchange(k,0,0,1)!==0;);},p=()=>{y&&Atomics.store(k,0,0)};var B={result:"{name}:`{value}`",input:"{name}:`{value}`",thread:"{id}: ",sep:" | ",new_line:!0},N=B,l={},h={},j=({stream:t=void 0,multithreading:s=!1,format:a=B}={})=>{m(),R(t),S(s),N=a,l={},h={},p()},E=(t=void 0,s=void 0)=>{m(),h[g(s)]=t||`t${Object.keys(h).length}`,p()},$=(t,s)=>{let{name:a=void 0,allow:o=void 0,level:u=0}=s||{};m();let d=g();for(l[d]||(l[d]=[{index__:0,meta__:["meta__","index__"]}]);l[d].length<=u;)l[d].push({index__:0,meta__:["meta__","index__"]});let _=l[d][u],n=_.index__,i=_.meta__.length,f=typeof a=="function"?a(n,Object.keys(_).length-i,t):a||`i${Object.keys(_).length-i}`,e=t,r=o;try{typeof o=="function"&&(r=o(n,f,t),typeof r!="boolean"&&(e=r,r=!0))}finally{(r===void 0||r)&&(_[f]=e),_.index__=n+1,p()}return t},q=(t,s={})=>{let{name:a="_",allow:o=void 0,before:u=void 0,after:d=void 0,inputs:_=void 0,format:n=void 0}=s||{};m();let i=g(),f=l[i]||[{}],e={...f[f.length-1],..._||{}};e.thread_id__=i,e.input_count__=e.index__||0,e.allow__=!0,e.meta__=[...e.meta__||["meta__"],"allow__","allow_input_count__","input_count__","thread_id__",a],e[a]=t,delete e.index__,e.meta__=e.meta__.filter(r=>r!=="index__"),e.allow_input_count__=Object.keys(e).length-e.meta__.length+1;try{if(typeof o=="function"&&(o=o(e),typeof o!="boolean"&&(e[a]=o,o=!0)),o!==!1){n=n||N;let r="";A()&&n.thread&&(r+=n.thread.replace("{id}",h[i]||`${i}`));let x=(c,F,b)=>c.replace("{name}",F).replace("{value}",typeof b=="object"?JSON.stringify(b):b);if(n.input)for(let c in e)e.meta__.includes(c)||(r+=x(n.input,c,e[c])+(n.sep||""));n.result&&(r+=x(n.result,a,e[a])),e.meta__+=["output__"],e.output__=r,(u===void 0||u(e))&&I(e.output__+(n.new_line?`
`:""))}else e.allow__=!1;d&&d(e)}finally{l[i]&&(l[i].pop(),l[i].length===0&&delete l[i]),p()}return t};export{B as DEFAULT_FORMAT,$ as c__,q as d__,j as init__,E as t__};
//# sourceMappingURL=jstracetoix.mjs.map
