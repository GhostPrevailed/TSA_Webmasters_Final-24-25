let couponApplied = false; // Track if a coupon is applied

document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  autocomplete(document.getElementById("locationInput"), locations);

  emailjs.init("QcdQ21deB4Pg8-w98"); // Replace with your actual EmailJS user ID

  const placeOrderBtn = document.querySelector(".place-order");
  const applyCouponBtn = document.querySelector(".apply-coupon");
  let discount = 0;

  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", function () {
      const couponCode = document.getElementById("couponInput").value;
      if (couponCode === "WELCOME") { // Example coupon code
        discount = 0.10; // 10% discount
        couponApplied = true; // Set coupon applied state
        document.getElementById("discountMessage").innerText = "Coupon applied! You get 10% off.";
        loadCart(true); // Reload cart to show updated total
      }
      else if (couponCode == null || couponCode == "") {
        document.getElementById("discountMessage").innerText = "Please enter a coupon code.";
      }
      else {
        document.getElementById("discountMessage").innerText = "Invalid coupon code.";
      }
    });
  }

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function () {
      const name = document.getElementById("nameInput").value;
      const email = document.getElementById("emailInput").value;
      const phone = document.getElementById("phoneInput").value;
      const location = document.getElementById("locationInput").value;
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (!email) {
        alert("Please enter your email.");
        return;
      }

      let orderDetails = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\n\nOrder Details:\n`;
      let total = 0;

      cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        orderDetails += `${item.name} (Qty: ${item.qty}) - $${itemTotal.toFixed(2)}\n`;
      });

      // Apply discount
      const discountAmount = total * discount;
      total -= discountAmount;

      orderDetails += `\nTotal after discount: $${total.toFixed(2)}`;

      // Store order details in local storage for payment page
      localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
      localStorage.setItem("totalAmount", total.toFixed(2));

      // Redirect to payment page
      window.location.href = "payment.html";
    });
  }
});

function loadCart(couponApplied = false) {
  const container = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  container.innerHTML = "<h2>Your Cart</h2>";
  if (cart.length === 0) {
    container.innerHTML += "<p>Your cart is empty.</p>";
    return;
  }
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerHTML = `
      <input type="text" value="${item.name}" disabled />
      <div class="qty-controls">
        <button class="qty-btn minus" onclick="updateQuantity(${index}, ${item.qty - 1})">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn plus" onclick="updateQuantity(${index}, ${item.qty + 1})">+</button>
      </div>
      <span class="price">$${itemTotal.toFixed(2)}</span>
      <button class="remove-btn" onclick="removeItem(${index})" title="Remove">X</button>
    `;
    container.appendChild(itemDiv);
  });

  // Apply discount if a coupon has been applied
  if (couponApplied) {
    total *= 0.90; // Apply 10% discount
  }

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total-price");
  totalDiv.innerText = `Total: $${total.toFixed(2)}`;
  container.appendChild(totalDiv);
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(couponApplied); // Reload the cart to reflect changes
}

const locations = [
  "Birmingham, AL", "Anchorage, AK", "Phoenix, AZ", "Little Rock, AR",
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA",
  "Denver, CO", "Bridgeport, CT", "Wilmington, DE",
  "Miami, FL", "Orlando, FL", "Tampa, FL", "Atlanta, GA",
  "Savannah, GA", "Athens, GA", "Augusta, GA",
  "Honolulu, HI", "Boise, ID", "Chicago, IL", "Indianapolis, IN",
  "Des Moines, IA", "Wichita, KS", "Louisville, KY", "New Orleans, LA",
  "Portland, ME", "Bangor, ME", "Baltimore, MD", "Boston, MA",
  "Springfield, MA", "Worcester, MA", "Detroit, MI",
  "Minneapolis, MN", "Jackson, MS", "St. Louis, MO", "Billings, MT",
  "Omaha, NE", "Las Vegas, NV", "Manchester, NH", "Concord, NH",
  "Newark, NJ", "Trenton, NJ", "Jersey City, NJ",
  "Albuquerque, NM", "New York, NY - Manhattan", "New York, NY - Brooklyn",
  "New York, NY - Queens", "Buffalo, NY", "Albany, NY", "Syracuse, NY",
  "Charlotte, NC", "Raleigh, NC", "Durham, NC", "Fargo, ND",
  "Columbus, OH", "Cleveland, OH", "Cincinnati, OH", "Oklahoma City, OK",
  "Portland, OR", "Philadelphia, PA", "Pittsburgh, PA", "Harrisburg, PA",
  "Providence, RI", "Charleston, SC", "Greenville, SC",
  "Sioux Falls, SD", "Nashville, TN", "Knoxville, TN", "Houston, TX",
  "Dallas, TX", "Austin, TX", "Salt Lake City, UT",
  "Burlington, VT", "Virginia Beach, VA", "Herndon, VA", "Richmond, VA",
  "Alexandria, VA", "Norfolk, VA", "Seattle, WA", "Spokane, WA",
  "Charleston, WV", "Milwaukee, WI", "Madison, WI", "Cheyenne, WY",
  "Naperville, IL", "Plano, TX", "Scottsdale, AZ", "Chandler, AZ",
  "Reno, NV", "Boulder, CO", "Irvine, CA", "Santa Clara, CA",
  "Rochester, NY"
];

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
    for (let i = 0; i < x.length; i++) x[i].classList.remove("autocomplete-active");
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

function updateQuantity(index, newQty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (newQty < 1) newQty = 1; // Ensure quantity is at least 1
  cart[index].qty = newQty; // Update the quantity in the cart
  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
  loadCart(couponApplied); // Reload the cart to reflect changes
}