// ============================================================
// GALLERY & LIGHTBOX
// ============================================================

const images = [
    'class-pic2.jpeg',
    'class-pic3.jpg',
    'ss3.jpeg',
    'ss4.jpeg',
    'ss6.jpg',
    'cc.jpg',
    'opaw.jpg',
    'member_3.jpeg',
    'member_4.jpeg',
    'member_5.jpeg',
    'member_6.jpeg',
    'member_7.jpeg',
    '442002462_1235658104071883_6434536503424514232_n.jpg',
    'IMG-20240601-WA0001.jpg',
    'IMG-20240601-WA0002.jpg',
    'IMG-20240601-WA0003.jpg',
    'IMG-20240628-WA0000.jpg',
    'IMG-20240901-WA0002.jpg',
    'IMG-20240901-WA0004.jpg'
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    // Render Grid
    images.forEach((filename, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animationDelay = `${index * 0.05}s`;
        
        const img = document.createElement('img');
        img.src = `images/gallery/${filename}`;
        img.alt = `Bell Driver Gallery Image ${index + 1}`;
        img.loading = 'lazy';
        
        div.appendChild(img);
        
        div.addEventListener('click', () => openLightbox(index));
        grid.appendChild(div);
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCounter = document.getElementById('lightbox-counter');
    const btnNext = document.getElementById('lightbox-next');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnClose = document.getElementById('lightbox-close');

    let currentIndex = 0;

    const openLightbox = (index) => {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    const updateLightboxImage = () => {
        lbImg.src = `images/gallery/${images[currentIndex]}`;
        lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    };

    btnNext.addEventListener('click', nextImage);
    btnPrev.addEventListener('click', prevImage);
    btnClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Simple swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) nextImage();
        if (touchEndX > touchStartX + 50) prevImage();
    }
});
