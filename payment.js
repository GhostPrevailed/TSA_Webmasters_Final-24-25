document.addEventListener("DOMContentLoaded", function() {
});

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

  // Send the email first, THEN show the modal
  sendEmailAfterPayment()
    .then(() => {
      showModal("Payment successful! Thank you for your order.", () => {
        localStorage.removeItem("orderDetails");
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
  if(!userEmail){
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
