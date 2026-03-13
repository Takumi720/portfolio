// GSAP初期化
gsap.registerPlugin(ScrollTrigger);

// DOMContentLoaded イベント
document.addEventListener('DOMContentLoaded', function() {
    
    // ローディングアニメーション
    initLoading();
    
    // 蛍アニメーションの初期化
    initFirefliesAnimation();
    
    // ハンバーガーメニューの制御
    initHamburgerMenu();
    
    // Swiperスライダーの初期化
    initSwipers();
    
    // スムーズスクロール
    initSmoothScroll();
    
    // ページ読み込み時のハッシュスクロール
    initHashScroll();
    
    // ニュースフィルター
    initNewsFilter();
    
    // フェードアップアニメーション（GSAP + ScrollTrigger）
    initFadeUpAnimation();
    
    // その他のGSAPアニメーション
    initGSAPAnimations();
});

// ローディングアニメーション（初回のみ）
function initLoading() {
    const loading = document.getElementById('loading');
    if (!loading) return;
    
    // セッションストレージで初回表示を管理
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    
    if (hasLoaded) {
        // 2回目以降は即座に非表示
        loading.classList.add('loaded');
    } else {
        // 初回は少し待ってから非表示
        window.addEventListener('load', function() {
            setTimeout(function() {
                loading.classList.add('loaded');
                sessionStorage.setItem('hasLoaded', 'true');
            }, 800);
        });
    }
}

// 蛍のように点滅する正円のアニメーション
function initFirefliesAnimation() {
    const canvas = document.getElementById('firefliesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Canvasサイズをウィンドウサイズに合わせる
    function resizeCanvas() {
        const mvBg = canvas.parentElement;
        canvas.width = mvBg.offsetWidth;
        canvas.height = mvBg.offsetHeight;
        // スタイルでも明示的にサイズを設定（正円を保証）
        canvas.style.width = mvBg.offsetWidth + 'px';
        canvas.style.height = mvBg.offsetHeight + 'px';
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // パーティクル（蛍）クラス
    class Firefly {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 80 + 40; // 40-120pxの大きな正円
            this.opacity = 0;
            this.fadeSpeed = Math.random() * 0.006 + 0.003; // ゆっくり点滅
            this.fadeDirection = 1;
            this.maxOpacity = Math.random() * 0.3 + 0.2; // 0.2-0.5の透明度
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            // 白に近い色（アイボリー、淡いベージュ、淡いグレー）
            const colors = [
                'rgba(255, 255, 255, ',     // 純白
                'rgba(250, 250, 245, ',     // アイボリー
                'rgba(245, 245, 240, ',     // 淡いベージュ
                'rgba(248, 248, 243, ',     // オフホワイト
                'rgba(255, 253, 250, ',     // クリーム
                'rgba(214, 233, 202, ',     // 白緑
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            // フェードイン・フェードアウト
            this.opacity += this.fadeSpeed * this.fadeDirection;
            
            if (this.opacity >= this.maxOpacity) {
                this.fadeDirection = -1;
            } else if (this.opacity <= 0) {
                this.fadeDirection = 1;
                // 完全に消えたら新しい位置に移動
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.maxOpacity = Math.random() * 0.3 + 0.2;
            }
        }
        
        draw() {
            ctx.beginPath();
            // 正円を描画
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
            ctx.closePath();
        }
    }
    
    // パーティクルを生成
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 100000); // 画面サイズに応じて数を調整
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Firefly());
        }
    }
    createParticles();
    
    // ウィンドウリサイズ時にパーティクル数を再調整
    window.addEventListener('resize', function() {
        const newCount = Math.floor((canvas.width * canvas.height) / 100000);
        if (newCount > particles.length) {
            for (let i = particles.length; i < newCount; i++) {
                particles.push(new Firefly());
            }
        } else if (newCount < particles.length) {
            particles = particles.slice(0, newCount);
        }
    });
    
    // アニメーションループ
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

// ハンバーガーメニューの制御（タブレット・SP専用）
function initHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const globalMenu = document.getElementById('globalMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.global-menu a');
    
    if (!menuToggle || !globalMenu || !menuOverlay) return;
    
    // ハンバーガーボタンでメニューを開閉（タブレット・SPのみ）
    menuToggle.addEventListener('click', function() {
        if (window.innerWidth <= 1199) {
            const isOpen = globalMenu.classList.contains('is-open');
            
            if (isOpen) {
                closeMenu();
            } else {
                globalMenu.classList.add('is-open');
                menuOverlay.classList.add('is-open');
                menuToggle.classList.add('is-active');
            }
        }
    });
    
    // メニューを閉じる
    function closeMenu() {
        globalMenu.classList.remove('is-open');
        menuOverlay.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
    }
    
    // リンクをクリックしたらメニューを閉じる
    menuLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });
    
    // オーバーレイをクリックしたら閉じる
    menuOverlay.addEventListener('click', closeMenu);
}

// Swiperスライダーの初期化
function initSwipers() {
    // セクション01のスライダー
    const sec01Slider = document.querySelector('.sec-01-slider');
    if (sec01Slider) {
        new Swiper('.sec-01-slider', {
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: true,
            loopedSlides: 5,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            speed: 12000,
            freeMode: true,
            freeModeMomentum: false,
            allowTouchMove: false,
        });
    }
    
    // 下部スライダー
    const bottomSlider = document.querySelector('.bottom-slider');
    if (bottomSlider) {
        new Swiper('.bottom-slider', {
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: true,
            loopedSlides: 5,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            speed: 12000,
            freeMode: true,
            freeModeMomentum: false,
            allowTouchMove: false,
        });
    }
}

// スムーズスクロール
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // アンカーリンクの場合
            if (href && href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ロゴクリックでページトップへ
    const logoLink = document.querySelector('.header-logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // index.htmlの場合、現在のページならページトップへスクロール
            if (href === 'index.html' && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ページ読み込み時にURLのハッシュがあればスクロール
function initHashScroll() {
    const hash = window.location.hash;
    if (hash) {
        // 画像などのリソース読み込みを待つ
        window.addEventListener('load', function() {
            const target = document.querySelector(hash);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ニュースフィルター機能
function initNewsFilter() {
    const filterButtons = document.querySelectorAll('.news-nav-list li');
    const newsItems = document.querySelectorAll('.news-item');
    
    // 要素が存在しない場合は処理を抜ける
    if (filterButtons.length === 0 || newsItems.length === 0) return;
    
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // activeクラスの切り替え
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // フィルタリング処理
            const category = this.textContent.trim().toLowerCase();
            
            newsItems.forEach(function(item) {
                if (category === 'all') {
                    // ALLの場合は全て表示
                    item.style.display = 'block';
                    // フェードイン効果
                    item.style.opacity = '0';
                    setTimeout(function() {
                        item.style.opacity = '1';
                    }, 10);
                } else {
                    // カテゴリーが一致するものだけ表示
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === category) {
                        item.style.display = 'block';
                        // フェードイン効果
                        item.style.opacity = '0';
                        setTimeout(function() {
                            item.style.opacity = '1';
                        }, 10);
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// フェードアップアニメーション（GSAP + ScrollTrigger）
function initFadeUpAnimation() {
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    fadeUpElements.forEach(function(element) {
        gsap.fromTo(element,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top -10%',
                    toggleActions: 'play none play reset'
                }
            }
        );
    });
}

// その他のGSAPアニメーション
function initGSAPAnimations() {
    // キャラクターの回転＋瞬間移動アニメーション
    const logoChar = document.getElementById('logoChar');
    if (logoChar) {
        const tl = gsap.timeline({ repeat: -1 });
        
        // 右からスタート（右傾きで表示）
        tl.set(logoChar, { left: '90%', rotation: 10, scaleX: 1 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '80%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '70%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '60%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '50%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '40%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '30%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '20%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '10%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '0%', rotation: 0 })
        // 左端で反転
        .to(logoChar, {
            scaleX: -1,
            duration: 0.3
        })
        // 右へ瞬間移動（反転状態で左傾きで現れる）
        .set(logoChar, { left: '10%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '20%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '30%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '40%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '50%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '60%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '70%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '80%', rotation: 10 })
        .to(logoChar, { duration: 1 })
        .set(logoChar, { left: '90%', rotation: -10 })
        .to(logoChar, { duration: 1 })
        // 右端で反転解除
        .to(logoChar, {
            scaleX: 1,
            rotation: 0,
            duration: 0.3
        });
    }
    
    // MVテキストのアニメーション
    const mvTitle = document.querySelector('.mv-title');
    const mvDesc = document.querySelector('.mv-desc');
    
    if (mvTitle && mvDesc) {
        const tl = gsap.timeline();
        
        tl.fromTo(mvTitle,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        )
        .fromTo(mvDesc,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
        );
    }
    
    // セクションタイトルのアニメーション
    const sectionLabels = document.querySelectorAll('[class$="-label"]');
    const sectionTitles = document.querySelectorAll('[class$="-title"]:not(.mv-title)');
    
    sectionLabels.forEach(function(label) {
        gsap.fromTo(label,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: label,
                    start: 'top 85%',
                    end: 'top -10%',
                    toggleActions: 'play none play reset'
                }
            }
        );
    });
    
    sectionTitles.forEach(function(title) {
        gsap.fromTo(title,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    end: 'top -10%',
                    toggleActions: 'play none play reset'
                }
            }
        );
    });
    
    // 画像のパララックス効果
    const parallaxImages = document.querySelectorAll('.sec-01-img img, .sec-03-img img');
    
    parallaxImages.forEach(function(img) {
        gsap.to(img, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
    
    // ホバー時の画像拡大効果（GSAP版）
    const itemImages = document.querySelectorAll('.sec-02-item-img, .sec-04-item-img');
    
    itemImages.forEach(function(item) {
        const img = item.querySelector('img');
        if (!img) return;
        
        item.addEventListener('mouseenter', function() {
            gsap.to(img, {
                scale: 1.05,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(img, {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
    
    // フッターのフェードイン
    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.fromTo(footer,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
}

// ウィンドウリサイズ時の処理
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // リサイズ後の処理があればここに記述
        ScrollTrigger.refresh();
    }, 250);
});

// ページ読み込み完了時
window.addEventListener('load', function() {
    // 初期表示のアニメーション完了後にScrollTriggerを更新
    setTimeout(function() {
        ScrollTrigger.refresh();
    }, 100);
});