// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
// Version: 0.1.3
var h=console.debug,w=()=>!1,k=t=>{},g=(t=void 0)=>0,p=()=>{},m=()=>{},R=t=>{h(t)},S=t=>{h=t||h};var N={result:"{name}:`{value}`",input:"{name}:`{value}`",thread:"{id}: ",sep:" | ",new_line:!0},A=N,l={},y={},C=({stream:t=void 0,multithreading:s=!1,format:r=N}={})=>{p(),S(t),k(s),A=r,l={},y={},m()},M=(t=void 0,s=void 0)=>{p(),y[g(s)]=t||`t${Object.keys(y).length}`,m()},O=(t,s)=>{let{name:r=void 0,allow:a=void 0,level:u=0}=s||{};p();let d=g();for(l[d]||(l[d]=[{index__:0,meta__:["meta__","index__"]}]);l[d].length<=u;)l[d].push({index__:0,meta__:["meta__","index__"]});let _=l[d][u],n=_.index__,i=_.meta__.length,c=typeof r=="function"?r(n,Object.keys(_).length-i,t):r||`i${Object.keys(_).length-i}`,e=t,o=a;try{typeof a=="function"&&(o=a(n,c,t),typeof o!="boolean"&&(e=o,o=!0))}finally{(o===void 0||o)&&(_[c]=e),_.index__=n+1,m()}return t},j=(t,s={})=>{let{name:r="_",allow:a=void 0,before:u=void 0,after:d=void 0,inputs:_=void 0,format:n=void 0}=s||{};p();let i=g(),c=l[i]||[{}],e={...c[c.length-1],..._||{}};e.thread_id__=i,e.input_count__=e.index__||0,e.allow__=!0,e.meta__=[...e.meta__||["meta__"],"allow__","allow_input_count__","input_count__","thread_id__",r],e[r]=t,delete e.index__,e.meta__=e.meta__.filter(o=>o!=="index__"),e.allow_input_count__=Object.keys(e).length-e.meta__.length+1;try{if(typeof a=="function"&&(a=a(e),typeof a!="boolean"&&(e[r]=a,a=!0)),a!==!1){n=n||A;let o="";w()&&n.thread&&(o+=n.thread.replace("{id}",y[i]||`${i}`));let x=(f,F,b)=>f.replace("{name}",F).replace("{value}",typeof b=="object"?JSON.stringify(b):b);if(n.input)for(let f in e)e.meta__.includes(f)||(o+=x(n.input,f,e[f])+(n.sep||""));n.result&&(o+=x(n.result,r,e[r])),e.meta__+=["output__"],e.output__=o,(u===void 0||u(e))&&R(e.output__+(n.new_line?`
`:""))}else e.allow__=!1;d&&d(e)}finally{l[i]&&(l[i].pop(),l[i].length===0&&delete l[i]),m()}return t};export{N as DEFAULT_FORMAT,O as c__,j as d__,C as init__,M as t__};
//# sourceMappingURL=jstracetoix.mjs.map
