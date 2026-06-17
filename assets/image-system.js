// ==================== IMAGE SYSTEM ====================
class ImageSystem {
  constructor() {
    this.imageCache = new Map();
    this.loadingImages = new Map();
    this.failedImages = new Set();
    this.imageObserver = null;
    this.lazyLoadOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.init();
  }

  init() {
    // Initialize lazy loading observer
    this.initLazyLoading();

    // Preload hero images
    this.preloadHeroImages();

    // Add error handling for all images
    this.setupErrorHandling();

    // Add image quality optimization
    this.setupImageOptimization();
  }

  // Lazy Loading Implementation
  initLazyLoading() {
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.imageObserver.unobserve(img);
        }
      });
    }, this.lazyLoadOptions);

    // Observe all images with loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => this.imageObserver.observe(img));
  }

  // Load individual image with caching
  loadImage(imgElement) {
    const src = imgElement.src;

    // Return if already cached
    if (this.imageCache.has(src)) {
      this.applyImage(imgElement, this.imageCache.get(src));
      return;
    }

    // Return if failed before
    if (this.failedImages.has(src)) {
      this.applyFallback(imgElement);
      return;
    }

    // Check if already loading
    if (this.loadingImages.has(src)) {
      this.loadingImages.get(src).push(imgElement);
      return;
    }

    // Start loading
    this.loadingImages.set(src, [imgElement]);

    const tempImg = new Image();

    tempImg.onload = () => {
      // Cache the image
      this.imageCache.set(src, tempImg);

      // Apply to all pending images
      const pendingImages = this.loadingImages.get(src);
      pendingImages.forEach(img => this.applyImage(img, tempImg));

      // Clean up
      this.loadingImages.delete(src);
    };

    tempImg.onerror = () => {
      // Mark as failed
      this.failedImages.add(src);

      // Apply fallback to all pending images
      const pendingImages = this.loadingImages.get(src);
      pendingImages.forEach(img => this.applyFallback(img));

      // Clean up
      this.loadingImages.delete(src);
    };

    tempImg.src = src;
  }

  // Apply loaded image to element
  applyImage(imgElement, loadedImage) {
    imgElement.src = loadedImage.src;
    imgElement.classList.add('loaded');

    // Apply smooth transition
    if (imgElement.dataset.fade === 'true') {
      imgElement.style.opacity = '0';
      imgElement.style.transition = 'opacity 0.5s ease-in-out';

      setTimeout(() => {
        imgElement.style.opacity = '1';
      }, 50);
    }
  }

  // Apply fallback for failed images
  applyFallback(imgElement) {
    // Use a placeholder or default image
    const placeholder = imgElement.dataset.placeholder ||
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVhNWY1Ii8+PHJlY3QgeD0iLTEwMCUiIHk9IjEwMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM2MDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNDA0ZWZiIj5UaGUgSW1hZ2UgaXMgZmFtaWx5PC90ZXh0Pjwvc3ZnPg==';

    imgElement.src = placeholder;
    imgElement.classList.add('error');
    imgElement.alt = 'Image not available';
  }

  // Preload hero images for better performance
  preloadHeroImages() {
    const heroImages = [
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-074.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-018.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-098.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-166.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-196.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-280.png'
    ];

    heroImages.forEach(src => {
      if (!this.imageCache.has(src) && !this.failedImages.has(src)) {
        const img = new Image();
        img.onload = () => {
          this.imageCache.set(src, img);
        };
        img.onerror = () => {
          this.failedImages.add(src);
        };
        img.src = src;
      }
    });
  }

  // Setup error handling for all images
  setupErrorHandling() {
    // Listen for new images added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG' ||
              (node.nodeType === 1 && node.querySelectorAll('img').length > 0)) {
            const images = node.nodeName === 'IMG' ? [node] : node.querySelectorAll('img');
            images.forEach(img => {
              this.setupImageListeners(img);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Setup individual image listeners
  setupImageListeners(imgElement) {
    // Add error listener
    imgElement.addEventListener('error', () => {
      this.applyFallback(imgElement);
    });

    // Add load listener for animations
    imgElement.addEventListener('load', () => {
      imgElement.classList.add('loaded');
    });

    // Add to lazy loading if needed
    if (imgElement.getAttribute('loading') === 'lazy' &&
        !this.imageObserver?.takeRecords().some(r => r.target === imgElement)) {
      this.imageObserver?.observe(imgElement);
    }
  }

  // Setup image optimization
  setupImageOptimization() {
    // Create image quality handler
    const optimizeImage = (src, element) => {
      // Add WebP format support if available
      if (this.supportsWebP() && src.includes('.png')) {
        const webpSrc = src.replace('.png', '.webp');
        element.srcset = `${webpSrc} 1x, ${src} 2x`;
      }
    };

    // Check WebP support
    this.supportsWebP = () => {
      const elem = document.createElement('canvas');
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
  }

  // Get cached image
  getCachedImage(src) {
    return this.imageCache.get(src);
  }

  // Clear cache
  clearCache() {
    this.imageCache.clear();
    this.loadingImages.clear();
    this.failedImages.clear();
  }

  // Get loading stats
  getStats() {
    return {
      cached: this.imageCache.size,
      loading: this.loadingImages.size,
      failed: this.failedImages.size,
      total: this.imageCache.size + this.loadingImages.size + this.failedImages.size
    };
  }
}

// ==================== ENHANCED PARALLAX MODULE ====================
class EnhancedParallax {
  constructor(imageSystem) {
    this.imageSystem = imageSystem;
    this.init();
  }

  init() {
    this.setupParallax();
    this.setupZoomEffects();
    this.setupImageTransitions();
  }

  // Enhanced parallax with speed control
  setupParallax() {
    const workItems = document.querySelectorAll('.work-item');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      workItems.forEach((item, index) => {
        const image = item.querySelector('.work-image');
        if (image) {
          const speed = 0.5 + (index * 0.1);
          const yPos = -(scrolled * speed);
          image.style.transform = `translateY(${yPos}px)`;

          // Add slight zoom effect
          const scale = 1 + (scrolled * 0.0002);
          image.style.transform += ` scale(${Math.min(scale, 1.1)})`;
        }
      });
    });
  }

  // Zoom effect on hover
  setupZoomEffects() {
    const workItems = document.querySelectorAll('.work-item');

    workItems.forEach(item => {
      const image = item.querySelector('.work-image');
      if (image) {
        item.addEventListener('mouseenter', () => {
          image.style.transform = 'scale(1.05)';
          image.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', () => {
          const scrolled = window.pageYOffset;
          const speed = 0.5 + (Array.from(workItems).indexOf(item) * 0.1);
          const yPos = -(scrolled * speed);
          image.style.transform = `translateY(${yPos}px)`;
        });
      }
    });
  }

  // Smooth image transitions
  setupImageTransitions() {
    const images = document.querySelectorAll('.work-image');

    images.forEach(img => {
      img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    });
  }
}

// ==================== IMAGE LOADING INDICATOR ====================
class ImageLoadingIndicator {
  constructor(imageSystem) {
    this.imageSystem = imageSystem;
    this.indicators = new Map();
    this.init();
  }

  init() {
    this.createIndicatorStyles();
    this.setupImageMonitoring();
  }

  // Create loading indicator styles
  createIndicatorStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .image-loading-wrapper {
        position: relative;
        overflow: hidden;
      }

      .image-loading-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .image-loading-indicator.active {
        opacity: 1;
      }

      @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Setup image loading monitoring
  setupImageMonitoring() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (!this.indicators.has(img)) {
        this.createImageWrapper(img);
      }
    });

    // Monitor new images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG' ||
              (node.nodeType === 1 && node.querySelectorAll('img').length > 0)) {
            const images = node.nodeName === 'IMG' ? [node] : node.querySelectorAll('img');
            images.forEach(img => {
              if (!this.indicators.has(img)) {
                this.createImageWrapper(img);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Create wrapper with loading indicator
  createImageWrapper(img) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-loading-wrapper';

    const indicator = document.createElement('div');
    indicator.className = 'image-loading-indicator';

    wrapper.appendChild(indicator);
    wrapper.appendChild(img);

    // Replace original image with wrapper
    img.parentNode.replaceChild(wrapper, img);

    this.indicators.set(img, { wrapper, indicator });

    // Show loading indicator
    indicator.classList.add('active');

    // Hide indicator when image loads
    img.addEventListener('load', () => {
      setTimeout(() => {
        indicator.classList.remove('active');
      }, 300);
    });

    img.addEventListener('error', () => {
      indicator.classList.remove('active');
    });
  }
}

// ==================== EXPORT FOR MODULAR LOADING ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ImageSystem,
    EnhancedParallax,
    ImageLoadingIndicator
  };
}

// ==================== STANDALONE INITIALIZATION ====================
if (typeof document !== 'undefined') {
  // Initialize only when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize image system first
    const imageSystem = new ImageSystem();

    // Initialize enhanced parallax
    const parallax = new EnhancedParallax(imageSystem);

    // Initialize loading indicators
    const loadingIndicator = new ImageLoadingIndicator(imageSystem);

    // Log image system stats
    console.log('Image System Stats:', imageSystem.getStats());
  });
}