// ==================== IMAGE ERROR HANDLING SYSTEM ====================
class ImageErrorHandler {
  constructor() {
    this.errorCache = new Set();
    this.retryCount = new Map();
    this.maxRetries = 3;
    this.fallbackImages = new Map();
    this.errorListeners = new Map();

    // Configuration
    this.config = {
      retryDelay: 2000,
      showErrorMessage: true,
      usePlaceholder: true,
      logErrors: true,
      notifyOnError: true
    };

    this.init();
  }

  init() {
    this.setupErrorHandling();
    this.setupFallbackImages();
    this.setupRetryMechanism();
    this.setupNotificationSystem();
    this.setupErrorAnalytics();
  }

  // Setup error handling for all images
  setupErrorHandling() {
    // Handle existing images
    this.setupImages(document.querySelectorAll('img'));

    // Handle dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG' ||
              (node.nodeType === 1 && node.querySelectorAll('img').length > 0)) {
            const images = node.nodeName === 'IMG' ? [node] : node.querySelectorAll('img');
            this.setupImages(images);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Setup individual images
  setupImages(images) {
    images.forEach(img => {
      // Add error listener if not already added
      if (!img.dataset.errorHandled) {
        this.setupImageListener(img);
        img.dataset.errorHandled = 'true';
      }

      // Check if image has already failed
      if (img.complete && img.naturalWidth === 0) {
        this.handleImageError(img, new Error('Image already failed'));
      }
    });
  }

  // Setup image listener
  setupImageListener(img) {
    img.addEventListener('error', (event) => {
      this.handleImageError(img, event);
    });

    // Add load listener to mark as successful
    img.addEventListener('load', () => {
      this.markImageSuccess(img);
    });
  }

  // Handle image error
  handleImageError(img, error) {
    const src = img.src;

    // Check if already retried
    if (this.errorCache.has(src) && this.retryCount.get(src) >= this.maxRetries) {
      this.finalizeError(img, src, error);
      return;
    }

    // Mark as error
    img.classList.add('error');
    this.errorCache.add(src);

    // Log error
    if (this.config.logErrors) {
      this.logError(src, error);
    }

    // Notify if configured
    if (this.config.notifyOnError) {
      this.notifyError(img, src);
    }

    // Try to retry
    if (this.retryCount.get(src) < this.maxRetries) {
      this.retryImage(img, src);
    } else {
      this.finalizeError(img, src, error);
    }

    // Trigger error event for other systems
    this.triggerErrorEvent(img, src, error);
  }

  // Retry image loading
  retryImage(img, src) {
    const currentRetries = this.retryCount.get(src) || 0;
    this.retryCount.set(src, currentRetries + 1);

    setTimeout(() => {
      // Try different URLs
      const altSrc = this.getAlternativeSrc(src);
      if (altSrc) {
        img.src = altSrc;
      } else {
        // Just retry with the same URL
        const tempSrc = `${src}?retry=${currentRetries}`;
        img.src = tempSrc;
      }
    }, this.config.retryDelay);
  }

  // Get alternative source
  getAlternativeSrc(originalSrc) {
    // Try different CDN URLs
    const cdnVariants = [
      originalSrc.replace('panjiamei988-lang.github.io', 'raw.githubusercontent.com'),
      originalSrc.replace('/images/', '/images-optimized/'),
      originalSrc.replace('.png', '.jpg')
    ];

    // Find first working variant
    return cdnVariants.find(v => v !== originalSrc);
  }

  // Finalize error handling
  finalizeError(img, src, error) {
    // Show placeholder or error message
    if (this.config.usePlaceholder) {
      this.showPlaceholder(img, src);
    }

    // Show error message if configured
    if (this.config.showErrorMessage) {
      this.showErrorMessage(img);
    }

    // Update analytics
    this.updateErrorAnalytics(src, error);
  }

  // Show placeholder image
  showPlaceholder(img, src) {
    // Create placeholder content
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
      <div class="placeholder-icon">🖼️</div>
      <div class="placeholder-text">Image not available</div>
    `;

    // Replace image with placeholder
    img.parentNode.replaceChild(placeholder, img);

    // Store reference for future use
    this.fallbackImages.set(src, placeholder);
  }

  // Show error message overlay
  showErrorMessage(img) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-error-wrapper';
    wrapper.style.position = 'relative';

    // Create error message
    const message = document.createElement('div');
    message.className = 'error-message';
    message.textContent = 'Failed to load image';
    message.style.position = 'absolute';
    message.style.bottom = '10px';
    message.style.left = '10px';
    message.style.background = 'rgba(0, 0, 0, 0.8)';
    message.style.color = 'white';
    message.style.padding = '5px 10px';
    message.style.borderRadius = '4px';
    message.style.fontSize = '12px';
    message.style.zIndex = '10';

    img.parentNode.appendChild(wrapper);
    wrapper.appendChild(img);
    wrapper.appendChild(message);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transition = 'opacity 1s';
    }, 5000);
  }

  // Mark image as successful
  markImageSuccess(img) {
    img.classList.remove('error');
    img.classList.add('loaded');

    // Clear from error cache
    this.errorCache.delete(img.src);
    this.retryCount.delete(img.src);
  }

  // Setup fallback images
  setupFallbackImages() {
    // Define fallbacks for specific projects
    this.fallbackImages.set('https://panjiamei988-lang.github.io/portfolio-images/images/images-074.png', {
      type: 'category',
      category: 'wellness'
    });

    this.fallbackImages.set('https://panjiamei988-lang.github.io/portfolio-images/images/images-018.png', {
      type: 'category',
      category: 'automotive'
    });

    // Generic fallback
    this.genericFallback = {
      type: 'svg',
      data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVhNWY1Ii8+PHJlY3QgeD0iLTEwMCUiIHk9IjEwMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM2MDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNDA0ZWZiIj5UaGUgSW1hZ2UgaXMgZmFtaWx5PC90ZXh0Pjwvc3ZnPg=='
    };
  }

  // Setup retry mechanism
  setupRetryMechanism() {
    // Exponential backoff
    window.addEventListener('offline', () => {
      this.config.retryDelay = 5000; // Increase delay when offline
    });

    window.addEventListener('online', () => {
      this.config.retryDelay = 2000; // Reset when online
    });
  }

  // Setup notification system
  setupNotificationSystem() {
    // Create notification container
    if (!document.getElementById('error-notifications')) {
      const container = document.createElement('div');
      container.id = 'error-notifications';
      container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
      `;
      document.body.appendChild(container);
    }
  }

  // Notify user about errors
  notifyError(img, src) {
    const container = document.getElementById('error-notifications');

    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-icon">⚠️</div>
      <div class="error-details">
        <div class="error-title">Image failed to load</div>
        <div class="error-desc">Some images might not display correctly</div>
      </div>
      <button class="error-dismiss">×</button>
    `;

    // Style notification
    Object.assign(notification.style, {
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideIn 0.3s ease'
    });

    // Add dismiss button
    const dismissBtn = notification.querySelector('.error-dismiss');
    dismissBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      margin-left: auto;
    `;

    dismissBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });

    container.appendChild(notification);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        dismissBtn.click();
      }
    }, 10000);
  }

  // Log error to console
  logError(src, error) {
    console.group(`❌ Image Error: ${src}`);
    console.error('Failed to load:', error);
    console.warn('Retries attempted:', this.retryCount.get(src) || 0);
    console.groupEnd();
  }

  // Trigger error event
  triggerErrorEvent(img, src, error) {
    const event = new CustomEvent('imageError', {
      detail: {
        src,
        img,
        error,
        timestamp: Date.now()
      }
    });

    document.dispatchEvent(event);
  }

  // Setup error analytics
  setupErrorAnalytics() {
    this.errorStats = {
      total: 0,
      byDomain: new Map(),
      byTime: new Map(),
      types: new Map()
    };

    // Listen for error events
    document.addEventListener('imageError', (event) => {
      this.trackError(event.detail);
    });
  }

  // Track error statistics
  trackError(errorData) {
    this.errorStats.total++;

    // By domain
    const domain = new URL(errorData.src).hostname;
    this.errorStats.byDomain.set(
      domain,
      (this.errorStats.byDomain.get(domain) || 0) + 1
    );

    // By time (last hour)
    const hour = new Date().getHours();
    this.errorStats.byTime.set(
      hour,
      (this.errorStats.byTime.get(hour) || 0) + 1
    );

    // Update display
    this.updateErrorDisplay();
  }

  // Update error display
  updateErrorDisplay() {
    if (this.errorStats.total > 5) {
      console.warn(`High error rate detected: ${this.errorStats.total} errors`);

      // Show summary in dev tools
      console.group('📊 Error Summary');
      console.log('Total:', this.errorStats.total);
      console.log('By domain:', Object.fromEntries(this.errorStats.byDomain));
      console.log('By hour:', Object.fromEntries(this.errorStats.byTime));
      console.groupEnd();
    }
  }

  // Update error analytics
  updateErrorAnalytics(src, error) {
    // Store error details
    const errorDetail = {
      src,
      error: error.message,
      timestamp: Date.now(),
      retries: this.retryCount.get(src) || 0
    };

    // Save to localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('imageErrors') || '[]');
    errors.push(errorDetail);

    // Keep only last 100 errors
    if (errors.length > 100) {
      errors.shift();
    }

    localStorage.setItem('imageErrors', JSON.stringify(errors));
  }

  // Get error statistics
  getErrorStats() {
    return {
      total: this.errorStats.total,
      domains: Object.fromEntries(this.errorStats.byDomain),
      recentErrors: JSON.parse(localStorage.getItem('imageErrors') || '[]').slice(-10)
    };
  }

  // Clear error cache
  clearErrorCache() {
    this.errorCache.clear();
    this.retryCount.clear();
    console.log('Error cache cleared');
  }
}

// ==================== ENHANCED ERROR RECOVERY ====================
class ErrorRecoverySystem {
  constructor(errorHandler) {
    this.errorHandler = errorHandler;
    this.recoveryStrategies = new Map();

    this.init();
  }

  init() {
    this.setupRecoveryStrategies();
    this.setupAutoRetry();
    this.setupManualRetry();
  }

  // Setup different recovery strategies
  setupRecoveryStrategies() {
    // Strategy 1: Try CDN fallback
    this.recoveryStrategies.set('cdn-fallback', async (src) => {
      const cdnUrl = src.replace('panjiamei988-lang.github.io', 'cdn.jsdelivr.net/gh');
      try {
        const response = await fetch(cdnUrl, { method: 'HEAD' });
        if (response.ok) return cdnUrl;
      } catch (e) {
        console.log('CDN fallback failed:', e);
      }
      return null;
    });

    // Strategy 2: Try different format
    this.recoveryStrategies.set('format-change', async (src) => {
      if (src.includes('.png')) {
        return src.replace('.png', '.jpg');
      } else if (src.includes('.jpg')) {
        return src.replace('.jpg', '.png');
      }
      return null;
    });

    // Strategy 3: Try compressed version
    this.recoveryStrategies.set('compressed', async (src) => {
      const url = new URL(src);
      url.searchParams.set('q', '50');
      return url.toString();
    });
  }

  // Setup automatic retry
  setupAutoRetry() {
    // Retry failed images when network is available
    window.addEventListener('online', () => {
      const failedImages = document.querySelectorAll('img.error');
      failedImages.forEach(img => {
        setTimeout(() => {
          this.attemptRecovery(img);
        }, 1000);
      });
    });
  }

  // Setup manual retry button
  setupManualRetry() {
    // Add retry button to error notifications
    document.addEventListener('click', (e) => {
      if (e.target.matches('.retry-image')) {
        const src = e.target.dataset.src;
        this.attemptRecoveryBySrc(src);
      }
    });
  }

  // Attempt recovery for image
  async attemptRecovery(img) {
    const src = img.src;

    for (const [strategyName, strategy] of this.recoveryStrategies) {
      try {
        const newSrc = await strategy(src);
        if (newSrc) {
          img.src = newSrc;
          img.classList.remove('error');
          img.classList.add('recovered');
          console.log(`Image recovered using ${strategyName}:`, newSrc);
          return true;
        }
      } catch (e) {
        console.log(`${strategyName} failed:`, e);
      }
    }

    return false;
  }

  // Attempt recovery by source
  async attemptRecoveryBySrc(src) {
    // Find images with this source
    const images = document.querySelectorAll(`img[src="${src}"]`);
    let recovered = false;

    for (const img of images) {
      const success = await this.attemptRecovery(img);
      if (success) recovered = true;
    }

    return recovered;
  }
}

// ==================== CSS STYLES FOR ERROR HANDLING ====================
const errorStyles = `
  .image-placeholder {
    position: relative;
    background: #1a1a1a;
    border: 2px dashed #333;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: #666;
  }

  .placeholder-icon {
    font-size: 48px;
    margin-bottom: 10px;
    opacity: 0.5;
  }

  .placeholder-text {
    font-size: 14px;
    text-align: center;
    padding: 0 20px;
  }

  .error-notification {
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  img.error {
    opacity: 0.3;
    filter: grayscale(100%);
  }

  img.recovered {
    animation: pulse 0.5s ease;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Add styles to head
const styleElement = document.createElement('style');
styleElement.textContent = errorStyles;
document.head.appendChild(styleElement);

// ==================== EXPORT FOR MODULAR LOADING ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ImageErrorHandler,
    ErrorRecoverySystem
  };
}

// ==================== STANDALONE INITIALIZATION ====================
if (typeof document !== 'undefined') {
  // Initialize only when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize error handler
    const errorHandler = new ImageErrorHandler();

    // Initialize recovery system
    const recoverySystem = new ErrorRecoverySystem(errorHandler);

    // Log initialization
    console.log('Error handling system initialized');
    console.log('Error stats:', errorHandler.getErrorStats());
  });
}