// ==================== DISPLAY FIX ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Applying display fixes...');

  // Fix all hidden content
  setTimeout(() => {
    // Fix hero text
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-tagline');
    heroElements.forEach((el, index) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = `all 1s ease ${index * 0.2}s`;
    });

    // Fix work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, index) => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
      item.style.transition = `all 0.8s ease ${index * 0.1}s`;
    });

    // Fix images
    const images = document.querySelectorAll('.work-image');
    images.forEach((img, index) => {
      // Force load images
      if (!img.complete && img.src) {
        const tempImg = new Image();
        tempImg.onload = () => {
          img.classList.add('loaded');
          img.style.opacity = '1';
        };
        tempImg.src = img.src;
      } else {
        img.classList.add('loaded');
        img.style.opacity = '1';
      }
    });

    console.log('✅ Display fixes applied');
  }, 500);

  // Ensure all images are visible after load
  window.addEventListener('load', () => {
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      img.style.opacity = '1';
      img.classList.add('loaded');
    });
  });
});