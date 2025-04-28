let couponApplied = false; 

document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  autocomplete(document.getElementById("locationInput"), locations);


  const placeOrderBtn = document.querySelector(".place-order");
  const applyCouponBtn = document.querySelector(".apply-coupon");
  let discount = 0;

  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", function (e) {
      e.preventDefault(); 
      const couponCode = document.getElementById("couponInput").value.trim().toUpperCase();
      if (couponCode === "WELCOME") {
        discount = 0.10; 
        couponApplied = true;
        document.getElementById("discountMessage").innerText = "Coupon applied! You get 10% off.";
        loadCart(true);
      } else if (couponCode === "") {
        document.getElementById("discountMessage").innerText = "Please enter a coupon code.";
      } else {
        document.getElementById("discountMessage").innerText = "Invalid coupon code.";
      }
    });
  }

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();
  
      const name = document.getElementById("nameInput").value.trim();
      const email = document.getElementById("emailInput").value.trim();
      const phone = document.getElementById("phoneInput").value.trim();
      const location = document.getElementById("locationInput").value.trim();
      const serviceType = document.getElementById("serviceTypeInput").value.trim();
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = localStorage.getItem("totalItems") || "0";
      const itemNames = JSON.parse(localStorage.getItem("itemNames")) || [];
      const totalPrice = document.querySelector(".total-price")
        ? document.querySelector(".total-price").innerText.replace("Total (incl. 6% tax): $", "")
        : "0.00";
  
      
  
      if (!validateEmail(email)) {
        showModal("Invalid Email", "Please enter a valid email address.");
        return;
      }
  
      if (!validatePhone(phone)) {
        showModal("Invalid Phone", "Please enter a valid phone number (10 digits).");
        return;
      }
  
      if (!locations.includes(location)) {
        showModal("Invalid Location", "Please select a valid city from the list.");
        return;
      }
  
      if (serviceType !== "Dine-In" && serviceType !== "Takeout") {
        showModal("Invalid Service Type", "Please select a service type (Dine-In or Takeout).");
        return;
      }
  
      if (cart.length === 0) {
        showModal("Empty Cart", "Your cart is empty. Add items before placing an order!");
        return;
      }
      
      if (!name || !email || !phone || !location || !serviceType) {
        showModal("Checkout Failed", "Please fill out all required fields.");
        return;
      }
  
      const orderDetails = {
        name: name,
        email: email,
        phone: phone,
        location: location,
        serviceType: serviceType,
        cart: cart,
        totalItems: totalItems,
        itemNames: itemNames,
        totalPrice: totalPrice,
        discountApplied: couponApplied ? "Yes" : "No"
      };
  
      const receipt = `
        Order for: ${name}
        Email: ${email}
        Phone: ${phone}
        Location: ${location}
        Service: ${serviceType}
        Items: ${itemNames.join(", ")}
        Total Items: ${totalItems}
        Total Price: $${totalPrice}
        Discount Applied: ${couponApplied ? "Yes" : "No"}
      `;
  
      localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
      localStorage.setItem("receipt", receipt);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
  
      window.location.href = "payment.html";
    });
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10;
  }
  
});



function loadCart(couponApplied = false) {
  const container = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  container.innerHTML = "<h2>Your Cart</h2>";

  if (cart.length === 0) {
    container.innerHTML += "<p>Your cart is empty.</p>";
    localStorage.setItem("totalItems", "0");
    localStorage.setItem("itemNames", JSON.stringify([]));
    return;
  }

  let total = 0;
  let totalItems = 0;
  let itemNames = [];

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    totalItems += item.qty;
    itemNames.push(item.name);

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerHTML = `
      <div class="item-header">
        <input type="text" value="${item.name}" disabled />
        <span class="price">$${itemTotal.toFixed(2)}</span>
      </div>
      <div class="item-details-row">
        <div class="quantity-controls">
          <button class="qty-btn minus" onclick="updateQuantity(${index}, ${item.qty - 1})">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn plus" onclick="updateQuantity(${index}, ${item.qty + 1})">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})" title="Remove">X</button>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  if (couponApplied) {
    total *= 0.90; 
  }

  const TAX_RATE = 0.06;
  const taxAmount = total * TAX_RATE;
  const totalWithTax = total + taxAmount;

  const subtotalDiv = document.createElement("div");
  subtotalDiv.classList.add("subtotal-price");
  subtotalDiv.innerText = `Subtotal: $${total.toFixed(2)}`;
  container.appendChild(subtotalDiv);

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total-price");
  totalDiv.innerText = `Total (incl. 6% tax): $${totalWithTax.toFixed(2)}`;
  container.appendChild(totalDiv);

  localStorage.setItem("totalItems", totalItems.toString());
  localStorage.setItem("itemNames", JSON.stringify(itemNames));
}


function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(couponApplied);
}

function updateQuantity(index, newQty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (newQty < 1) newQty = 1;
  cart[index].qty = newQty;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(couponApplied);
}


function autocomplete(inp, arr) {
  let currentFocus;
  inp.addEventListener("input", function () {
    const val = this.value;
    closeAllLists();
    if (!val) return false;
    currentFocus = -1;
    const a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        const b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>" + arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function () {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1 && x) x[currentFocus].click();
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const dineBtn = document.getElementById('dineInBtn');
  const takeBtn = document.getElementById('takeoutBtn');
  const serviceInput = document.getElementById('serviceTypeInput');

  [dineBtn, takeBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      dineBtn.classList.remove('active');
      takeBtn.classList.remove('active');
      btn.classList.add('active');
      serviceInput.value = btn.textContent.trim();
    });
  });
});



const locations = [
  "Birmingham, AL", "Anchorage, AK", "Phoenix, AZ", "Little Rock, AR",
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA",
  "Denver, CO", "Bridgeport, CT", "Wilmington, DE",
  "Miami, FL", "Orlando, FL", "Tampa, FL", "Atlanta, GA",
  "Savannah, GA", "Athens, GA", "Augusta, GA", "Honolulu, HI",
  "Boise, ID", "Chicago, IL", "Indianapolis, IN", "Des Moines, IA",
  "Wichita, KS", "Louisville, KY", "New Orleans, LA", "Portland, ME",
  "Bangor, ME", "Baltimore, MD", "Boston, MA", "Springfield, MA",
  "Worcester, MA", "Detroit, MI", "Minneapolis, MN", "Jackson, MS",
  "St. Louis, MO", "Billings, MT", "Omaha, NE", "Las Vegas, NV",
  "Manchester, NH", "Concord, NH", "Newark, NJ", "Trenton, NJ",
  "Jersey City, NJ", "Albuquerque, NM", "New York, NY - Manhattan",
  "New York, NY - Brooklyn", "New York, NY - Queens", "Buffalo, NY",
  "Albany, NY", "Syracuse, NY", "Charlotte, NC", "Raleigh, NC",
  "Durham, NC", "Fargo, ND", "Columbus, OH", "Cleveland, OH",
  "Cincinnati, OH", "Oklahoma City, OK", "Portland, OR",
  "Philadelphia, PA", "Pittsburgh, PA", "Harrisburg, PA",
  "Providence, RI", "Charleston, SC", "Greenville, SC",
  "Sioux Falls, SD", "Nashville, TN", "Knoxville, TN",
  "Houston, TX", "Dallas, TX", "Austin, TX", "Salt Lake City, UT",
  "Burlington, VT", "Virginia Beach, VA", "Chantilly, VA",
  "Richmond, VA", "Alexandria, VA", "Norfolk, VA",
  "Seattle, WA", "Spokane, WA", "Charleston, WV", "Milwaukee, WI",
  "Madison, WI", "Cheyenne, WY", "Naperville, IL", "Plano, TX",
  "Scottsdale, AZ", "Chandler, AZ", "Reno, NV", "Boulder, CO",
  "Irvine, CA", "Santa Clara, CA", "Rochester, NY"
];

function showModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('messageModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('messageModal').classList.add('hidden');
}

