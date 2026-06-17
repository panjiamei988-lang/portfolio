// ==================== IMAGE OPTIMIZATION SYSTEM ====================
class ImageOptimizer {
  constructor() {
    this.supportedFormats = new Map();
    this.cache = new Map();
    this.loadingQueue = new Map();
    this.optimizedImages = new Set();
    this.config = {
      webp: {
        quality: 0.85,
        maxWidth: 1920,
        maxHeight: 1080
      },
      avif: {
        quality: 0.80,
        maxWidth: 1920,
        maxHeight: 1080
      },
      original: {
        quality: 0.95
      }
    };

    this.init();
  }

  init() {
    this.detectFormatSupport();
    this.setupPreloading();
    this.setupCacheManagement();
    this.setupCompressionEngine();
  }

  // Detect supported image formats
  detectFormatSupport() {
    const formats = ['webp', 'avif', 'avif-lc', 'webp-lossless'];

    formats.forEach(format => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (format === 'webp') {
        this.supportedFormats.set('webp', canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
        this.supportedFormats.set('webp-lossless', this.testWebPLossless());
      } else if (format === 'avif') {
        this.supportedFormats.set('avif', this.testAVIF());
      } else if (format === 'avif-lc') {
        this.supportedFormats.set('avif-lc', this.testAVIF(true));
      }
    });

    console.log('Supported formats:', this.supportedFormats);
  }

  // Test WebP lossless support
  testWebPLossless() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 1, 1);
      return canvas.toDataURL('image/webp', 1).indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  }

  // Test AVIF support
  testAVIF(lowContrast = false) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = lowContrast ? '#888888' : '#ff0000';
      ctx.fillRect(0, 0, 1, 1);
      const format = lowContrast ? 'image/avif' : 'image/avif';
      return canvas.toDataURL(format).indexOf('data:image/avif') === 0;
    } catch (e) {
      return false;
    }
  }

  // Setup preloading
  setupPreloading() {
    // Critical images for hero section
    const criticalImages = [
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-074.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/images-018.png'
    ];

    criticalImages.forEach(src => {
      this.preloadImage(src, 'high');
    });
  }

  // Preload image with priority
  preloadImage(src, priority = 'normal') {
    if (this.cache.has(src) || this.loadingQueue.has(src)) return;

    const loader = new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.cache.set(src, img);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load: ${src}`));
      };

      // Set priority
      if (priority === 'high') {
        img.src = src;
        img.loading = 'eager';
      } else {
        setTimeout(() => {
          img.src = src;
        }, priority === 'low' ? 3000 : 1000);
      }
    });

    this.loadingQueue.set(src, loader);
    return loader;
  }

  // Setup cache management
  setupCacheManagement() {
    // Service Worker cache strategy
    if ('serviceWorker' in navigator) {
      this.setupServiceWorkerCache();
    }

    // LocalStorage for small images
    this.setupLocalStorageCache();

    // Cache eviction policies
    this.setupCacheEviction();
  }

  // Setup Service Worker cache
  setupServiceWorkerCache() {
    // Register service worker
    navigator.serviceWorker.register('/sw.js').catch(e => {
      console.log('Service Worker not supported:', e);
    });

    // Register image cache
    if ('caches' in window) {
      const cacheName = 'image-cache-v1';
      caches.open(cacheName).then(cache => {
        // Cache all images
        cache.addAll(this.getAllImageURLs());
      });
    }
  }

  // Setup LocalStorage cache for small images
  setupLocalStorageCache() {
    // Cache small images (< 100KB) in localStorage
    const maxCacheSize = 50 * 1024 * 1024; // 50MB

    window.addEventListener('beforeunload', () => {
      const cacheData = JSON.parse(localStorage.getItem('imageCache') || '{}');
      let totalSize = 0;

      Object.entries(cacheData).forEach(([src, data]) => {
        totalSize += data.size;
      });

      // Evict oldest if over limit
      if (totalSize > maxCacheSize) {
        this.evictFromLocalStorage(cacheData, maxCacheSize);
      }
    });
  }

  // Setup cache eviction
  setupCacheEviction() {
    // LRU eviction strategy
    const cacheKeys = [];
    const maxCacheSize = 100;

    const evictCache = () => {
      while (cacheKeys.length > maxCacheSize) {
        const oldestKey = cacheKeys.shift();
        this.cache.delete(oldestKey);
      }
    };

    // Hook into cache access
    const originalGet = this.cache.get.bind(this.cache);
    this.cache.get = (key) => {
      if (this.cache.has(key)) {
        // Move to end (most recently used)
        const index = cacheKeys.indexOf(key);
        if (index > -1) {
          cacheKeys.splice(index, 1);
        }
        cacheKeys.push(key);
      }
      return originalGet(key);
    };
  }

  // Setup compression engine
  setupCompressionEngine() {
    // Create canvas for image processing
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    // Setup image quality optimization
    this.setupQualityOptimization();
  }

  // Setup quality optimization based on viewport
  setupQualityOptimization() {
    const updateQuality = () => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1
      };

      // Adjust quality based on viewport size
      if (viewport.width < 768) {
        this.config.webp.quality = 0.75;
        this.config.avif.quality = 0.70;
      } else if (viewport.width < 1200) {
        this.config.webp.quality = 0.85;
        this.config.avif.quality = 0.80;
      } else {
        this.config.webp.quality = 0.90;
        this.config.avif.quality = 0.85;
      }

      console.log('Quality adjusted for viewport:', viewport);
    };

    window.addEventListener('resize', debounce(updateQuality, 250));
    updateQuality();
  }

  // Get all image URLs from document
  getAllImageURLs() {
    const images = document.querySelectorAll('img[src]');
    const urls = new Set();

    images.forEach(img => {
      urls.add(img.src);
    });

    return Array.from(urls);
  }

  // Optimize image format
  optimizeImageFormat(src) {
    if (!this.supportedFormats.get('webp')) return src;

    // Check for different image formats
    const extensions = ['.jpg', '.jpeg', '.png'];

    for (const ext of extensions) {
      if (src.toLowerCase().includes(ext)) {
        // Check if webp version exists in cache
        const webpSrc = src.replace(ext, '.webp');
        if (this.cache.has(webpSrc)) {
          return webpSrc;
        }

        // Return webp format if supported
        if (this.supportedFormats.get('webp')) {
          return webpSrc;
        }
        break;
      }
    }

    return src;
  }

  // Get optimized image URL
  getOptimizedURL(src, width, height) {
    const url = new URL(src, window.location.origin);

    // Add width and height parameters
    if (width) url.searchParams.set('w', width);
    if (height) url.searchParams.set('h', height);

    // Add quality parameter
    if (this.supportedFormats.get('webp')) {
      url.searchParams.set('q', Math.round(this.config.webp.quality * 100));
      url.searchParams.set('format', 'webp');
    }

    return url.toString();
  }

  // Compress image
  compressImage(blob, quality = 0.85, maxWidth = 1920, maxHeight = 1080) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        // Calculate new dimensions
        const aspectRatio = img.width / img.height;
        let newWidth = img.width;
        let newHeight = img.height;

        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = Math.round(newWidth / aspectRatio);
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = Math.round(newHeight * aspectRatio);
        }

        // Set canvas size
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        // Draw and compress
        this.ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob
        this.canvas.toBlob((compressedBlob) => {
          URL.revokeObjectURL(url);
          resolve(compressedBlob);
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to compress image'));
      };

      img.src = url;
    });
  }

  // Cache image in localStorage
  cacheImage(src, blob) {
    if (blob.size > 100 * 1024) return; // Don't cache large images

    try {
      const cacheData = JSON.parse(localStorage.getItem('imageCache') || '{}');
      cacheData[src] = {
        data: blob,
        size: blob.size,
        timestamp: Date.now()
      };
      localStorage.setItem('imageCache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Failed to cache image:', e);
    }
  }

  // Get image from cache
  getCachedImage(src) {
    try {
      const cacheData = JSON.parse(localStorage.getItem('imageCache') || '{}');
      const cached = cacheData[src];

      if (cached && Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return cached.data;
      }
    } catch (e) {
      console.warn('Failed to get cached image:', e);
    }

    return null;
  }

  // Evict from localStorage
  evictFromLocalStorage(cacheData, maxSize) {
    const sortedEntries = Object.entries(cacheData).sort((a, b) => {
      return a[1].timestamp - b[1].timestamp;
    });

    let currentSize = 0;
    const newCache = {};

    sortedEntries.forEach(([src, data]) => {
      if (currentSize + data.size <= maxSize) {
        newCache[src] = data;
        currentSize += data.size;
      }
    });

    localStorage.setItem('imageCache', JSON.stringify(newCache));
  }

  // Get optimal image source
  getOptimalSrc(src) {
    // Check cache first
    if (this.cache.has(src)) {
      return src;
    }

    // Check localStorage
    const cached = this.getCachedImage(src);
    if (cached) {
      return URL.createObjectURL(cached);
    }

    // Return optimized format
    return this.optimizeImageFormat(src);
  }
}

// Helper function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==================== LAZY LOADING ENHANCER ====================
class LazyLoadingEnhancer {
  constructor(imageOptimizer) {
    this.optimizer = imageOptimizer;
    this.observer = null;
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });
  }

  loadImage(img) {
    // Get optimal source
    const optimalSrc = this.optimizer.getOptimalSrc(img.src);

    // Set the source
    if (optimalSrc !== img.src) {
      img.src = optimalSrc;
      img.classList.add('loading');
    }

    // Load image
    img.onload = () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    };

    img.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
    };
  }

  observe(img) {
    this.observer.observe(img);
  }
}

// ==================== EXPORT FOR MODULAR LOADING ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ImageOptimizer,
    LazyLoadingEnhancer
  };
}

// ==================== STANDALONE INITIALIZATION ====================
if (typeof document !== 'undefined') {
  // Initialize only when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize image optimizer
    const imageOptimizer = new ImageOptimizer();

    // Initialize lazy loading enhancer
    const lazyLoading = new LazyLoadingEnhancer(imageOptimizer);

    // Apply lazy loading to all images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      lazyLoading.observe(img);
    });

    console.log('Image optimizer initialized');
  });
}