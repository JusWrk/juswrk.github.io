document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const x=document.querySelector(a.getAttribute('href'));if(x){e.preventDefault();x.scrollIntoView({behavior:'smooth'})}}));
const navToggle=document.querySelector('.navtoggle');
const navLinks=document.querySelector('.navlinks');
if(navToggle&&navLinks){
  navToggle.addEventListener('click',()=>{
    const open=navLinks.toggleAttribute('data-open');
    navToggle.setAttribute('aria-expanded',String(open));
  });
  navLinks.addEventListener('click',e=>{
    if(e.target.closest('a')){
      navLinks.removeAttribute('data-open');
      navToggle.setAttribute('aria-expanded','false');
    }
  });
}
