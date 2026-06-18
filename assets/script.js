document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.portfolio-card');

  // 1. 动态在页面中注入百叶窗遮罩的 HTML 结构与样式
  // 这样您就不需要手动去改动 HTML 结构了
  const shutterOverlay = document.createElement('div');
  shutterOverlay.className = 'shutter-transition-overlay';
  
  // 创建 4 个百叶窗切片 (Panels)
  for (let i = 0; i < 4; i++) {
    const panel = document.createElement('div');
    panel.className = 'shutter-panel';
    shutterOverlay.appendChild(panel);
  }
  document.body.appendChild(shutterOverlay);

  // 2. 监听每一个产品卡片的点击事件
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      const projectId = card.getAttribute('data-id');
      
      // 激活百叶窗动画
      shutterOverlay.classList.add('is-active');
      
      // 3. 等待百叶窗完全合拢（动画耗时约 600ms）后，精准切页
      // 使用 sessionStorage 告诉详情页：“我们是从主页点击过来的，请执行内容渐显”
      setTimeout(() => {
        sessionStorage.setItem('playDetailsEntrance', 'true');
        window.location.href = `project.html?id=${projectId}`;
      }, 700); 
    });
  });
});