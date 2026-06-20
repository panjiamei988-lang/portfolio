document.addEventListener('DOMContentLoaded', () => {
  // ==================== 1. 核心首屏高定错层入场动效 (Text Reveal) ====================
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroTagline = document.querySelector('.hero-tagline');

  if (heroTitle && heroSubtitle && heroTagline) {
    // 初始清空与强制硬件加速容器，避免首屏加载时有生硬闪烁
    heroTitle.style.opacity = '1';
    heroSubtitle.style.opacity = '1';
    heroTagline.style.opacity = '1';

    const titleSpan = heroTitle.querySelector('.text-split-row');
    const subtitleSpan = heroSubtitle.querySelector('.text-split-row');

    if (titleSpan) {
      titleSpan.style.display = 'block';
      titleSpan.style.transform = 'translateY(100%)';
      titleSpan.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    if (subtitleSpan) {
      subtitleSpan.style.display = 'block';
      subtitleSpan.style.transform = 'translateY(100%)';
      subtitleSpan.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    
    heroTagline.style.transform = 'translateY(20px)';
    heroTagline.style.opacity = '0';
    heroTagline.style.transition = 'transform 1.0s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)';

    // 触发错层阶梯式（Staggered）动画延迟
    setTimeout(() => {
      if (titleSpan) titleSpan.style.transform = 'translateY(0)';
    }, 150);

    setTimeout(() => {
      if (subtitleSpan) subtitleSpan.style.transform = 'translateY(0)';
    }, 350);

    setTimeout(() => {
      heroTagline.style.transform = 'translateY(0)';
      heroTagline.style.opacity = '1';
    }, 600);
  }

  // ==================== 2. 动态注入高级百叶窗遮罩结构 ====================
  const shutterOverlay = document.createElement('div');
  shutterOverlay.className = 'shutter-transition-overlay';
  
  // 建立 4 个高阶艺术切片
  for (let i = 0; i < 4; i++) {
    const panel = document.createElement('div');
    panel.className = 'shutter-panel';
    shutterOverlay.appendChild(panel);
  }
  document.body.appendChild(shutterOverlay);

  // ==================== 3. 全局兼容性产品卡片点击逻辑 ====================
  // 完美捕获你现有的 .portfolio-card 或是未来扩展的 .work-item 容器
  const projectCards = document.querySelectorAll('.portfolio-card, .work-item');
  let isTransitioning = false; // 锁机制，杜绝二次重合连击的Bug

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // 获取关联数据 ID 属性
      const projectId = card.getAttribute('data-id');
      if (!projectId || isTransitioning) return;

      e.preventDefault();
      isTransitioning = true;
      
      // 激活全屏百叶窗闭合动效
      shutterOverlay.classList.add('is-active');
      
      // 待百叶窗完全合拢并封死视野后（精准控制在 700ms 黄金分割点），切向详情页
      // 借助本地会话缓存告知项目详情页，执行特定入场视觉呈现
      setTimeout(() => {
        sessionStorage.setItem('playDetailsEntrance', 'true');
        window.location.href = `project.html?id=${projectId}`;
      }, 700); 
    });
  });
});