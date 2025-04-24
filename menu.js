// Expand effect on hover
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    menuItems.forEach(i => i.classList.remove('expanded'));
    item.classList.add('expanded');
  });
  item.addEventListener('mouseleave', () => {
    item.classList.remove('expanded');
  });
});

// Add to cart logic
function addToCart(button) {
  const itemDiv = button.closest('.menu-item');
  const name = itemDiv.getAttribute('data-name');
  const price = parseFloat(itemDiv.getAttribute('data-price'));
  const qtyDisplay = itemDiv.querySelector('.qty-display');
  const qty = parseInt(qtyDisplay.textContent);

  if (qty <= 0 || isNaN(qty)) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  const msg = itemDiv.querySelector('.added-msg');
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 1500);

  // Optionally reset qty to 1
  qtyDisplay.textContent = '1';
}

function increaseQty(button) {
    const display = button.closest('.qty-controls').querySelector('.qty-display');
    const val = parseInt(display.textContent);
    display.textContent = val + 1;
  }
  
  function decreaseQty(button) {
    const display = button.closest('.qty-controls').querySelector('.qty-display');
    const val = parseInt(display.textContent);
    if (val > 1) {
      display.textContent = val - 1;
    }
  }
  
