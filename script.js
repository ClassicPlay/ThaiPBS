// Header scroll effect
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate children elements
            const children = entry.target.querySelectorAll('.culture-card, .method-card, .menu-item, .dish-card, .timeline-step');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in, .section-title').forEach(el => {
    observer.observe(el);
});

// Game Logic
const gameEmojis = ['🐟', '🍚', '🌶️', '🥗', '🍲', '🥘', '🦐', '🧂'];
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let moves = 0;
let gameTimer = null;
let seconds = 0;

function openGame() {
    document.getElementById('gameModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    initGame();
}

function closeGame() {
    document.getElementById('gameModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    if (gameTimer) {
        clearInterval(gameTimer);
    }
}

function initGame() {
    // Reset game state
    gameCards = [...gameEmojis, ...gameEmojis];
    shuffleArray(gameCards);
    flippedCards = [];
    matchedPairs = 0;
    score = 1000;
    moves = 0;
    seconds = 0;
    
    // Reset UI
    document.getElementById('score').textContent = score;
    document.getElementById('matches').textContent = '0/8';
    document.getElementById('timer').textContent = '0';
    document.getElementById('gameResult').classList.remove('show');
    
    // Create game board
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        
        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${emoji}</div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
    
    // Start timer
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = seconds;
        score = Math.max(0, 1000 - (seconds * 2) - (moves * 5));
        document.getElementById('score').textContent = score;
    }, 1000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const emoji1 = card1.dataset.emoji;
    const emoji2 = card2.dataset.emoji;
    
    if (emoji1 === emoji2) {
        // Match found
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            document.getElementById('matches').textContent = `${matchedPairs}/8`;
            
            if (matchedPairs === 8) {
                endGame();
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endGame() {
    clearInterval(gameTimer);
    document.getElementById('finalScore').textContent = score;
    setTimeout(() => {
        document.getElementById('gameResult').classList.add('show');
    }, 500);
}

function restartGame() {
    initGame();
}

// Add hover effects to fish cards
document.querySelectorAll('.fish-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.05)';
        this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-float-1, .hero-float-2, .hero-float-3, .hero-float-4, .hero-float-5');
    
    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.2;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add click sound effect (optional - using Web Audio API)
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch(e) {
        // Audio not supported, continue anyway
    }
}

// Add click sound to interactive elements
document.querySelectorAll('.culture-card, .method-card, .menu-item, .dish-card').forEach(el => {
    el.addEventListener('click', playClickSound);
});

/* --- Thailand 4-region modal (added) --- */
const thRegionData = {
    north: {
        title: 'ภาคเหนือ',
        subtitle: 'พื้นที่ภูเขาและการเกษตร',
        text: 'ภาคเหนือมีภูมิประเทศเป็นภูเขาสูง อากาศเย็น เหมาะแก่การปลูกพืชเมืองหนาวและการเลี้ยงสัตว์ ชื่อจังหวัดสำคัญ เช่น เชียงใหม่ เชียงราย ลำปาง',
        fact: 'อาหารแนะนำ: แกงฮังเล, ลาบเหนือ'
    },
    northeast: {
        title: 'ภาคอีสาน',
        subtitle: 'ที่ราบสูงและลุ่มน้ำโขง',
        text: 'ภาคอีสานเป็นพื้นที่ราบสูง มีแม่น้ำโขงเป็นพรมแดนและมีภูมิปัญญาการถนอมอาหาร เช่น ปลาร้าและอาหารหมักอื่น ๆ',
        fact: 'อาหารแนะนำ: ส้มตำ, ลาบ, แจ่ว'
    },
    central: {
        title: 'ภาคกลาง',
        subtitle: 'ลุ่มน้ำเจ้าพระยาและศูนย์กลางเศรษฐกิจ',
        text: 'ภาคกลางเป็นที่ตั้งของกรุงเทพมหานครและที่ราบลุ่มเจ้าพระยา เหมาะสำหรับเกษตรกรรมเชิงพาณิชย์และเป็นศูนย์กลางการค้าของประเทศ',
        fact: 'อาหารแนะนำ: ปลาร้าปรุงสูตรท้องถิ่น, อาหารจานหลัก'
    },
    south: {
        title: 'ภาคใต้',
        subtitle: 'คาบสมุทรและเกาะ',
        text: 'ภาคใต้มีชายฝั่งทะเลและเกาะที่สวยงาม มีการประมงและการปลูกยางพารา อาหารทะเลเป็นเอกลักษณ์',
        fact: 'อาหารแนะนำ: แกงเลียง, อาหารทะเลท้องถิ่น'
    }
};

function ensureRegionModalExists() {
    if (document.getElementById('regionModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'regionModalOverlay';
    overlay.className = 'region-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'region-modal';
    modal.innerHTML = `
        <button class="close-btn" id="regionModalClose">ปิด</button>
        <h3 id="regionModalTitle"></h3>
        <div class="modal-meta" id="regionModalSubtitle"></div>
        <p id="regionModalText"></p>
        <p class="modal-meta" id="regionModalFact"></p>
    `;

    // close handlers
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeRegionModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeRegionModal();
    });
}

function openRegionModal(key) {
    ensureRegionModalExists();
    const overlay = document.getElementById('regionModalOverlay');
    const data = thRegionData[key];
    if (!data) return;

    document.getElementById('regionModalTitle').textContent = data.title;
    document.getElementById('regionModalSubtitle').textContent = data.subtitle;
    document.getElementById('regionModalText').textContent = data.text;
    document.getElementById('regionModalFact').textContent = data.fact;

    overlay.classList.add('active');
    // attach close button
    const closeBtn = document.getElementById('regionModalClose');
    if (closeBtn) {
        closeBtn.onclick = closeRegionModal;
    }
}

function closeRegionModal() {
    const overlay = document.getElementById('regionModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
}

// Attach listeners to region pins (if present)
document.querySelectorAll('.region-pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
        const key = pin.dataset.region;
        if (key) {
            // Show the card content as a popup overlay on the map
            showMapPopup(key, pin);
        }
    });
});


/* Map popup: clone the right-side .method-card and show it on the map near the pin */
function showMapPopup(key, pin) {
    const wrapper = document.querySelector('.map-wrapper');
    if (!wrapper) return;

    closeMapPopup(); // remove existing

    const source = document.querySelector(`.method-card.${key}`);
    if (!source) return;

    // Clone source card and convert to popup
    const popup = source.cloneNode(true);
    popup.classList.add('map-popup');
    // add a close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'map-popup-close';
    closeBtn.setAttribute('aria-label', 'ปิด');
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', closeMapPopup);
    popup.insertBefore(closeBtn, popup.firstChild);

    // Insert popup into wrapper
    wrapper.appendChild(popup);

    // Position relative to wrapper using pin coordinates
    const pinRect = pin.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // default offsets
    let left = pinRect.left - wrapperRect.left + 20;
    let top = pinRect.top - wrapperRect.top - (popup.offsetHeight / 2);

    // apply initial positioning
    popup.style.position = 'absolute';
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    // adjust if overflow
    const popupRect = popup.getBoundingClientRect();
    if (popupRect.right > wrapperRect.right) {
        const shift = popupRect.right - wrapperRect.right + 10;
        popup.style.left = `${left - shift}px`;
    }
    if (popupRect.left < wrapperRect.left) {
        popup.style.left = `10px`;
    }
    if (popupRect.top < wrapperRect.top) {
        popup.style.top = `10px`;
    }
    if (popupRect.bottom > wrapperRect.bottom) {
        popup.style.top = `${(wrapperRect.bottom - popupRect.height) - wrapperRect.top - 10}px`;
    }

    // focus and outside-click handler
    popup.setAttribute('tabindex', '-1');
    popup.focus();

    function onDocClick(e) {
        if (!popup.contains(e.target) && !pin.contains(e.target)) {
            closeMapPopup();
        }
    }

    setTimeout(() => document.addEventListener('click', onDocClick), 0);

    // store for later removal
    window._currentMapPopup = { popup, onDocClick };
}

function closeMapPopup() {
    const info = window._currentMapPopup;
    if (!info) return;
    document.removeEventListener('click', info.onDocClick);
    if (info.popup && info.popup.parentNode) info.popup.parentNode.removeChild(info.popup);
    window._currentMapPopup = null;
}

/* Map showcase: dramatic entrance when the history/map section scrolls into view
   - Adds .map-animated to the wrapper (plays CSS animations)
   - Staggers pin animations via inline animationDelay
   - Spawns temporary confetti pieces and cleans them up after animation
*/
function triggerMapShowcase() {
    const wrapper = document.querySelector('.map-wrapper');
    if (!wrapper) return;
    // don't re-run repeatedly
    if (wrapper.dataset.animated === 'true') return;

    const pins = wrapper.querySelectorAll('.region-pin');
    // add class that triggers CSS animations
    wrapper.classList.add('map-animated');

    // stagger pins so they bounce one after another
    pins.forEach((pin, i) => {
        // stagger in 120ms intervals
        pin.style.animationDelay = `${i * 120}ms`;
        // small extra transform for dramatic effect
        pin.style.willChange = 'transform, opacity';
    });

    // spark confetti
    const colors = ['#FF6B6B', '#FFD166', '#06D6A0', '#4D96FF', '#D7263D', '#FF8FAB'];
    const count = 20;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'map-confetti-piece';
        const w = Math.floor(Math.random() * 12) + 6;
        const h = Math.floor(w * 1.3);
        piece.style.width = `${w}px`;
        piece.style.height = `${h}px`;
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.top = `${-10 - Math.random() * 20}%`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        const dur = 1200 + Math.floor(Math.random() * 1600);
        piece.style.animationDuration = `${dur}ms`;
        piece.style.animationDelay = `${Math.floor(Math.random() * 300)}ms`;
        piece.style.opacity = '1';
        wrapper.appendChild(piece);
        // remove when done
        piece.addEventListener('animationend', () => {
            if (piece && piece.parentNode) piece.parentNode.removeChild(piece);
        });
    }

    // mark animated so we don't repeat the whole show on re-entry
    wrapper.dataset.animated = 'true';

    // subtle audio cue (uses existing playClickSound, wrapped in try)
    try { setTimeout(playClickSound, 100); } catch (e) {}
}

// Observe history section and trigger the map showcase once when visible
(() => {
    const historySection = document.querySelector('.history-section');
    if (!historySection) return;

    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerMapShowcase();
                showcaseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

    showcaseObserver.observe(historySection);
})();

// Ensure modal can be created when DOM loads (in case script runs before new HTML is parsed)
window.addEventListener('load', () => {
    ensureRegionModalExists();
    attachIsaanHandlers();
    attachTimelineHandlers();
});

/* Making-process timeline modal and handlers */
function ensureMakingModalExists() {
    if (document.getElementById('makingModalOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'makingModalOverlay';
    overlay.className = 'making-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'making-modal';
    modal.innerHTML = `
        <img src="" alt="ขั้นตอน" id="makingModalImg" class="modal-img" />
        <div class="modal-caption" id="makingModalCaption"></div>
        <button class="close-btn" id="makingModalClose">ปิด</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const ov = document.getElementById('makingModalOverlay');
            if (ov) ov.classList.remove('active');
        }
    });
}

function showMakingImage(index, title) {
    // placeholder images; user can replace with real images later
    const placeholders = [
        'himages/abproveSaiHai.png',
        'images/abproveSaiHai.png',
        'images/abproveSaiHai.png',
        'images/abproveSaiHai.png',
        'images/abproveSaiHai.png',
        'images/abproveSaiHai.png',
        'images/abproveSaiHai.png'
    ];

    ensureMakingModalExists();
    const overlay = document.getElementById('makingModalOverlay');
    if (!overlay) return;
    const img = document.getElementById('makingModalImg');
    const cap = document.getElementById('makingModalCaption');
    const closeBtn = document.getElementById('makingModalClose');

    // Prefer explicit per-step image if provided via data-img on the .timeline-step
    let src = placeholders[index] || placeholders[0];
    const steps = document.querySelectorAll('.timeline-step');
    const step = steps[index];
    if (step && step.dataset && step.dataset.img) {
        src = step.dataset.img;
    }

    img.src = src;
    img.alt = title || 'ขั้นตอน';
    cap.textContent = title || '';
    overlay.classList.add('active');
    if (closeBtn) closeBtn.onclick = () => overlay.classList.remove('active');
}

function attachTimelineHandlers() {
    const steps = document.querySelectorAll('.timeline-step');
    if (!steps || !steps.length) return;

    // small preview element (single instance)
    let preview = document.getElementById('makingPreview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'makingPreview';
        preview.className = 'making-preview';
        preview.innerHTML = `<img src="" alt="preview"><div class="preview-caption"></div>`;
    }

    // placeholder thumbnails (same order as modal placeholders)
    const thumbs = [
        'https://placehold.co/480x270/FFDDD2/8B4513?text=ขั้นตอน+1',
        'https://placehold.co/480x270/FFE8CC/8B4513?text=ขั้นตอน+2',
        'https://placehold.co/480x270/FFF5E1/8B4513?text=ขั้นตอน+3',
        'https://placehold.co/480x270/FFE4B5/8B4513?text=ขั้นตอน+4',
        'https://placehold.co/480x270/FFDAB9/8B4513?text=ขั้นตอน+5',
        'https://placehold.co/480x270/FFDDCC/8B4513?text=ขั้นตอน+6',
        'https://placehold.co/480x270/FFEFE0/8B4513?text=ขั้นตอน+7'
    ];

    steps.forEach((step, i) => {
        const heading = step.querySelector('h4');
        if (!heading) return;
        // make keyboard accessible
        heading.setAttribute('role', 'button');
        heading.setAttribute('tabindex', '0');
        heading.setAttribute('aria-label', heading.textContent.trim());

        // click opens large modal
        heading.addEventListener('click', () => showMakingImage(i, heading.textContent.trim()));
        heading.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); heading.click(); }
        });

        // hover / focus show small preview near the heading
        heading.addEventListener('mouseenter', (e) => {
            const img = preview.querySelector('img');
            const cap = preview.querySelector('.preview-caption');
            // prefer per-step thumbnail if provided
            const stepThumb = step.dataset && step.dataset.thumb ? step.dataset.thumb : null;
            img.src = stepThumb || thumbs[i] || thumbs[0];
            cap.textContent = heading.textContent.trim();
            preview.classList.add('active');
            // position preview: prefer to the right
            const r = heading.getBoundingClientRect();
            const px = r.right + 12;
            let py = r.top + window.scrollY - 6;
            // if overflow right, place to left
            if (px + 240 > window.innerWidth) {
                preview.style.left = (r.left - 240 - 12) + 'px';
            } else {
                preview.style.left = px + 'px';
            }
            // clamp vertically within viewport
            if (py + 140 > window.scrollY + window.innerHeight) py = window.scrollY + window.innerHeight - 160;
            if (py < window.scrollY + 8) py = window.scrollY + 8;
            preview.style.top = py + 'px';
        });
        heading.addEventListener('mouseleave', () => { preview.classList.remove('active'); });
        heading.addEventListener('blur', () => { preview.classList.remove('active'); });
        heading.addEventListener('focus', (e) => {
            // show preview when focused by keyboard
            const evt = new Event('mouseenter');
            heading.dispatchEvent(evt);
        });
    });
}

/* Isaan modal creation and handlers */
function ensureIsaanModalExists() {
    if (document.getElementById('isaanModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'isaanModalOverlay';
    overlay.className = 'isaan-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'isaan-modal';
    modal.innerHTML = `
        <h3 id="isaanModalTitle"></h3>
        <div class="modal-body" id="isaanModalBody"></div>
        <button class="close-btn" id="isaanModalClose">ปิด</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const ov = document.getElementById('isaanModalOverlay');
            if (ov) ov.classList.remove('active');
        }
    });
}

// ฟังก์ชันนี้จะถูกเรียกเมื่อคลิกที่ province-pin
function showIsaanProvince(provName, revenue) {
    ensureIsaanModalExists(); // ตรวจสอบ/สร้าง HTML ของ modal
    const overlay = document.getElementById('isaanModalOverlay');
    if (!overlay) return;

    // นำข้อมูลที่ได้ (provName, revenue) มาใส่ใน modal
    document.getElementById('isaanModalTitle').textContent = provName;
    document.getElementById('isaanModalBody').textContent = `มูลค่า: ${revenue} ล้านบาท`;
    overlay.classList.add('active'); // แสดง modal

    // เพิ่มการทำงานให้ปุ่มปิด
    const closeBtn = document.getElementById('isaanModalClose');
    if (closeBtn) closeBtn.onclick = () => overlay.classList.remove('active');
}

// ฟังก์ชันนี้คือตัวที่ "กำหนด" ให้กล่องจังหวัดคลิกได้
function attachIsaanHandlers() {
    // 1. ค้นหา element ทั้งหมดที่มีคลาส .province-pin
    const pins = document.querySelectorAll('.province-pin'); 
    if (!pins || !pins.length) return;

    pins.forEach(pin => {
        // 2. เพิ่มการดักฟัง "คลิก"
        pin.addEventListener('click', (e) => {
            
            // 3. อ่านข้อมูลจาก data- attributes ที่กำหนดไว้
            const prov = pin.dataset.prov || pin.textContent.trim();
            const rev = pin.dataset.revenue || '';
            
            // 4. เรียกฟังก์ชันให้แสดงผล
            showIsaanProvince(prov, rev); 
        });

        // (ส่วนนี้เพื่อให้สามารถใช้งานผ่านคีย์บอร์ดได้)
        pin.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                pin.click();
            }
        });
    });
}

// ...

// โค้ดนี้จะถูกเรียกเมื่อหน้าเว็บโหลดเสร็จ
window.addEventListener('load', () => {
    // ...
    // เรียกใช้ฟังก์ชันเพื่อ "เปิดการใช้งาน" ปุ่มจังหวัด
    attachIsaanHandlers(); 
    // ...
});
// end remove automatic placement of all cards — cards will appear only when user clicks a region pin (showMapPopup)

// Chart initialization and interactivity

// Horizontal Auto-Scrolling Carousel with Swipe
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('dishScrollContainer');
    const dishGrid = document.getElementById('dishGrid');
    
    if (!scrollContainer || !dishGrid) return;
    
    // Clone cards for infinite scroll effect
    const cards = dishGrid.querySelectorAll('.dish-card');
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        dishGrid.appendChild(clone);
    });
    
    // Swipe/Drag functionality
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;
    
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        scrollContainer.style.cursor = 'grabbing';
        scrollContainer.classList.add('dragging');
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
        scrollContainer.classList.remove('dragging');
    });
    
    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
        scrollContainer.classList.remove('dragging');
    });
    
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;
        
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast
        
        scrollContainer.scrollLeft = scrollLeft - walk;
        
        // Pause animation while dragging
        dishGrid.style.animationPlayState = 'paused';
    });
    
    scrollContainer.addEventListener('mouseenter', () => {
        scrollContainer.style.cursor = 'grab';
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchScrollLeft = scrollContainer.scrollLeft;
        dishGrid.style.animationPlayState = 'paused';
    });
    
    scrollContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touchX = e.touches[0].clientX;
        const walk = (touchStartX - touchX) * 1.5;
        
        scrollContainer.scrollLeft = touchScrollLeft + walk;
    });
    
    scrollContainer.addEventListener('touchend', () => {
        touchStartX = 0;
        // Resume animation after 1 second of inactivity
        setTimeout(() => {
            if (scrollContainer.scrollLeft === touchScrollLeft || !scrollContainer.matches(':hover')) {
                dishGrid.style.animationPlayState = 'running';
            }
        }, 1000);
    });
    
    // Resume animation when mouse leaves the container
    scrollContainer.addEventListener('mouseleave', () => {
        dishGrid.style.animationPlayState = 'running';
    });
    
    // Manual scroll reset
    scrollContainer.addEventListener('scroll', () => {
        const scrollWidth = dishGrid.scrollWidth / 2;
        if (scrollContainer.scrollLeft >= scrollWidth - 100) {
            scrollContainer.scrollLeft = 0;
        }
    });
});

// Nutrition Circle Interactive Effects
document.addEventListener('DOMContentLoaded', () => {
    const fishNutrition = document.getElementById('fishNutrition');
    const nutritionInfo = document.getElementById('nutritionInfo');
    
    if (!fishNutrition || !nutritionInfo) return;
    
    // Show nutrition info on hover
    fishNutrition.addEventListener('mouseenter', () => {
        nutritionInfo.classList.remove('hidden');
        
        // Animate nutrition items on show
        const items = nutritionInfo.querySelectorAll('.nutrition-item');
        items.forEach((item, index) => {
            item.style.animation = `slideInNutrition 0.4s ease ${index * 0.05}s forwards`;
        });
    });
    
    fishNutrition.addEventListener('mouseleave', () => {
        nutritionInfo.classList.add('hidden');
    });
    
    // Animate fish on hover
    fishNutrition.addEventListener('mouseenter', () => {
        const fishSvg = fishNutrition.querySelector('.fish-shape');
        if (fishSvg) {
            fishSvg.style.animation = 'fishSwim 0.6s ease-ian-out infinite';
        }
    });
    
    fishNutrition.addEventListener('mouseleave', () => {
        const fishSvg = fishNutrition.querySelector('.fish-shape');
        if (fishSvg) {
            fishSvg.style.animation = 'none';
        }
    });
});

// 📌 โค้ดที่เพิ่มสำหรับลูกเล่นแสดงภาพขั้นตอนการทำ

document.addEventListener('DOMContentLoaded', () => {
    // โค้ดเดิม (ถ้ามี) ...
    // ตัวอย่าง: โค้ดสำหรับเกม (ถ้ามี)
    // const gameModal = document.getElementById('gameModal');
    // ...

    // โค้ดใหม่สำหรับ Making Process Hover
    const steps = document.querySelectorAll('.timeline-step');
    const displayBox = document.getElementById('processImageDisplay');
    const displayImage = document.getElementById('displayImage');
    const imageCaption = document.getElementById('imageCaption');

    if (steps.length > 0 && displayBox) {
        // ตั้งค่าเริ่มต้น: โหลดภาพแรกของขั้นตอนแรกเมื่อหน้าโหลดเสร็จ
        const firstStep = steps[0];
        displayImage.src = firstStep.getAttribute('data-img');
        imageCaption.textContent = firstStep.getAttribute('data-caption') || firstStep.querySelector('h4').textContent;

        steps.forEach(step => {
            // เมื่อเมาส์เลื่อนเข้าสู่ขั้นตอน
            step.addEventListener('mouseenter', () => {
                const imgSrc = step.getAttribute('data-img');
                const caption = step.getAttribute('data-caption') || step.querySelector('h4').textContent;
                
                // ใช้ setTimeout 0 เพื่อทำให้การเปลี่ยนภาพดูเนียนขึ้น (trigger re-paint)
                setTimeout(() => {
                    displayBox.style.opacity = 0; // เฟดออก
                }, 0); 
                
                setTimeout(() => {
                    // อัพเดทข้อมูลใหม่
                    displayImage.src = imgSrc;
                    imageCaption.textContent = caption;
                    displayBox.style.opacity = 1; // เฟดเข้า
                }, 100); // ดีเลย์ 100ms เพื่อรอให้เฟดออกเล็กน้อยแล้วเฟดเข้าทันที
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // โค้ดอื่นๆ ของคุณ... (ที่เคยอยู่ใน DOMContentLoaded)
    
    // 📌 Logic สำหรับขั้นตอนการทำ (Making Process) เพื่อรองรับ Touch Screen
    const steps = document.querySelectorAll('.timeline-step');
    let activeStep = null; // เก็บขั้นตอนที่กำลังแสดงภาพอยู่บนมือถือ

    steps.forEach(step => {
        const hoverImg = step.querySelector('.hover-img');
        const hoverCaption = step.querySelector('.hover-caption');

        // 1. ตั้งค่าเมื่อเมาส์เลื่อนเข้าสู่ขั้นตอน (Desktop/Hover)
        step.addEventListener('mouseenter', () => {
            // โหลดข้อมูลภาพและคำบรรยายไว้ล่วงหน้า
            const imgSrc = step.getAttribute('data-img');
            const caption = step.getAttribute('data-caption') || step.querySelector('h4').textContent;
            if (hoverImg) hoverImg.src = imgSrc;
            if (hoverCaption) hoverCaption.textContent = caption;
            
            // เมื่อใช้เมาส์ ให้ซ่อนภาพที่แสดงอยู่ก่อนหน้าบนมือถือ (ถ้ามี)
            if (activeStep) {
                 activeStep.classList.remove('active-touch');
                 activeStep = null;
            }
        });

        // 2. ใช้อีเวนต์ 'click' เพื่อจัดการบนมือถือ/หน้าจอสัมผัส
        step.addEventListener('click', (e) => {
            // ใช้ window.innerWidth เป็นหลักเพื่อตรวจสอบว่าทำงานบนจอเล็ก
            if (window.innerWidth <= 768) { 
                
                // โหลดข้อมูลภาพและคำบรรยายไว้ล่วงหน้า (เผื่อกรณีที่ไม่มี mouseenter มาก่อน)
                const imgSrc = step.getAttribute('data-img');
                const caption = step.getAttribute('data-caption') || step.querySelector('h4').textContent;
                if (hoverImg) hoverImg.src = imgSrc;
                if (hoverCaption) hoverCaption.textContent = caption;

                // หากแตะที่กล่องเดิม (activeStep) ให้ซ่อนภาพ
                if (activeStep === step) {
                    step.classList.remove('active-touch');
                    activeStep = null;
                } else {
                    // หากมีกล่องอื่นกำลังแสดงอยู่ ให้ซ่อนกล่องนั้น
                    if (activeStep) {
                        activeStep.classList.remove('active-touch');
                    }
                    
                    // แสดงภาพของกล่องใหม่
                    step.classList.add('active-touch');
                    activeStep = step;
                }
                
                // ป้องกันไม่ให้เกิดการคลิกซ้ำหรือ scroll
                e.preventDefault(); 
            }
        });
        
    });
    
    // ... (โค้ดส่วน Nutrition Circle Interactive Effects และอื่นๆ อยู่ด้านล่าง)
});

// Quiz Game Variables
let quizQuestions = [
    {
        image: 'images/somTam.png',
        question: 'อาหารในรูปนี้คืออะไร?',
        correct: 'ส้มตำปูปลาร้า',
        choices: ['ส้มตำปูปลาร้า', 'แจ่วบอง', 'ลาบเทา', 'แกงเปรอะ']
    },
    {
        image: 'images/Jaewbong.png',
        question: 'เมนูนี้ชื่ออะไร?',
        correct: 'แจ่วบอง',
        choices: ['แกงหวาย', 'แจ่วบอง', 'หลนปลาร้า', 'ส้มตำ']
    },
    {
        image: 'images/labTao.png',
        question: 'อาหารจานนี้คืออะไร?',
        correct: 'ลาบเทา',
        choices: ['ลาบเทา', 'แจ่วบอง', 'ปลาร้าทอด', 'แกงเปรอะ']
    },
    {
        image: 'images/kangPrer.png',
        question: 'เมนูในรูปชื่ออะไร?',
        correct: 'แกงเปรอะ',
        choices: ['แกงหวาย', 'หลนปลาร้า', 'แกงเปรอะ', 'แจ่วบอง']
    },
    {
        image: 'images/KangWali.png',
        question: 'อาหารนี้คืออะไร?',
        correct: 'แกงหวาย',
        choices: ['แกงเปรอะ', 'แกงหวาย', 'หลนปลาร้า', 'ลาบเทา']
    },
    {
        image: 'images/LoonPlara.png',
        question: 'เมนูในภาพคืออะไร?',
        correct: 'หลนปลาร้า',
        choices: ['หลนปลาร้า', 'แจ่วบอง', 'แกงหวาย', 'ปลาร้าทอด']
    },
    {
        image: 'images/plaraCooked.png',
        question: 'อาหารจานนี้คืออะไร?',
        correct: 'ปลาร้าทอด',
        choices: ['ลาบเทา', 'ปลาร้าทอด', 'แจ่วบอง', 'หลนปลาร้า']
    },
    {
        image: 'images/somTam.png',
        question: 'ส่วนผสมหลักของส้มตำปลาร้าคืออะไร?',
        correct: 'ปลาร้า',
        choices: ['ปลาร้า', 'น้ำปลา', 'กะปิ', 'เต้าเจี้ยว']
    },
    {
        image: 'images/Plaranewver.png',
        question: 'ปลาร้ารูปแบบใหม่ที่กล่าวถึงในเว็บไซต์คืออะไร?',
        correct: 'ปลาร้าผง',
        choices: ['ปลาร้าผง', 'ปลาร้ากระป๋อง', 'ปลาร้าแผ่น', 'ปลาร้าเม็ด']
    },
    {
        image: 'images/hai.png',
        question: 'ปลาร้าต้องหมักนานแค่ไหน?',
        correct: '3 เดือน - 1 ปี',
        choices: ['1 สัปดาห์', '1 เดือน', '3 เดือน - 1 ปี', '2 ปี']
    }
];

let currentQuizQuestion = 0;
let quizScoreValue = 0;

function openQuizGame() {
    document.getElementById('quizModal').style.display = 'flex';
    currentQuizQuestion = 0;
    quizScoreValue = 0;
    showQuizQuestion();
}

function closeQuizGame() {
    document.getElementById('quizModal').style.display = 'none';
}

function showQuizQuestion() {
    if (currentQuizQuestion >= quizQuestions.length) {
        showQuizResult();
        return;
    }

    const q = quizQuestions[currentQuizQuestion];
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('quizImage').querySelector('img').src = q.image;
    document.getElementById('quizScore').textContent = quizScoreValue;
    document.getElementById('quizProgress').textContent = `${currentQuizQuestion + 1}/${quizQuestions.length}`;
    
    const choicesDiv = document.getElementById('quizChoices');
    choicesDiv.innerHTML = '';
    
    q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.style.padding = '15px';
        btn.style.fontSize = '1.1rem';
        btn.style.border = '2px solid #667eea';
        btn.style.borderRadius = '10px';
        btn.style.background = 'white';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s';
        btn.onmouseover = () => {
            btn.style.background = '#667eea';
            btn.style.color = 'white';
        };
        btn.onmouseout = () => {
            btn.style.background = 'white';
            btn.style.color = 'black';
        };
        btn.onclick = () => checkQuizAnswer(choice, q.correct);
        choicesDiv.appendChild(btn);
    });

    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizNextBtn').style.display = 'none';
}

function checkQuizAnswer(selected, correct) {
    const feedback = document.getElementById('quizFeedback');
    const buttons = document.querySelectorAll('#quizChoices button');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        if (btn.textContent === correct) {
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            btn.style.borderColor = '#4CAF50';
        }
        if (btn.textContent === selected && selected !== correct) {
            btn.style.background = '#f44336';
            btn.style.color = 'white';
            btn.style.borderColor = '#f44336';
        }
    });

    if (selected === correct) {
        quizScoreValue += 10;
        feedback.textContent = '✅ ถูกต้อง! +10 คะแนน';
        feedback.style.background = '#d4edda';
        feedback.style.color = '#155724';
    } else {
        feedback.textContent = `❌ ผิดนะ! คำตอบที่ถูกคือ ${correct}`;;
        feedback.style.background = '#f8d7da';
        feedback.style.color = '#721c24';
    }

    feedback.style.display = 'block';
    document.getElementById('quizNextBtn').style.display = 'block';
    document.getElementById('quizScore').textContent = quizScoreValue;
}

function nextQuizQuestion() {
    currentQuizQuestion++;
    showQuizQuestion();
}

function showQuizResult() {
    document.getElementById('quizImage').style.display = 'none';
    document.getElementById('quizChoices').style.display = 'none';
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizNextBtn').style.display = 'none';
    document.getElementById('quizQuestion').style.display = 'none';
    
    const result = document.getElementById('quizResult');
    document.getElementById('quizFinalScore').textContent = quizScoreValue;
    
    const remark = document.getElementById('quizRemark');
    if (quizScoreValue >= 80) {
        remark.textContent = '🏆 ยอดเยี่ยม! คุณเป็นผู้เชี่ยวชาญปลาร้าแท้ๆ!';
    } else if (quizScoreValue >= 60) {
        remark.textContent = '👍 ดีมาก! คุณรู้จักเมนูปลาร้าดีทีเดียว!';
    } else if (quizScoreValue >= 40) {
        remark.textContent = '😊 ดีแล้ว! แต่ยังมีอีกหลายเมนูให้ค้นพบ!';
    } else {
        remark.textContent = '📚 ลองเรียนรู้เพิ่มเติมแล้วมาเล่นอีกครั้งนะ!';
    }
    
    result.style.display = 'block';
}

function restartQuizGame() {
    currentQuizQuestion = 0;
    quizScoreValue = 0;
    document.getElementById('quizImage').style.display = 'block';
    document.getElementById('quizChoices').style.display = 'grid';
    document.getElementById('quizQuestion').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    showQuizQuestion();
}