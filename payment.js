document.getElementById("paymentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, '');
  const expiryDate = document.getElementById("expiryDate").value;
  const cvv = document.getElementById("cvv").value;

  if (cardNumber.length < 15 || cardNumber.length > 16) {
    return showModal("Card number must be 15 or 16 digits long.");
  }

  if (cvv.length !== 3) {
    return showModal("CVV must be 3 digits long.");
  }

  console.log("Processing payment for card:", cardNumber);

  showModal("Payment successful! Thank you for your order.", () => {
    localStorage.removeItem("orderDetails");
    window.location.href = "home.html";
  });
});

function showModal(message, onClose) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const modalClose = document.getElementById("modalClose");

  modalMessage.textContent = message;
  modal.classList.remove("hidden");

  modalClose.onclick = () => {
    modal.classList.add("hidden");
    if (onClose) onClose();
  };
}
