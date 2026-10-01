let allProducts = [];
let currentCategory = 'All';

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupSearch();
  setupCategoryButtons();
});

async function loadProducts(category = 'All', search = '') {
  try {
    let url = `/api/products?category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      allProducts = data.products;
      renderProducts(data.products);
    }
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
      <h3>No products found</h3>
      <p>Try searching for another keyword or selecting a different category.</p>
    </div>`;
    return;
  }

  container.innerHTML = products.map(p => {
    const minSelling = p.wholesalePrice + 100;
    const estProfit = p.suggestedSellingPrice - p.wholesalePrice;

    return `
      <div class="product-card">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
          <span class="supplier-tag">Verified Supplier</span>
        </div>
        <div class="product-body">
          <h3 class="product-title">${p.title}</h3>
          <div class="price-row">
            <span class="wholesale-price">₹${p.wholesalePrice}</span>
            <span class="mrp-price">₹${p.mrp}</span>
          </div>
          <div class="margin-highlight">
            Earn ~₹${estProfit} profit per order
          </div>
          <div class="card-actions" style="flex-direction: column; gap: 6px;">
            <button class="btn btn-whatsapp" onclick="openShareModal('${p.id}')">
              📱 Share on WhatsApp & Earn
            </button>
            <button class="btn btn-outline" onclick="openOrderModal('${p.id}')">
              🛒 Place Customer Order
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      loadProducts(currentCategory, e.target.value);
    });
  }
}

function setupCategoryButtons() {
  const buttons = document.querySelectorAll('.cat-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.cat;
      loadProducts(currentCategory);
    });
  });
}

// Share Modal Logic
let activeShareProduct = null;

function openShareModal(productId) {
  activeShareProduct = allProducts.find(p => p.id === productId);
  if (!activeShareProduct) return;

  document.getElementById('share-prod-title').innerText = activeShareProduct.title;
  document.getElementById('share-wholesale-price').innerText = '₹' + activeShareProduct.wholesalePrice;
  
  const sellingInput = document.getElementById('reseller-custom-price');
  sellingInput.value = activeShareProduct.suggestedSellingPrice;
  
  calculateMargin();

  const modal = document.getElementById('share-modal');
  modal.classList.add('active');
}

function calculateMargin() {
  if (!activeShareProduct) return;
  const sellingPrice = Number(document.getElementById('reseller-custom-price').value) || 0;
  const margin = sellingPrice - activeShareProduct.wholesalePrice;

  const marginVal = document.getElementById('calculated-margin');
  marginVal.innerText = '₹' + (margin > 0 ? margin : 0);
  if (margin < 0) {
    marginVal.style.color = '#ef4444';
  } else {
    marginVal.style.color = '#038d63';
  }
}

function generateWhatsAppShare() {
  if (!activeShareProduct) return;
  const customPrice = document.getElementById('reseller-custom-price').value;
  const text = `🛍️ *Special Offer For You!*\n\n*${activeShareProduct.title}*\n\n💰 Special Offer Price: *₹${customPrice}* (Free Delivery & Cash on Delivery Available)\n\n📌 High Quality Product | Limited Stock!\n\nReply "BUY" or message me your name and address to order now!`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
  closeModal('share-modal');
}

// Order Modal Logic
let activeOrderProduct = null;

function openOrderModal(productId) {
  activeOrderProduct = allProducts.find(p => p.id === productId);
  if (!activeOrderProduct) return;

  document.getElementById('order-prod-title').innerText = activeOrderProduct.title;
  document.getElementById('order-selling-price').value = activeOrderProduct.suggestedSellingPrice;

  const modal = document.getElementById('order-modal');
  modal.classList.add('active');
}

async function handlePlaceOrder(e) {
  e.preventDefault();
  if (!activeOrderProduct) return;

  const payload = {
    productId: activeOrderProduct.id,
    resellerSellingPrice: document.getElementById('order-selling-price').value,
    customerName: document.getElementById('cust-name').value,
    customerPhone: document.getElementById('cust-phone').value,
    customerAddress: document.getElementById('cust-address').value,
    paymentMode: document.getElementById('payment-mode').value
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      alert('🎉 ' + data.message);
      closeModal('order-modal');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Failed to place order.');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}
