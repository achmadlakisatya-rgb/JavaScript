/* ============================================================
   TOMORO COFFEE — script.js
   Berisi: menu hamburger, navbar saat scroll, animasi muncul,
           dan keranjang belanja sederhana.
   ============================================================ */
 
/* ---------- 1. MENU HAMBURGER ---------- */
function setupMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const list = document.querySelector('.nav-list');
    if (!toggle || !list) return;
 
    toggle.addEventListener('click', () => {
        const isOpen = list.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
    });
 
    // Tutup menu kalau layar dibesarkan lagi ke ukuran desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) {
            list.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}
 
/* ---------- 2. NAVBAR MENGECIL SAAT DI-SCROLL ---------- */
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
 
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}
 
/* ---------- 3. ANIMASI MUNCUL SAAT ELEMEN TERLIHAT ---------- */
function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
 
    // Kalau browser lama tidak mendukung, langsung tampilkan semua
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }
 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Jeda kecil supaya elemen muncul berurutan
                setTimeout(() => entry.target.classList.add('visible'), i * 110);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
 
    items.forEach(el => observer.observe(el));
}
 
/* ---------- 4. KERANJANG BELANJA ---------- */
const CART_KEY = 'tomoroCart';
 
function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
        return {};   // localStorage diblokir browser → keranjang kosong
    }
}
 
function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
        /* diabaikan, halaman tetap jalan */
    }
}
 
function countItems(cart) {
    return Object.values(cart).reduce((total, item) => total + item.qty, 0);
}
 
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}
 
/* Perbarui angka kecil di ikon keranjang */
function updateBadge(bump) {
    const badge = document.querySelector('.cart-count');
    const link = document.querySelector('.cart-link');
    if (!badge) return;
 
    const jumlah = countItems(readCart());
    badge.textContent = jumlah;
    badge.classList.toggle('show', jumlah > 0);
 
    if (bump && link) {
        link.classList.remove('bump');
        void link.offsetWidth;          // paksa animasi diulang
        link.classList.add('bump');
    }
}
 
/* Tombol (+) dan (-) di setiap kartu produk, sebelum "Beli Sekarang" */
function setupQtyMini() {
    document.querySelectorAll('.product-card').forEach(card => {
        const minus = card.querySelector('[data-qty-minus]');
        const plus  = card.querySelector('[data-qty-plus]');
        const value = card.querySelector('[data-qty-value]');
        if (!minus || !plus || !value) return;

        minus.addEventListener('click', () => {
            const angka = parseInt(value.textContent, 10) || 1;
            if (angka > 1) value.textContent = angka - 1;
        });

        plus.addEventListener('click', () => {
            const angka = parseInt(value.textContent, 10) || 1;
            value.textContent = angka + 1;
        });
    });
}

/* Tombol "Beli Sekarang" di halaman Products */
function setupAddToCart() {
    document.querySelectorAll('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
 
            // Ambil jumlah dari stepper (+/-) di kartu yang sama, default 1
            const card = btn.closest('.product-card');
            const qtyEl = card ? card.querySelector('[data-qty-value]') : null;
            const jumlah = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

            const id = btn.dataset.add;
            const cart = readCart();
 
            if (cart[id]) {
                cart[id].qty += jumlah;
            } else {
                cart[id] = {
                    name:  btn.dataset.name,
                    price: Number(btn.dataset.price),
                    img:   btn.dataset.img,
                    qty:   jumlah
                };
            }
 
            saveCart(cart);
            updateBadge(true);

            // Stepper balik ke 1 setelah berhasil ditambahkan
            if (qtyEl) qtyEl.textContent = '1';
 
            // Beri tahu pengguna lewat teks tombol sebentar
            const teksAsli = btn.textContent;
            btn.textContent = 'Ditambahkan';
            setTimeout(() => { btn.textContent = teksAsli; }, 1100);
        });
    });
}
 
/* Isi halaman Cart */
function renderCart() {
    const wrap = document.getElementById('cart-content');
    if (!wrap) return;
 
    const cart = readCart();
    const ids = Object.keys(cart);
 
    if (!ids.length) {
        wrap.innerHTML = `
            <div class="empty-state">
                <p>Keranjang masih kosong. Pilih kopi favoritmu dulu di halaman Products.</p>
                <a href="Products3.html" class="btn-buy">Lihat menu</a>
            </div>`;
        return;
    }
 
    let total = 0;
    let html = '<div class="cart-table">';
 
    ids.forEach(id => {
        const item = cart[id];
        const subtotal = item.price * item.qty;
        total += subtotal;
 
        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <span class="unit">${formatRupiah(item.price)} / cup</span>
                </div>
                <div class="qty">
                    <button type="button" data-minus="${id}" aria-label="Kurangi ${item.name}">&minus;</button>
                    <span>${item.qty}</span>
                    <button type="button" data-plus="${id}" aria-label="Tambah ${item.name}">+</button>
                </div>
                <div class="line-total">${formatRupiah(subtotal)}</div>
            </div>`;
    });
 
    html += `</div>
        <div class="cart-summary">
            <div>
                <div class="total-label">Total belanja</div>
                <div class="total-value">${formatRupiah(total)}</div>
            </div>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <a href="Products3.html" class="btn-outline">Tambah lagi</a>
                <button type="button" class="btn-buy" id="checkout">Pesan sekarang</button>
            </div>
        </div>`;
 
    wrap.innerHTML = html;
 
    // Tombol tambah / kurang jumlah
    wrap.querySelectorAll('[data-plus]').forEach(btn => {
        btn.addEventListener('click', () => ubahJumlah(btn.dataset.plus, 1));
    });
    wrap.querySelectorAll('[data-minus]').forEach(btn => {
        btn.addEventListener('click', () => ubahJumlah(btn.dataset.minus, -1));
    });
 
    const checkout = document.getElementById('checkout');
    if (checkout) {
        checkout.addEventListener('click', () => {
            saveCart({});
            updateBadge(false);
            wrap.innerHTML = `
                <div class="empty-state">
                    <h3 style="color:var(--ink); margin-bottom:10px;">Pesanan terkirim</h3>
                    <p>Terima kasih! Pesananmu sedang disiapkan barista Tomoro.</p>
                    <a href="Products3.html" class="btn-buy">Pesan lagi</a>
                </div>`;
        });
    }
}
 
function ubahJumlah(id, selisih) {
    const cart = readCart();
    if (!cart[id]) return;
 
    cart[id].qty += selisih;
    if (cart[id].qty < 1) delete cart[id];
 
    saveCart(cart);
    updateBadge(false);
    renderCart();
}
 
/* ---------- 4b. MENU FAVORIT ---------- */
const FAV_KEY = 'tomoroFavorites';

function readFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || {};
    } catch (e) {
        return {};   // localStorage diblokir browser → favorit kosong
    }
}

function saveFavorites(fav) {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify(fav));
    } catch (e) {
        /* diabaikan, halaman tetap jalan */
    }
}

function countFavorites(fav) {
    return Object.keys(fav).length;
}

/* Perbarui angka kecil di ikon bintang navbar */
function updateFavBadge() {
    const badge = document.querySelector('.fav-count');
    if (!badge) return;

    const jumlah = countFavorites(readFavorites());
    badge.textContent = jumlah;
    badge.classList.toggle('show', jumlah > 0);
}

/* Tombol bintang di setiap kartu produk (halaman Products) */
function setupFavoriteStars() {
    const favorites = readFavorites();

    document.querySelectorAll('[data-fav]').forEach(btn => {
        const id = btn.dataset.fav;
        btn.classList.toggle('active', !!favorites[id]);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const fav = readFavorites();

            if (fav[id]) {
                delete fav[id];
                btn.classList.remove('active');
            } else {
                fav[id] = {
                    name:  btn.dataset.name,
                    price: Number(btn.dataset.price),
                    img:   btn.dataset.img
                };
                btn.classList.add('active');
            }

            saveFavorites(fav);
            updateFavBadge();

            // Kalau lagi buka halaman Favorit, perbarui daftarnya juga
            renderFavorites();
        });
    });
}

/* Isi halaman Favorit.html */
function renderFavorites() {
    const wrap = document.getElementById('favorite-content');
    if (!wrap) return;

    const fav = readFavorites();
    const ids = Object.keys(fav);

    if (!ids.length) {
        wrap.innerHTML = `
            <div class="empty-state">
                <p>Belum ada menu favorit. Ketuk ikon bintang di halaman Products untuk menyimpannya di sini.</p>
                <a href="Products3.html" class="btn-buy">Lihat menu</a>
            </div>`;
        return;
    }

    let html = '<div class="favorite-table">';

    ids.forEach(id => {
        const item = fav[id];
        html += `
            <div class="favorite-item">
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <span class="unit">${formatRupiah(item.price)} / cup</span>
                </div>
                <div class="favorite-actions">
                    <button type="button" class="btn-outline" data-add-fav="${id}">Tambah ke keranjang</button>
                    <button type="button" class="fav-remove" data-remove-fav="${id}" aria-label="Hapus dari favorit">&times;</button>
                </div>
            </div>`;
    });

    html += '</div>';
    wrap.innerHTML = html;

    // Tombol "Tambah ke keranjang" langsung dari halaman Favorit
    wrap.querySelectorAll('[data-add-fav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.addFav;
            const item = fav[id];
            const cart = readCart();

            if (cart[id]) {
                cart[id].qty += 1;
            } else {
                cart[id] = { name: item.name, price: item.price, img: item.img, qty: 1 };
            }

            saveCart(cart);
            updateBadge(true);

            const teksAsli = btn.textContent;
            btn.textContent = 'Ditambahkan';
            setTimeout(() => { btn.textContent = teksAsli; }, 1100);
        });
    });

    // Tombol hapus (x) di setiap baris favorit
    wrap.querySelectorAll('[data-remove-fav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.removeFav;
            const f = readFavorites();
            delete f[id];
            saveFavorites(f);
            updateFavBadge();

            // Perbarui juga tampilan bintang kalau ada di halaman yang sama
            const star = document.querySelector(`[data-fav="${id}"]`);
            if (star) star.classList.remove('active');

            renderFavorites();
        });
    });
}

/* ---------- 5. FORM KONTAK ---------- */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
 
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const note = document.getElementById('form-note');
        if (note) {
            note.textContent = 'Pesan terkirim. Tim kami membalas dalam 1x24 jam.';
            note.classList.add('show');
        }
        form.reset();
    });
}
 
/* ---------- 6. JALANKAN SEMUA ---------- */
document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    setupNavbarScroll();
    setupReveal();
    setupQtyMini();
    setupAddToCart();
    updateBadge(false);
    renderCart();
    setupFavoriteStars();
    updateFavBadge();
    renderFavorites();
    setupContactForm();
});