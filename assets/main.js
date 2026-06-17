// ==================== MAIN INITIALIZATION SCRIPT ====================
class MainApp {
  constructor() {
    this.modules = new Map();
    this.initialized = false;

    this.init();
  }

  init() {
    if (this.initialized) return;

    console.log('🚀 Initializing Main App...');

    // Initialize modules in order
    this.initializeModules();

    // Setup global error handling
    this.setupGlobalErrorHandling();

    // Mark as initialized
    this.initialized = true;

    console.log('✅ Main App initialized successfully');
  }

  async initializeModules() {
    try {
      // Initialize error handler first
      console.log('🔧 Initializing Error Handler...');
      const { ImageErrorHandler } = await import('./error-handler.js');
      this.modules.set('errorHandler', new ImageErrorHandler());

      // Initialize image optimizer
      console.log('🖼️ Initializing Image Optimizer...');
      const { ImageOptimizer, LazyLoadingEnhancer } = await import('./image-optimizer.js');
      const imageOptimizer = new ImageOptimizer();
      this.modules.set('imageOptimizer', imageOptimizer);

      // Initialize lazy loading
      const lazyLoading = new LazyLoadingEnhancer(imageOptimizer);
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        lazyLoading.observe(img);
      });

      // Initialize image system
      console.log('🎨 Initializing Image System...');
      const { ImageSystem, EnhancedParallax, ImageLoadingIndicator } = await import('./image-system.js');
      const imageSystem = new ImageSystem();
      const parallax = new EnhancedParallax(imageSystem);
      const loadingIndicator = new ImageLoadingIndicator(imageSystem);
      this.modules.set('imageSystem', imageSystem);

      // Initialize grid system
      console.log('📐 Initializing Grid System...');
      const { ResponsiveGridSystem, CardEnhancer } = await import('./grid-system.js');
      const gridSystem = new ResponsiveGridSystem();
      const cardEnhancer = new CardEnhancer(gridSystem);
      this.modules.set('gridSystem', gridSystem);

      // Initialize original modules
      console.log('🖱️ Initializing Original Modules...');

      // Dynamically load and initialize original modules
      try {
        // Load script.js dynamically if needed
        if (typeof CursorSystem === 'undefined') {
          await import('./script.js');
        }

        // Check and initialize classes
        if (typeof CursorSystem !== 'undefined') {
          this.modules.set('cursor', new CursorSystem());
        }

        if (typeof ScrollAnimations !== 'undefined') {
          this.modules.set('scrollAnimations', new ScrollAnimations());
        }

        if (typeof ParallaxSystem !== 'undefined') {
          this.modules.set('parallax', new ParallaxSystem());
        }

        if (typeof PageNavigation !== 'undefined') {
          this.modules.set('navigation', new PageNavigation());
        }

        if (typeof ProjectPageHandler !== 'undefined') {
          this.modules.set('projectHandler', new ProjectPageHandler());
        }
      } catch (error) {
        console.error('Failed to load original modules:', error);
      }

      // Add loaded class for smooth transitions
      document.body.classList.add('loaded');

    } catch (error) {
      console.error('❌ Failed to initialize modules:', error);
    }
  }

  setupGlobalErrorHandling() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  // Get module instance
  getModule(name) {
    return this.modules.get(name);
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Start initialization
    const app = new MainApp();

    // Make globally available for debugging
    window.App = app;

    console.log('📊 Module count:', app.modules.size);
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MainApp };
}