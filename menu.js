fetch("menu.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("menu-list");

    const bestMenus = data
      .filter(item => item.best === true)
      .slice(0, 3);

    bestMenus.forEach(item => {
      renderCard(item, container, true);
    });
  });

function renderCard(item, container, isBest = false) {
    const imageUrl = item.gambar && item.gambar.trim() !== ""
  ? item.gambar
  : "assets/images/no-image.png";
  const card = document.createElement("div");
  card.className =
    "group bg-background-light dark:bg-background-dark rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-stone-100 dark:border-stone-800";

  card.innerHTML = `
    <div class="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4">
      <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
           style="background-image: url('${imageUrl}')"></div>

      ${isBest ? `
        <div class="absolute top-3 right-3 bg-white dark:bg-stone-800 px-2 py-1 rounded-md text-xs font-bold shadow-md">
          Best Seller
        </div>` : ""}
    </div>

    <div class="flex justify-between items-start mb-2">
      <h4 class="text-xl font-bold text-text-main dark:text-white">${item.nama}</h4>
      <span class="text-primary font-bold">
        Rp ${item.harga.toLocaleString("id-ID")}
      </span>
    </div>

    <p class="text-sm text-text-muted dark:text-gray-400 mb-4 line-clamp-2">
      ${item.deskripsi}
    </p>

    <button onclick="addToCart('${item.nama}', ${item.harga})"
      class="w-full py-2.5 rounded-lg border-2 border-primary/20
             text-primary font-bold hover:bg-primary hover:text-white
             transition-colors flex items-center justify-center gap-2">
      <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
      Add to Order
    </button>
  `;

  container.appendChild(card);
}

let cart = [];

function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalQty > 0) {
    badge.textContent = totalQty;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function addToCart(nama, harga) {
  console.log("Tambah ke cart:", nama);

  const item = cart.find(i => i.nama === nama);
  if (item) {
    item.qty++;
  } else {
    cart.push({ nama, harga, qty: 1 });
  }

  renderCart();
  updateCartBadge();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.harga * item.qty;
    total += subtotal;

    container.innerHTML += `
      <div class="flex justify-between">
        <div>
          <p class="font-semibold">${item.nama}</p>
          <p class="text-gray-500">Qty: ${item.qty}</p>
        </div>
        <span>Rp ${subtotal.toLocaleString("id-ID")}</span>
      </div>
    `;
  });

  totalEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

function orderWA() {
  if (cart.length === 0) {
    alert("Pesanan masih kosong");
    return;
  }

  let message = "Halo, saya ingin memesan:\n\n";
  let total = 0;

  cart.forEach((item, i) => {
    const subtotal = item.harga * item.qty;
    total += subtotal;
    message += `${i + 1}. ${item.nama} (x${item.qty}) - Rp ${subtotal.toLocaleString("id-ID")}\n`;
  });

  message += `\nTotal: Rp ${total.toLocaleString("id-ID")}\n\n`;
  message += "Alamat pengiriman:\nCatatan:\n\nTerima kasih 🙏";

  const phone = "6289614414526";
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  cart = [];
  renderCart();
  updateCartBadge();
}
