// ==================== MINIMAL FIX - 只修复必要的部分 ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Applying minimal fixes...');

  // 1. 确保图片立即显示
  ensureImagesLoad();

  // 2. 移除焦点边框
  removeFocusOutlines();

  console.log('✅ Minimal fixes applied');
});

// 确保图片加载
function ensureImagesLoad() {
  const images = document.querySelectorAll('.work-image');

  images.forEach(img => {
    // 如果图片还未加载，强制显示
    if (!img.complete) {
      img.style.opacity = '1';
      img.style.transition = 'opacity 0.6s ease';

      // 创建一个新的Image对象来预加载
      const tempImg = new Image();
      tempImg.onload = () => {
        img.classList.add('loaded');
      };
      tempImg.onerror = () => {
        img.classList.add('loaded');
      };
      tempImg.src = img.src;
    } else {
      // 如果已经加载，直接添加loaded类
      img.classList.add('loaded');
      img.style.opacity = '1';
    }
  });
}

// 移除焦点边框和添加悬停效果
function removeFocusOutlines() {
  // 添加CSS来移除所有默认焦点样式并添加优雅的悬停效果
  const style = document.createElement('style');
  style.textContent = `
    /* 移除默认焦点轮廓 */
    *:focus {
      outline: none !important;
    }

    /* 移除点击时的边框 */
    button:focus,
    a:focus,
    input:focus,
    textarea:focus,
    select:focus {
      outline: none !important;
      box-shadow: none !important;
    }

    /* 添加柔和的焦点效果 */
    a:focus {
      outline: 2px solid rgba(255, 255, 255, 0.1);
      outline-offset: 2px;
    }

    /* Work-item 悬停效果 */
    .work-item {
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .work-item:hover {
      transform: translateY(-10px);
    }

    .work-item:hover .work-image-wrapper {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px rgba(255, 42, 42, 0.1);
    }

    .work-item:hover .work-title {
      text-shadow: 0 0 20px rgba(255, 42, 42, 0.3);
    }

    /* 点击反馈 */
    .work-item:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);
}