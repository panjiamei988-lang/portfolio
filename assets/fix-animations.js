// ==================== FIX ANIMATIONS ====================
class AnimationFix {
  constructor() {
    this.init();
  }

  init() {
    console.log('🎬 Initializing Animation Fix...');

    // Fix hero animations
    this.fixHeroAnimations();

    // Fix image loading
    this.fixImageLoading();

    // Fix work item animations
    this.fixWorkItemAnimations();
  }

  // Fix hero section animations
  fixHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTagline = document.querySelector('.hero-tagline');

    // Force show hero content immediately
    setTimeout(() => {
      if (heroTitle) {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
      }

      setTimeout(() => {
        if (heroSubtitle) {
          heroSubtitle.style.opacity = '1';
          heroSubtitle.style.transform = 'translateY(0)';
          heroSubtitle.style.transition = 'opacity 1s ease, transform 1s ease';
        }

        setTimeout(() => {
          if (heroTagline) {
            heroTagline.style.opacity = '1';
            heroTagline.style.transform = 'translateY(0)';
            heroTagline.style.transition = 'opacity 1s ease, transform 1s ease';
          }
        }, 300);
      }, 300);
    }, 100);
  }

  // Fix image loading
  fixImageLoading() {
    const images = document.querySelectorAll('.work-image');

    images.forEach((img, index) => {
      // Remove lazy loading to force immediate load
      img.removeAttribute('loading');

      // Force show images
      img.style.opacity = '1';
      img.style.transition = 'opacity 0.5s ease';

      // Load image
      if (img.complete) {
        img.classList.add('loaded');
        img.style.opacity = '1';
      } else {
        img.onload = () => {
          img.classList.add('loaded');
          img.style.opacity = '1';
        };

        // Set src to ensure loading starts
        const src = img.src;
        img.src = '';
        setTimeout(() => {
          img.src = src;
        }, 100);
      }

      // Fallback for failed images
      img.onerror = () => {
        img.style.opacity = '1';
        img.style.filter = 'grayscale(100%)';
        img.alt = 'Image not available';
      };
    });
  }

  // Fix work item animations
  fixWorkItemAnimations() {
    const workItems = document.querySelectorAll('.work-item');

    // Show work items with staggered animation
    workItems.forEach((item, index) => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
      item.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    });
  }
}

// Initialize fix when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const animationFix = new AnimationFix();
  });
}