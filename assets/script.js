// scroll reveal
const els=document.querySelectorAll('.reveal');

const io=new IntersectionObserver(e=>{
  e.forEach(x=>{
    if(x.isIntersecting){
      x.target.classList.add('show');
    }
  });
},{threshold:0.2});

els.forEach(el=>io.observe(el));


// CURSOR FOLLOW + TEXT
const cursor=document.getElementById("cursor");

document.addEventListener("mousemove",(e)=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";
});

const items=document.querySelectorAll(".vitem");

items.forEach(item=>{
  item.addEventListener("mouseenter",()=>{
    cursor.innerText=item.querySelector(".title").innerText;
    cursor.style.transform="translate(-50%,-50%) scale(1.2)";
  });

  item.addEventListener("mouseleave",()=>{
    cursor.innerText="";
    cursor.style.transform="translate(-50%,-50%) scale(1)";
  });
});