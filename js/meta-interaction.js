// === 性能优化 ===
// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// 优先使用passive事件监听
const passiveListener = { passive: true };
document.addEventListener('DOMContentLoaded',function(){
  var s=document.createElement('div');
  s.style.cssText='position:fixed;top:0;left:0;height:2px;background:#689F89;box-shadow:0 0 10px rgba(104,159,137,0.6);z-index:9999;transition:width .1s;';
  document.body.appendChild(s);
  window.addEventListener('scroll', throttle(function(){
    var h=document.documentElement;
    var p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
    s.style.width=p+'%';
  });
  var g1=document.createElement('div');g1.className='meta-glow green';
  var g2=document.createElement('div');g2.className='meta-glow blue';
  document.body.appendChild(g1);document.body.appendChild(g2);
  document.addEventListener('mousemove',function(e){
    var x=(e.clientX/window.innerWidth-0.5)*60;
    var y=(e.clientY/window.innerHeight-0.5)*60;
    g1.style.transform='translate('+x+'px,'+y+'px)';
    g2.style.transform='translate('+(-x)+'px,'+(-y)+'px)';
  });
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){entry.target.classList.add('visible');}
    });
  },{threshold:0.1});
  document.querySelectorAll('#recent-posts>.recent-post-item,#aside-content .card-widget,#article-container .tool-card').forEach(function(el,i){
    el.classList.add('fade-in-up');
    el.style.transitionDelay=(i*0.08)+'s';
    observer.observe(el);
  });
  document.querySelectorAll('#article-container .tool-card').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var x=e.clientX-rect.left;var y=e.clientY-rect.top;
      var cx=rect.width/2;var cy=rect.height/2;
      var rx=((y-cy)/cy)*-6;var ry=((x-cx)/cx)*6;
      card.style.transform='perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-8px)';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
  document.querySelectorAll('#recent-posts>.recent-post-item').forEach(function(item){
    item.addEventListener('mousemove',function(e){
      var rect=item.getBoundingClientRect();
      var x=e.clientX-rect.left;var y=e.clientY-rect.top;
      var cx=rect.width/2;var cy=rect.height/2;
      var rx=((y-cy)/cy)*-3;var ry=((x-cx)/cx)*3;
      item.style.transform='perspective(1000px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-6px)';
    });
    item.addEventListener('mouseleave',function(){
      item.style.transform='perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
});
// === 进阶效果 ===
document.addEventListener('DOMContentLoaded', function() {
  // 6. 粒子背景
  var canvas = document.createElement('canvas');
  canvas.id = 'meta-particles';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
      if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(104, 159, 137,' + p.opacity + ')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();

  // 7. 鼠标跟随光环
  var glow = document.createElement('div');
  glow.className = 'meta-cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // 8. 标题逐字动画
  document.querySelectorAll('.post-title, #article-container h1').forEach(function(el) {
    var text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function(ch, i) {
      var span = document.createElement('span');
      span.className = 'char-reveal';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.transitionDelay = (i * 0.03) + 's';
      el.appendChild(span);
      setTimeout(function() {
        span.classList.add('visible');
      }, 100);
    });
  });

  // 9. 滚动视差（侧边栏）
  var sidebar = document.getElementById('aside-content');
  if (sidebar) {
    window.addEventListener('scroll', function() {
      var scrolled = window.pageYOffset;
      sidebar.style.transform = 'translateY(' + scrolled * 0.1 + 'px)';
    }, { passive: true });
  }
});
// === 3D光标光环 ===
document.addEventListener('DOMContentLoaded', function() {
  var cursor = document.createElement('div');
  cursor.className = 'meta-3d-cursor';
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
});
// === 滚动驱动3D效果（大厂交互）===
document.addEventListener('DOMContentLoaded', function() {
  var content = document.getElementById('content-inner');
  if (!content) return;
  
  // 滚动时内容层轻微3D旋转
  window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    var progress = scrolled / maxScroll;
    
    // 整个内容层轻微3D倾斜
    var rotateY = (progress - 0.5) * 2; // -1度到+1度
    content.style.transform = 'perspective(1200px) rotateY(' + rotateY + 'deg)';
  }, { passive: true });

  // 文章卡片进入视口时的3D翻转入场
  var postObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#recent-posts > .recent-post-item').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'perspective(1000px) rotateX(5deg) translateY(40px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    postObserver.observe(el);
  });
});