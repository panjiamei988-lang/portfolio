// ==================== SIMPLE FIX ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Simple fix running...');

  // Fix all work items - make them visible immediately
  const workItems = document.querySelectorAll('.work-item');
  workItems.forEach((item, index) => {
    item.classList.add('visible');
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  });

  // Fix all hero text
  const heroTexts = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-tagline');
  heroTexts.forEach((text, index) => {
    text.style.opacity = '1';
    text.style.transform = 'translateY(0)';
    text.style.transition = `all 1s ease ${index * 0.2}s`;
  });

  // Fix all images
  const images = document.querySelectorAll('.work-image, img');
  images.forEach(img => {
    img.style.opacity = '1';
    img.classList.add('loaded');
  });

  console.log('✅ Simple fix completed');
});