// Slider sederhana khusus galeri di section #galeri

let galeriSlides = []; //
let galeriDots = []; //
let galeriIndex = 0; //
let galeriTimer = null; //

function showGaleriSlide(index) { //
    const total = galeriSlides.length; //
    if (!total) return; //

    // pastikan index selalu muter 0 → 1 → 2 → ... → total-1 → 0 lagi
    galeriIndex = (index + total) % total; //

    galeriSlides.forEach((slide, i) => { //
        slide.classList.toggle('active', i === galeriIndex); //
    }); //

    galeriDots.forEach((dot, i) => { //
        dot.classList.toggle('active', i === galeriIndex); //
    }); //
} //

function startGaleriAuto() { //
    if (galeriTimer || galeriSlides.length <= 1) return; //

    galeriTimer = setInterval(() => { //
        showGaleriSlide(galeriIndex + 1); //
    }, 5000); // 5 detik per slide
} //

function stopGaleriAuto() { //
    if (galeriTimer) { //
        clearInterval(galeriTimer); //
        galeriTimer = null; //
    } //
} //

// dipakai tombol prev/next di HTML (onclick="changeSlide(this, 1)")
function changeSlide(button, direction) { //
    // begitu user klik, hentikan dulu auto slide, lalu mulai lagi
    stopGaleriAuto(); //
    showGaleriSlide(galeriIndex + direction); //
    startGaleriAuto(); //
} //

// === Scroll Reveal ===
function initScrollReveal() { //
    const revealEls = document.querySelectorAll('.reveal'); //

    if (!revealEls.length) return; //

    // fallback kalau browser lama tidak support IntersectionObserver
    if (!('IntersectionObserver' in window)) { //
        revealEls.forEach(el => el.classList.add('visible')); //
        return; //
    } //

    const observer = new IntersectionObserver( //
        (entries) => { //
            entries.forEach(entry => { //
                if (entry.isIntersecting) { //
                    // saat elemen masuk viewport → fade in
                    entry.target.classList.add('visible'); //
                } else { //
                    // saat elemen keluar viewport → reset lagi
                    // supaya kalau scroll balik ke bawah, animasi muncul lagi
                    entry.target.classList.remove('visible'); //
                } //
            }); //
        }, //
        { //
            threshold: 0.15 // minimal 15% bagian elemen masuk viewport baru di-trigger
        } //
    ); //

    revealEls.forEach(el => observer.observe(el)); //
} //

document.addEventListener('DOMContentLoaded', () => { //
    // Inisialisasi slider galeri
    const galleryContainer = document.querySelector('#galeri .slideshow-container'); //
    if (galleryContainer) { //
        galeriSlides = Array.from(galleryContainer.querySelectorAll('.slide')); //

        if (galeriSlides.length) { //
            const dotsContainer = galleryContainer.querySelector('.dots'); //

            if (dotsContainer) { //
                dotsContainer.innerHTML = ''; //
                galeriDots = galeriSlides.map((_, index) => { //
                    const dot = document.createElement('span'); //
                    dot.classList.add('dot'); //
                    dot.addEventListener('click', () => { //
                        stopGaleriAuto(); //
                        showGaleriSlide(index); //
                        startGaleriAuto(); //
                    }); //
                    dotsContainer.appendChild(dot); //
                    return dot; //
                }); //

                showGaleriSlide(0); //
                startGaleriAuto(); //

                // pause kalau mouse di atas galeri
                galleryContainer.addEventListener('mouseenter', stopGaleriAuto); //
                galleryContainer.addEventListener('mouseleave', startGaleriAuto); //
            } //
        } //
    } //

    // Inisialisasi efek scroll reveal
    initScrollReveal(); //

    // --- 1. LOGIKA HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger'); //
    const navMenu = document.querySelector('.nav-menu'); //

    if (hamburger) { //
        hamburger.addEventListener('click', () => { //
            navMenu.classList.toggle('active'); //
            // Ganti ikon burger jadi 'X' (close) saat dibuka
            const icon = hamburger.querySelector('i'); //
            if (icon) { //
                if (icon.classList.contains('fa-bars')) { //
                    icon.classList.replace('fa-bars', 'fa-times'); //
                } else { //
                    icon.classList.replace('fa-times', 'fa-bars'); //
                } //
            } //
        }); //
    } //

    // Tutup menu otomatis jika salah satu link navigasi diklik
    document.querySelectorAll('.nav-link').forEach(link => { //
        link.addEventListener('click', () => { //
            if (navMenu) navMenu.classList.remove('active'); //
            if (hamburger) { //
                const icon = hamburger.querySelector('i'); //
                if (icon && icon.classList.contains('fa-times')) { //
                    icon.classList.replace('fa-times', 'fa-bars'); //
                } //
            } //
        }); //
    }); //

    // --- 2. LOGIKA SWIPE GALERI UNTUK HP ---
    if (galleryContainer) { //
        let touchStartX = 0; //
        let touchEndX = 0; //

        galleryContainer.addEventListener('touchstart', e => { //
            touchStartX = e.changedTouches[0].screenX; //
        }, { passive: true }); //

        galleryContainer.addEventListener('touchend', e => { //
            touchEndX = e.changedTouches[0].screenX; //
            handleSwipe(); //
        }, { passive: true }); //

        function handleSwipe() { //
            const swipeThreshold = 50; // Jarak minimal usapan untuk pindah gambar
            if (touchEndX < touchStartX - swipeThreshold) { //
                // Geser ke kiri -> Gambar Selanjutnya (Next)
                changeSlide(null, 1); //
            } //
            if (touchEndX > touchStartX + swipeThreshold) { //
                // Geser ke kanan -> Gambar Sebelumnya (Prev)
                changeSlide(null, -1); //
            } //
        } //
    } //

    // --- 3. LOGIKA LIGHTBOX GALERI ---
    
    // Ambil elemen-elemen Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-lightbox');

    // Ambil semua gambar di dalam galeri slideshow
    // Kita menargetkan 'img' di dalam element berkelas 'slide'
    const galleryImages = document.querySelectorAll('#galeri .slide img');

    if (galleryImages.length && lightbox && lightboxImg && closeBtn) {
        
        // Daftarkan event klik untuk setiap gambar galeri
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                // Tampilkan lightbox (display: flex dari CSS)
                lightbox.style.display = 'flex';
                // Set sumber gambar lightbox ke sumber gambar yang diklik
                lightboxImg.src = img.src;
                // Set teks keterangan dari atribut 'alt' gambar
                if (captionText) {
                    captionText.innerHTML = img.alt || "Foto Kost Muslimah 203";
                }
                // (Opsional) Hentikan auto-slideshow saat lightbox terbuka
                stopGaleriAuto();
            });
        });

        // Daftarkan event klik untuk tombol tutup (X)
        closeBtn.addEventListener('click', closeLightbox);

        // Daftarkan event klik pada overlay latar belakang untuk menutup lightbox
        // (Tapi hanya jika pengguna mengklik latar belakang, bukan gambarnya)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Daftarkan event keydown untuk menutup lightbox dengan tombol 'Escape'
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }

    // Fungsi untuk menutup Lightbox
    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            // Bersihkan sumber gambar agar saat dibuka lagi tidak ada flicker
            if (lightboxImg) lightboxImg.src = '';
            if (captionText) captionText.innerHTML = '';
            // Mulai kembali auto-slideshow setelah lightbox ditutup
            startGaleriAuto();
        }
    }
});