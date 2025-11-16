// Slider sederhana khusus galeri di section #galeri

let galeriSlides = [];
let galeriDots = [];
let galeriIndex = 0;
let galeriTimer = null;

function showGaleriSlide(index) {
    const total = galeriSlides.length;
    if (!total) return;

    // pastikan index selalu muter 0 → 1 → 2 → ... → total-1 → 0 lagi
    galeriIndex = (index + total) % total;

    galeriSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === galeriIndex);
    });

    galeriDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === galeriIndex);
    });
}

function startGaleriAuto() {
    if (galeriTimer || galeriSlides.length <= 1) return;

    galeriTimer = setInterval(() => {
        showGaleriSlide(galeriIndex + 1);
    }, 5000); // 5 detik per slide
}

function stopGaleriAuto() {
    if (galeriTimer) {
        clearInterval(galeriTimer);
        galeriTimer = null;
    }
}

// dipakai tombol prev/next di HTML (onclick="changeSlide(this, 1)")
function changeSlide(button, direction) {
    // begitu user klik, hentikan dulu auto slide, lalu mulai lagi
    stopGaleriAuto();
    showGaleriSlide(galeriIndex + direction);
    startGaleriAuto();
}

// === Scroll Reveal ===
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    if (!revealEls.length) return;

    // fallback kalau browser lama tidak support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // saat elemen masuk viewport → fade in
                    entry.target.classList.add('visible');
                } else {
                    // saat elemen keluar viewport → reset lagi
                    // supaya kalau scroll balik ke bawah, animasi muncul lagi
                    entry.target.classList.remove('visible');
                }
            });
        },
        {
            threshold: 0.15 // minimal 15% bagian elemen masuk viewport baru di-trigger
        }
    );

    revealEls.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi slider galeri
    const galleryContainer = document.querySelector('#galeri .slideshow-container');
    if (galleryContainer) {
        galeriSlides = Array.from(galleryContainer.querySelectorAll('.slide'));

        if (galeriSlides.length) {
            const dotsContainer = galleryContainer.querySelector('.dots');

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                galeriDots = galeriSlides.map((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.addEventListener('click', () => {
                        stopGaleriAuto();
                        showGaleriSlide(index);
                        startGaleriAuto();
                    });
                    dotsContainer.appendChild(dot);
                    return dot;
                });

                showGaleriSlide(0);
                startGaleriAuto();

                // pause kalau mouse di atas galeri
                galleryContainer.addEventListener('mouseenter', stopGaleriAuto);
                galleryContainer.addEventListener('mouseleave', startGaleriAuto);
            }
        }
    }

    // Inisialisasi efek scroll reveal
    initScrollReveal();
});
