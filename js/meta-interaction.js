// === 浠嶴upabase鍚屾缃戠珯璁剧疆 ===
async function syncSettingsFromSupabase() {
  if (!window.supabase) return;
  const SUPABASE_URL = "https://xyxrwstdhmauwrbrojnr.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_Vu7vCurGlKENUEo2i8cl9w_jHo36hjG";
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data, error } = await sb.from('site_settings').select('*');
    if (error) return;

    data.forEach(function(item) {
      const key = item.key;
      const value = item.value;

      switch(key) {
        case 'site_title':
          document.title = value + ' | 澶ч亾鍏冪伒';
          break;
        case 'site_subtitle':
          // 鎵惧壇鏍囬鍏冪礌锛屾洿鏂?          var subtitle = document.querySelector('.site-subtitle');
          if (subtitle) subtitle.textContent = value;
          break;
        case 'hero_title':
          var heroTitle = document.querySelector('.hero-title, h1');
          if (heroTitle && window.location.pathname === '/home/') {
            heroTitle.textContent = value;
          }
          break;
        case 'hero_subtitle1':
          var sub1 = document.querySelector('.hero-sub1');
          if (sub1) sub1.textContent = value;
          break;
        case 'hero_subtitle2':
          var sub2 = document.querySelector('.hero-sub2');
          if (sub2) sub2.textContent = value;
          break;
        case 'theme_color':
          document.documentElement.style.setProperty('--meta-main', value);
          break;
        case 'layout_width':
          document.body.setAttribute('data-layout', value);
          break;
        case 'font_style':
          document.body.setAttribute('data-font', value);
          break;
        case 'card_style':
          document.body.setAttribute('data-card', value);
          break;
      }
    });
  } catch(e) {
    console.log('鍚屾璁剧疆澶辫触:', e);
  }
}

// 椤甸潰鍔犺浇鏃跺悓姝?document.addEventListener('DOMContentLoaded', function() {
  syncSettingsFromSupabase();
});
// === 鎬ц兘浼樺寲 ===
// 鑺傛祦鍑芥暟
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

// 浼樺厛浣跨敤passive浜嬩欢鐩戝惉
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
// === 杩涢樁鏁堟灉 ===
document.addEventListener('DOMContentLoaded', function() {
  // 6. 绮掑瓙鑳屾櫙
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

  // 7. 榧犳爣璺熼殢鍏夌幆
  var glow = document.createElement('div');
  glow.className = 'meta-cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // 8. 鏍囬閫愬瓧鍔ㄧ敾
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

  // 9. 婊氬姩瑙嗗樊锛堜晶杈规爮锛?  var sidebar = document.getElementById('aside-content');
  if (sidebar) {
    window.addEventListener('scroll', function() {
      var scrolled = window.pageYOffset;
      sidebar.style.transform = 'translateY(' + scrolled * 0.1 + 'px)';
    }, { passive: true });
  }
});
// === 鏆楅粦/浜壊妯″紡鍒囨崲鎸夐挳 ===
document.addEventListener('DOMContentLoaded', function() {
  // 浠巐ocalStorage璇诲彇鍋忓ソ
  const savedTheme = localStorage.getItem('meta_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }

  // 鍒涘缓鍒囨崲鎸夐挳
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'meta-theme-toggle';
  toggleBtn.innerHTML = savedTheme === 'dark' ? '鈽€锔? : '馃寵';
  toggleBtn.title = '鍒囨崲鏄庢殫妯″紡';
  toggleBtn.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    cursor: pointer;
    z-index: 999;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    box-shadow: var(--shadow-glass);
  `;

  toggleBtn.addEventListener('click', function() {
    if (document.body.hasAttribute('data-theme')) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('meta_theme', 'light');
      toggleBtn.innerHTML = '馃寵';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('meta_theme', 'dark');
      toggleBtn.innerHTML = '鈽€锔?;
    }
  });

  document.body.appendChild(toggleBtn);
});

// === 3D鍏夋爣鍏夌幆 ===
document.addEventListener('DOMContentLoaded', function() {
  var cursor = document.createElement('div');
  cursor.className = 'meta-3d-cursor';
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
});
// === 婊氬姩椹卞姩3D鏁堟灉锛堝ぇ鍘備氦浜掞級===
document.addEventListener('DOMContentLoaded', function() {
  var content = document.getElementById('content-inner');
  if (!content) return;
  
  // 婊氬姩鏃跺唴瀹瑰眰杞诲井3D鏃嬭浆
  window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    var progress = scrolled / maxScroll;
    
    // 鏁翠釜鍐呭灞傝交寰?D鍊炬枩
    var rotateY = (progress - 0.5) * 2; // -1搴﹀埌+1搴?    content.style.transform = 'perspective(1200px) rotateY(' + rotateY + 'deg)';
  }, { passive: true });

  // 鏂囩珷鍗＄墖杩涘叆瑙嗗彛鏃剁殑3D缈昏浆鍏ュ満
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

// === 绗?灞傦細閫氫俊铻嶅悎灞?===
// 鍒嗕韩鎸夐挳
document.addEventListener('DOMContentLoaded', function() {
  var article = document.getElementById('article');
  if (!article) return;

  // 鍒涘缓鍒嗕韩鏍?  var shareBar = document.createElement('div');
  shareBar.className = 'meta-share-bar';
  shareBar.innerHTML = `
    <div class="share-item" data-type="wechat">
      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M8.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path fill="currentColor" d="M9.5 4C5.36 4 2 6.91 2 10.5c0 2.08 1.12 3.93 2.86 5.13L4.5 18l2.87-1.5c.67.17 1.38.27 2.13.27.25 0 .5-.01.74-.04-.15-.47-.24-.96-.24-1.48 0-3.31 3.13-6 7-6 .27 0 .53.02.79.05C16.1 6.19 13.03 4 9.5 4z"/><path fill="currentColor" d="M22 15.5c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.66 0 1.3-.09 1.89-.26L19 21l-.55-1.65C20.08 18.32 22 17.02 22 15.5z"/></svg>
      <span>寰俊</span>
    </div>
    <div class="share-item" data-type="weibo">
      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M10.1 13.4c-.3-.1-.6-.2-.9-.1-.3.1-.5.4-.4.7.1.3.4.5.7.4.3-.1.5-.4.6-.7.1-.2.1-.3 0-.3zm-1.2-.3c-.1 0-.2 0-.3.1-.1.1-.2.3-.1.4.1.1.3.2.4.1.1-.1.2-.3.1-.4 0-.1 0-.2-.1-.2zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.5 11.5c-.2.5-.7.9-1.3 1-.6.1-1.2 0-1.7-.3-.5-.3-.9-.8-1-1.4-.1-.6.1-1.2.5-1.6.4-.4.9-.7 1.5-.8.6-.1 1.2 0 1.7.3.5.3.9.8 1 1.4.1.5-.1 1-.3 1.4zm-2.8 3.3c-.6.6-1.5.9-2.3.8-.9-.1-1.6-.6-2-1.3-.4-.7-.4-1.6 0-2.3.4-.7 1.1-1.2 1.9-1.3.8-.1 1.6.2 2.2.7.6.5.9 1.2.8 2-.1.5-.3 1-.6 1.3z"/></svg>
      <span>寰崥</span>
    </div>
    <div class="share-item" data-type="copy">
      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 14H4V3h12v12zm-4-5l-4 4-2-2 1.4-1.4L8 11l2.6-2.6L12 10zM20 7v14c0 1.1-.9 2-2 2H6v-2h12V7h2z"/></svg>
      <span>澶嶅埗閾炬帴</span>
    </div>
    <div class="like-btn" id="meta-like-btn">
      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <span id="meta-like-count">0</span>
      <span class="like-text">鍠滄</span>
    </div>
  `;

  // 鎻掑叆鍒版枃绔犲簳閮?  var articleContent = document.getElementById('article-content');
  if (articleContent) {
    articleContent.parentNode.insertBefore(shareBar, articleContent.nextSibling);
  }

  // 鍒嗕韩鍔熻兘
  document.querySelectorAll('.share-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var type = this.dataset.type;
      var url = window.location.href;
      var title = document.title;

      if (type === 'wechat') {
        alert('璇峰鍒堕摼鎺ュ悗鍒嗕韩鍒板井淇?);
      } else if (type === 'weibo') {
        window.open('https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title), '_blank');
      } else if (type === 'copy') {
        navigator.clipboard.writeText(url).then(function() {
          var text = item.querySelector('span');
          var oldText = text.textContent;
          text.textContent = '宸插鍒?;
          setTimeout(function() { text.textContent = oldText; }, 2000);
        });
      }
    });
  });

  // 鐐硅禐鍔熻兘
  var likeBtn = document.getElementById('meta-like-btn');
  var likeCount = document.getElementById('meta-like-count');
  var pageKey = 'meta_like_' + window.location.pathname;

  // 璇诲彇鐐硅禐鏁?  var count = parseInt(localStorage.getItem(pageKey + '_count') || '0');
  var liked = localStorage.getItem(pageKey + '_liked') === '1';
  likeCount.textContent = count;
  if (liked) likeBtn.classList.add('liked');

  likeBtn.addEventListener('click', function() {
    if (liked) {
      count--;
      liked = false;
      likeBtn.classList.remove('liked');
    } else {
      count++;
      liked = true;
      likeBtn.classList.add('liked');
    }
    likeCount.textContent = count;
    localStorage.setItem(pageKey + '_count', count);
    localStorage.setItem(pageKey + '_liked', liked ? '1' : '0');
  });
});

// === 绗?灞傦細閫氫俊铻嶅悎灞?- Supabase鎺ュ叆 ===
// Supabase閰嶇疆
const SUPABASE_URL = "https://xyxrwstdhmauwrbrojnr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Vu7vCurGlKENUEo2i8cl9w_jHo36hjG";
const { createClient: createSupabaseClient } = window.supabase;
const sb = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 璁垮缁熻
document.addEventListener('DOMContentLoaded', async function() {
  try {
    const { error } = await sb
      .from('visits')
      .insert([{ path: window.location.pathname }]);
    if (error) console.log('璁垮缁熻:', error.message);
  } catch (e) {
    console.log('璁垮缁熻璺宠繃:', e.message);
  }
});

// 鐐硅禐鍔熻兘鎺ュ叆Supabase锛堟浛鎹ocalStorage鐗堟湰锛?document.addEventListener('DOMContentLoaded', async function() {
  var likeBtn = document.getElementById('meta-like-btn');
  if (!likeBtn) return;

  var likeCount = document.getElementById('meta-like-count');
  var pagePath = window.location.pathname;
  var pageKey = 'meta_like_' + pagePath;
  var liked = localStorage.getItem(pageKey + '_liked') === '1';

  // 浠嶴upabase璇诲彇鐐硅禐鏁?  try {
    var { data, error } = await sb
      .from('likes')
      .select('count')
      .eq('post_path', pagePath)
      .single();

    if (data) {
      likeCount.textContent = data.count;
    } else {
      // 娌℃湁璁板綍锛屾彃鍏ユ柊鐨?      await sb.from('likes').insert([{ post_path: pagePath, count: 0 }]);
      likeCount.textContent = '0';
    }
  } catch (e) {
    console.log('璇诲彇鐐硅禐澶辫触:', e.message);
    likeCount.textContent = localStorage.getItem(pageKey + '_count') || '0';
  }

  // 宸茬偣璧炵姸鎬?  if (liked) {
    likeBtn.classList.add('liked');
  }

  // 鐐瑰嚮鐐硅禐
  likeBtn.addEventListener('click', async function() {
    var currentCount = parseInt(likeCount.textContent) || 0;

    if (liked) {
      currentCount--;
      liked = false;
      likeBtn.classList.remove('liked');
    } else {
      currentCount++;
      liked = true;
      likeBtn.classList.add('liked');
    }

    likeCount.textContent = currentCount;
    localStorage.setItem(pageKey + '_liked', liked ? '1' : '0');

    // 鏇存柊Supabase
    try {
      await sb
        .from('likes')
        .update({ count: currentCount, updated_at: new Date().toISOString() })
        .eq('post_path', pagePath);
    } catch (e) {
      console.log('鏇存柊鐐硅禐澶辫触:', e.message);
    }
  });
});

// === 璇勮绯荤粺 - 鍩轰簬Supabase ===
document.addEventListener('DOMContentLoaded', async function() {
  var article = document.getElementById('article-content');
  if (!article) return;

  var pagePath = window.location.pathname;

  // 鍒涘缓璇勮鍖?  var commentSection = document.createElement('div');
  commentSection.className = 'meta-comment-section';
  commentSection.innerHTML = `
    <h3 class="comment-title">馃挰 鐣欒█</h3>
    <div class="comment-form">
      <input type="text" id="comment-author" placeholder="浣犵殑鏄电О锛堝彲鍖垮悕锛? class="comment-input">
      <textarea id="comment-content" placeholder="鍐欎笅浣犵殑鎯虫硶..." class="comment-textarea"></textarea>
      <button id="comment-submit" class="comment-btn">鍙戣〃鐣欒█</button>
    </div>
    <div class="comment-list" id="comment-list">
      <p class="comment-loading">鍔犺浇涓?..</p>
    </div>
  `;

  article.parentNode.insertBefore(commentSection, article.nextSibling.nextSibling);

  // 鍔犺浇璇勮
  async function loadComments() {
    var list = document.getElementById('comment-list');
    list.innerHTML = '<p class="comment-loading">鍔犺浇涓?..</p>';

    try {
      var { data, error } = await sb
        .from('comments')
        .select('*')
        .eq('post_path', pagePath)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        list.innerHTML = '<p class="comment-empty">鏆傛棤鐣欒█锛屾潵鍐欑涓€鏉″惂</p>';
        return;
      }

      list.innerHTML = '';
      data.forEach(function(comment) {
        var item = document.createElement('div');
        item.className = 'comment-item';
        var date = new Date(comment.created_at).toLocaleString('zh-CN');
        item.innerHTML = `
          <div class="comment-header">
            <span class="comment-author">${comment.author || '鍖垮悕'}</span>
            <span class="comment-date">${date}</span>
          </div>
          <div class="comment-body">${comment.content}</div>
        `;
        list.appendChild(item);
      });
    } catch (e) {
      list.innerHTML = '<p class="comment-error">鍔犺浇澶辫触锛? + e.message + '</p>';
    }
  }

  loadComments();

  // 鎻愪氦璇勮
  var submitBtn = document.getElementById('comment-submit');
  submitBtn.addEventListener('click', async function() {
    var authorInput = document.getElementById('comment-author');
    var contentInput = document.getElementById('comment-content');

    var author = authorInput.value.trim() || '鍖垮悕';
    var content = contentInput.value.trim();

    if (!content) {
      alert('璇疯緭鍏ョ暀瑷€鍐呭');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '鍙戣〃涓?..';

    try {
      var { error } = await sb
        .from('comments')
        .insert([{
          post_path: pagePath,
          author: author,
          content: content
        }]);

      if (error) throw error;

      contentInput.value = '';
      loadComments();
    } catch (e) {
      alert('鍙戣〃澶辫触锛? + e.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '鍙戣〃鐣欒█';
    }
  });
});
