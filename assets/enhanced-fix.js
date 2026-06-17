// ==================== ENHANCED FIX ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Applying enhanced fixes...');

  // 1. 修复动效 - 使用更自然的缓动函数
  fixAnimations();

  // 2. 添加图片点击跳转
  addImageClickHandlers();

  // 3. 移除红色边框
  removeRedBorders();

  // 4. 优化鼠标悬停效果
  enhanceHoverEffects();

  console.log('✅ Enhanced fixes applied');
});

// 修复动效
function fixAnimations() {
  // 使用更自然的缓动函数
  const style = document.createElement('style');
  style.textContent = `
    /* 自定义缓动函数 - 更自然的动画 */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInStagger {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Hero 文字动画 */
    .hero-title {
      animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
    }

    .hero-subtitle {
      animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s both;
    }

    .hero-tagline {
      animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both;
    }

    /* 项目动画 */
    .work-item {
      opacity: 0;
      animation: fadeInStagger 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    .work-item:nth-child(1) { animation-delay: 0.1s; }
    .work-item:nth-child(2) { animation-delay: 0.2s; }
    .work-item:nth-child(3) { animation-delay: 0.3s; }
    .work-item:nth-child(4) { animation-delay: 0.4s; }
    .work-item:nth-child(5) { animation-delay: 0.5s; }
    .work-item:nth-child(6) { animation-delay: 0.6s; }

    /* 图片悬停效果 */
    .work-image {
      transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .work-item:hover .work-image {
      transform: scale(1.05);
    }

    /* 图片加载动画 */
    img {
      transition: opacity 0.6s ease-in-out;
    }

    img.loaded {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

// 添加图片点击跳转
function addImageClickHandlers() {
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach(item => {
    // 添加点击事件
    item.style.cursor = 'pointer';

    item.addEventListener('click', (e) => {
      e.preventDefault();

      // 获取项目ID
      const projectId = item.getAttribute('data-project');
      if (projectId) {
        // 跳转到项目详情页
        window.location.href = `project.html?id=${projectId}`;

        // 添加点击反馈动画
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
          item.style.transform = '';
        }, 150);
      }
    });

    // 添加悬停提示
    item.addEventListener('mouseenter', () => {
      const title = item.querySelector('.work-title');
      if (title) {
        title.style.textShadow = '0 0 20px rgba(255, 42, 42, 0.5)';
      }
    });

    item.addEventListener('mouseleave', () => {
      const title = item.querySelector('.work-title');
      if (title) {
        title.style.textShadow = 'none';
      }
    });
  });
}

// 移除红色边框和优化cursor样式
function removeRedBorders() {
  // 移除红色边框，优化cursor样式
  const style = document.createElement('style');
  style.textContent = `
    /* 移除所有元素的默认焦点边框 */
    * {
      outline: none !important;
    }

    a, button, input, textarea, select, [tabindex] {
      outline: none !important;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* 添加优雅的焦点效果 */
    a:focus {
      outline: 2px solid rgba(255, 255, 255, 0.2);
      outline-offset: 2px;
    }

    /* 优化cursor样式 - 使用更柔和的颜色 */
    .cursor-follower {
      border-color: rgba(255, 255, 255, 0.3) !important;
    }

    .cursor-follower.hover {
      border-color: rgba(255, 255, 255, 0.6) !important;
      background: rgba(255, 42, 42, 0.05);
    }

    .cursor-text {
      border-color: rgba(255, 255, 255, 0.3) !important;
    }

    /* 移除点击时的默认伪元素 */
    *:focus-visible {
      outline: none;
    }

    /* 点击涟漪效果 */
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// 优化鼠标悬停效果
function enhanceHoverEffects() {
  // 为项目项添加优雅的悬停效果
  const style = document.createElement('style');
  style.textContent = `
    .work-item {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
    }

    .work-item:hover {
      transform: translateY(-10px);
    }

    .work-item:hover .work-image-wrapper {
      border-color: rgba(255, 42, 42, 0.5);
      box-shadow: 0 20px 40px rgba(255, 42, 42, 0.2);
    }

    .work-image-wrapper {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* 添加光晕效果 */
    .work-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(255, 42, 42, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }

    .work-item:hover::before {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}