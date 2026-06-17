// ==================== MAIN INITIALIZATION SCRIPT ====================
class MainApp {
  constructor() {
    this.modules = new Map();
    this.initialized = false;

    this.init();
  }

  init() {
    if (this.initialized) return;

    console.log('🚀 Initializing Main App with Enhanced Smoothness...');

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
      // 1. 优先加载错误处理器（保持不变，确保稳定性）
      console.log('🔧 Initializing Error Handler...');
      const { ImageErrorHandler } = await import('./error-handler.js');
      this.modules.set('errorHandler', new ImageErrorHandler());

      console.log('📦 Bundling core animations and assets concurrently...');

      // 2. 核心动效与核心优化模块改用【并行加载】，极大缩短首屏白屏和脚本滞后时间
      const [imgOptModule, imgSysModule, gridSysModule] = await Promise.all([
        import('./image-optimizer.js'),
        import('./image-system.js'),
        import('./grid-system.js')
      ]);

      // 初始化图片优化
      const imageOptimizer = new imgOptModule.ImageOptimizer();
      this.modules.set('imageOptimizer', imageOptimizer);

      const lazyLoading = new imgOptModule.LazyLoadingEnhancer(imageOptimizer);
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        lazyLoading.observe(img);
      });

      // 初始化图片系统与视差
      const imageSystem = new imgSysModule.ImageSystem();
      const parallax = new imgSysModule.EnhancedParallax(imageSystem);
      const loadingIndicator = new imgSysModule.ImageLoadingIndicator(imageSystem);
      this.modules.set('imageSystem', imageSystem);

      // 初始化网格系统与高级卡片增强
      const gridSystem = new gridSysModule.ResponsiveGridSystem();
      const cardEnhancer = new gridSysModule.CardEnhancer(gridSystem);
      this.modules.set('gridSystem', gridSystem);

      // 3. 并行加载并立刻激活原生的滚动、鼠标及导航动效，防止用户滚动时动效未就绪
      console.log('🖱️ Injecting Fluid Interactive Modules...');
      
      try {
        if (typeof CursorSystem === 'undefined') {
          await import('./script.js');
        }

        // 收集所有核心动效实例
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
        console.error('Failed to load dynamic interaction modules:', error);
      }

      // 4. 精细控制首屏进场时机：给浏览器留出 50ms 渲染帧，再执行淡入，确保动效丝滑
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.body.classList.add('loaded');
          
          // 触发一个全局事件，通知诸如 ScrollAnimations 等模块刷新它们的位置计算
          window.dispatchEvent(new Event('resize'));
        }, 50);
      });

    } catch (error) {
      console.error('❌ Failed to initialize modules:', error);
    }
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  getModule(name) {
    return this.modules.get(name);
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new MainApp();
    window.App = app;
    console.log('📊 Module count:', app.modules.size);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MainApp };
}