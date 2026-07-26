
const menu=document.querySelector('.menu');
const nav=document.querySelector('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>nav.classList.toggle('open'));}
document.querySelectorAll('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
