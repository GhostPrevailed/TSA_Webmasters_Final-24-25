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
  
  function showInfo(button) {
    const item = button.closest('.menu-item');
    const name = item.getAttribute('data-name') || 'No name';
    const ingredients = item.getAttribute('data-ingredients') || 'Ingredients not available.';
    const serving = item.getAttribute('data-serving') || 'Serving size not available.';
    const nutrition = item.getAttribute('data-nutrition') || '';
  
    document.getElementById('infoTitle').textContent = name;
  
    document.getElementById('infoIngredients').innerHTML = `
      <strong>Ingredients:</strong><br>${ingredients}
    `;
  
    const nutritionLines = nutrition.split(',').map(line => line.trim());
    const formattedNutrition = nutritionLines.map(line => {
      if (line.toLowerCase().startsWith('calories')) {
        return `<div class="nutrition-calories">${line}</div>`;
      }
      return `<div class="nutrition-line">${line}</div>`;
    }).join('');
      
    document.getElementById('infoNutrition').innerHTML = `
      <h3>Nutrition Facts</h3>
      <div class="serving-size">Serving Size: ${serving}</div>
      ${formattedNutrition}
    `;
  
    document.getElementById('infoPopup').style.display = 'block';
  }
  
  
  
  function closeInfo() {
    document.getElementById('infoPopup').style.display = 'none';
  }
  
