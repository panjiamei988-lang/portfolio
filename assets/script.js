const cards = document.querySelectorAll(".card");

function reveal(){
  const trigger = window.innerHeight * 0.85;

  cards.forEach((card, i)=>{
    const top = card.getBoundingClientRect().top;

    if(top < trigger){
      setTimeout(()=>{
        card.classList.add("show");
      }, i * 80); // ✨ stagger动画
    }
  });
}

window.addEventListener("scroll", ()=> {
  requestAnimationFrame(reveal);
});

reveal();