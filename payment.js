document.getElementById("paymentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, ''); // Remove spaces
  const expiryDate = document.getElementById("expiryDate").value;
  const cvv = document.getElementById("cvv").value;

  // Validate card number and CVV
  if (cardNumber.length < 15 || cardNumber.length > 16) {
    alert("Card number must be 15 or 16 digits long.");
    return;
  }

  if (cvv.length !== 3) {
    alert("CVV must be 3 digits long.");
    return;
  }

  // Here you would typically send the payment details to your payment processor
  console.log("Processing payment for card:", cardNumber);

  // Simulate a successful payment
  alert("Payment successful! Thank you for your order.");
  localStorage.removeItem("orderDetails"); // Clear order details
  window.location.href = "home.html"; // Redirect to home page
});