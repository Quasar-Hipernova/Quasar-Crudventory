document.querySelectorAll(".carousel").forEach(carousel => {

  const track = carousel.querySelector(".carousel-track");
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const cards = carousel.querySelectorAll(".card");

  if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

  const visibleCards = 3; //  cuántas cards se ven
  let index = 0;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 20; // width + gap
    track.style.transform = `translateX(-${index * cardWidth}px)`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= cards.length - visibleCards;
  }

  nextBtn.addEventListener("click", () => {
    if (index < cards.length - visibleCards) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
});
