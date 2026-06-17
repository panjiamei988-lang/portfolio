// ==================== RESPONSIVE GRID SYSTEM ====================
class ResponsiveGridSystem {
  constructor() {
    this.gridContainers = new Map();
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1440
    };
    this.currentBreakpoint = this.getCurrentBreakpoint();

    this.init();
  }

  init() {
    this.setupGridContainers();
    this.setupResponsiveHandler();
    this.setupGridAnimations();
    this.setupMasonry();
  }

  // Get current breakpoint
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= this.breakpoints.mobile) return 'mobile';
    if (width <= this.breakpoints.tablet) return 'tablet';
    return 'desktop';
  }

  // Setup grid containers
  setupGridContainers() {
    const grids = document.querySelectorAll('.responsive-grid');
    grids.forEach(grid => {
      this.setupGrid(grid);
    });
  }

  // Setup individual grid
  setupGrid(grid) {
    const id = `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    grid.setAttribute('data-grid-id', id);

    this.gridContainers.set(id, {
      element: grid,
      items: Array.from(grid.children),
      layout: grid.dataset.layout || 'masonry',
      columns: this.getColumnsForBreakpoint(grid.dataset.columns)
    });

    // Apply initial layout
    this.applyLayout(grid);
  }

  // Get columns for breakpoint
  getColumnsForBreakpoint(config) {
    if (typeof config === 'number') return config;

    const configs = {
      mobile: this.parseColumns(config?.mobile || 1),
      tablet: this.parseColumns(config?.tablet || 2),
      desktop: this.parseColumns(config?.desktop || 3)
    };

    return configs[this.currentBreakpoint] || configs.desktop;
  }

  // Parse column configuration
  parseColumns(config) {
    if (typeof config === 'number') return config;

    switch(config) {
      case 'auto': return 'auto';
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      case 'quad': return 4;
      default: return 3;
    }
  }

  // Apply grid layout
  applyLayout(grid) {
    const gridData = this.gridContainers.get(grid.dataset.gridId);
    if (!gridData) return;

    const { items, columns } = gridData;

    // Set grid template
    if (typeof columns === 'number') {
      grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      grid.style.gridAutoRows = 'auto';

      // Reset items
      items.forEach(item => {
        item.style.gridRow = 'auto';
        item.style.gridColumn = 'auto';
      });
    } else if (columns === 'auto') {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
      grid.style.gridAutoRows = '1fr';
    }

    // Apply specific item positions for masonry
    if (gridData.layout === 'masonry') {
      this.applyMasonryLayout(grid);
    }
  }

  // Apply masonry layout
  applyMasonryLayout(grid) {
    const gridData = this.gridContainers.get(grid.dataset.gridId);
    if (!gridData) return;

    const { items, columns } = gridData;
    const columnWidth = typeof columns === 'number' ? 1 / columns : 0.333;
    let columnHeights = new Array(typeof columns === 'number' ? columns : 3).fill(0);

    items.forEach((item, index) => {
      const columnIndex = this.findShortestColumn(columnHeights);
      const row = Math.floor(columnHeights[columnIndex] / 400); // Average item height

      item.style.gridColumn = columnIndex + 1;
      item.style.gridRow = row + 1;

      // Update column height
      const itemHeight = item.offsetHeight;
      columnHeights[columnIndex] += itemHeight;
    });

    // Set grid row height
    const maxRow = Math.max(...columnHeights.map(h => h / 400));
    grid.style.gridAutoRows = '400px';
  }

  // Find shortest column
  findShortestColumn(columnHeights) {
    return columnHeights.indexOf(Math.min(...columnHeights));
  }

  // Setup responsive handler
  setupResponsiveHandler() {
    let resizeTimeout;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newBreakpoint = this.getCurrentBreakpoint();

        if (newBreakpoint !== this.currentBreakpoint) {
          this.currentBreakpoint = newBreakpoint;
          this.handleResize();
        }
      }, 250);
    });
  }

  // Handle window resize
  handleResize() {
    this.gridContainers.forEach((gridData) => {
      const grid = gridData.element;

      // Update columns for new breakpoint
      gridData.columns = this.getColumnsForBreakpoint(grid.dataset.columns);

      // Reapply layout
      this.applyLayout(grid);
    });
  }

  // Setup grid animations
  setupGridAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.children;
          Array.from(items).forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    this.gridContainers.forEach((gridData) => {
      observer.observe(gridData.element);
    });
  }

  // Setup masonry for existing works
  setupMasonry() {
    const worksContainer = document.querySelector('.works-container');
    if (worksContainer && !document.querySelector('.responsive-grid')) {
      // Convert existing works to grid
      this.convertWorksToGrid();
    }
  }

  // Convert works section to responsive grid
  convertWorksToGrid() {
    const worksContainer = document.querySelector('.works-container');
    const workItems = Array.from(worksContainer.children);

    // Create grid wrapper
    const grid = document.createElement('div');
    grid.className = 'responsive-grid';
    grid.dataset.layout = 'masonry';
    grid.dataset.columns = {
      mobile: 1,
      tablet: 2,
      desktop: 2
    };

    // Add items to grid
    workItems.forEach(item => {
      grid.appendChild(item);
    });

    // Replace container
    worksContainer.parentNode.replaceChild(grid, worksContainer);

    // Setup grid
    this.setupGrid(grid);

    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 767px) {
        .responsive-grid[data-layout="masonry"] {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }

      @media (min-width: 768px) and (max-width: 1023px) {
        .responsive-grid[data-layout="masonry"] {
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }
      }

      @media (min-width: 1024px) {
        .responsive-grid[data-layout="masonry"] {
          grid-template-columns: repeat(2, 1fr);
          gap: 4rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add new item to grid
  addItem(gridId, item) {
    const gridData = this.gridContainers.get(gridId);
    if (!gridData) return;

    const grid = gridData.element;
    grid.appendChild(item);
    gridData.items = Array.from(grid.children);

    // Apply layout animation
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';

    setTimeout(() => {
      this.applyLayout(grid);
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100);
  }

  // Remove item from grid
  removeItem(gridId, item) {
    const gridData = this.gridContainers.get(gridId);
    if (!gridData) return;

    const grid = gridData.element;
    grid.removeChild(item);
    gridData.items = Array.from(grid.children);

    // Reapply layout
    this.applyLayout(grid);
  }

  // Update grid configuration
  updateGridConfig(gridId, config) {
    const gridData = this.gridContainers.get(gridId);
    if (!gridData) return;

    Object.assign(gridData, config);
    this.applyLayout(gridData.element);
  }

  // Destroy grid
  destroy(gridId) {
    const gridData = this.gridContainers.get(gridId);
    if (!gridData) return;

    // Reset styles
    gridData.element.style.gridTemplateColumns = '';
    gridData.element.style.gridAutoRows = '';

    gridData.items.forEach(item => {
      item.style.gridColumn = '';
      item.style.gridRow = '';
      item.style.opacity = '';
      item.style.transform = '';
    });

    this.gridContainers.delete(gridId);
  }
}

// ==================== CARD ENHANCEMENT ====================
class CardEnhancer {
  constructor(gridSystem) {
    this.gridSystem = gridSystem;
    this.init();
  }

  init() {
    this.setupCardHoverEffects();
    this.setupCardClickEffects();
    this.setupLazyCardLoading();
  }

  // Setup hover effects
  setupCardHoverEffects() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          const cards = node.querySelectorAll ?
            node.querySelectorAll('.work-item, .grid-item') : [];

          cards.forEach(card => this.enhanceCard(card));
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Enhance individual card
  enhanceCard(card) {
    card.style.position = 'relative';
    card.style.overflow = 'visible';
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)';

    // Reset card states
    card.classList.remove('hovered');
    card.classList.remove('clicked');

    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
      card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
      card.style.zIndex = '';
    });

    card.addEventListener('click', () => {
      card.classList.add('clicked');
      // Add click animation logic here
    });
  }

  // Setup click effects
  setupCardClickEffects() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.work-item, .grid-item')) {
        const card = e.target.closest('.work-item, .grid-item');

        // Ripple effect
        this.createRippleEffect(card, e);

        // Scale effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
      }
    });
  }

  // Create ripple effect
  createRippleEffect(card, e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Setup lazy loading for cards
  setupLazyCardLoading() {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const image = card.querySelector('img');

          if (image && image.getAttribute('loading') === 'lazy') {
            image.src = image.dataset.src || image.src;
          }

          cardObserver.unobserve(card);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.work-item, .grid-item').forEach(card => {
      cardObserver.observe(card);
    });
  }
}

// ==================== EXPORT FOR MODULAR LOADING ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ResponsiveGridSystem,
    CardEnhancer
  };
}

// ==================== STANDALONE INITIALIZATION ====================
if (typeof document !== 'undefined') {
  // Initialize only when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize grid system
    const gridSystem = new ResponsiveGridSystem();

    // Initialize card enhancer
    const cardEnhancer = new CardEnhancer(gridSystem);

    // Log initialization complete
    console.log('Grid System initialized successfully');
  });
}