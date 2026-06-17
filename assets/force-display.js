// ==================== FORCE DISPLAY - 确保内容立即显示 ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Force display fix running...');

  // 立即显示所有隐藏的内容
  setTimeout(() => {
    // 显示hero标题
    document.querySelector('.hero-title')?.style.setProperty('opacity', '1', 'important');
    document.querySelector('.hero-title')?.style.setProperty('transform', 'translateY(0)', 'important');

    document.querySelector('.hero-subtitle')?.style.setProperty('opacity', '1', 'important');
    document.querySelector('.hero-subtitle')?.style.setProperty('transform', 'translateY(0)', 'important');

    document.querySelector('.hero-tagline')?.style.setProperty('opacity', '1', 'important');
    document.querySelector('.hero-tagline')?.style.setProperty('transform', 'translateY(0)', 'important');

    // 显示所有work items
    document.querySelectorAll('.work-item').forEach(item => {
      item.style.setProperty('opacity', '1', 'important');
      item.style.setProperty('transform', 'translateY(0)', 'important');
    });

    // 显示所有技能
    document.querySelector('.skills-grid')?.style.setProperty('opacity', '1', 'important');
    document.querySelector('.skills-grid')?.style.setProperty('transform', 'translateY(0)', 'important');

    // 确保图片显示
    document.querySelectorAll('.work-image').forEach(img => {
      img.style.setProperty('opacity', '1', 'important');
      img.classList.add('loaded');
    });

    console.log('✅ Force display applied');
  }, 100);
});