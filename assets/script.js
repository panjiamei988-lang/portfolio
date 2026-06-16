// CURSOR
const cursor=document.getElementById("cursor");

document.addEventListener("mousemove",(e)=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";
});

// hover text
document.querySelectorAll(".vitem").forEach(item=>{
  item.addEventListener("mouseenter",()=>{
    cursor.innerText=item.querySelector(".title").innerText;
  });

  item.addEventListener("mouseleave",()=>{
    cursor.innerText="";
  });
});

// reveal
const items=document.querySelectorAll(".vitem");

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity=1;
      e.target.style.transform="translateY(0)";
    }
  });
},{threshold:0.15});

items.forEach(el=>{
  el.style.opacity=0;
  el.style.transform="translateY(40px)";
  el.style.transition="1s cubic-bezier(.2,.8,.2,1)";
  io.observe(el);
});