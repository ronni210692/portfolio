// Subtle parallax on hero background
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const scrollY = window.scrollY;
  heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
});
