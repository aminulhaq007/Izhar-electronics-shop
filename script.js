const yearEl=document.getElementById("year"); if(yearEl) yearEl.textContent=new Date().getFullYear();
const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
toggle.addEventListener("click",()=>{nav.classList.toggle("open");toggle.setAttribute("aria-expanded",nav.classList.contains("open"))});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const galleryTabs=document.querySelectorAll(".gallery-tab");
galleryTabs.forEach(tab=>tab.addEventListener("click",()=>{
  galleryTabs.forEach(t=>t.classList.remove("active")); tab.classList.add("active");
  const filter=tab.dataset.filter;
  document.querySelectorAll(".media-card").forEach(card=>{card.style.display=(filter==="all"||card.dataset.kind===filter)?"block":"none";});
}));
