document.addEventListener("DOMContentLoaded", function() {
   
});

document.getElementById("paymentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, '');
  const expiryDate = document.getElementById("expiryDate").value.trim();
  const cvv = document.getElementById("cvv").value;

  const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;   
  
  if (cardNumber.length < 15 || cardNumber.length > 16) {
    return showModal("Card number must be 15 or 16 digits long.");
  }

  if (!expiryPattern.test(expiryDate)) {
    return showModal("Expiry date must be in MM/YY format.");
  }

  if (cvv.length !== 3) {
    return showModal("CVV must be 3 digits long.");
  }

  console.log("Processing payment for card:", cardNumber);

  sendEmailAfterPayment()
    .then(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem("totalItems");
      localStorage.removeItem("itemNames");
      localStorage.removeItem("orderDetails");
      localStorage.removeItem("receipt");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");

      showModal("Payment successful! Thank you for your order.", () => {
        window.location.href = "home.html";
      });
    })
    .catch((error) => {
      console.error("Email sending failed:", error);
      showModal("Payment succeeded but sending receipt email failed. Please contact support.", () => {
        window.location.href = "home.html";
      });
    });
});


function sendEmailAfterPayment() {
  const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
  if (!orderDetails) {
    console.error("Order details not found in localStorage");
  }

  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    console.log("Can't find user email");
  }
  const userName = localStorage.getItem("userName");
  const receipt = localStorage.getItem("receipt");

  if (!orderDetails || !userEmail || !userName) {
    return Promise.reject("Missing order information for email.");
  }

  const emailParams = {
    email: userEmail,
    name: userName,
    order_details: `Hi ${userName},\n\nThank you for your order!\n\nReceipt:\n${receipt}\n\nWe appreciate your business!`
  };

  console.log(userName, userEmail, receipt, orderDetails);

  return emailjs.send("service_g67eg1g", "template_dvm4ova", emailParams);
}

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