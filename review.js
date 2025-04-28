const isAdmin = localStorage.getItem("isAdmin") === "true";

const defaultReviews = [
    {
      timestamp: 1,
      name: "Alice",
      rating: 5,
      message: "Absolutely loved it! Will be coming back for sure."
    },
    { 
      timestamp: 2,
      name: "Bob",
      rating: 4,
      message: "Great experience overall. Just a minor delay in service."
    },
    {
      timestamp: 3,
      name: "Charlie",
      rating: 5,
      message: "Top notch! Highly recommend to everyone."
    },
    {
      timestamp: 4,
      name: "Dana",
      rating: 3,
      message: "Good, but there's room for improvement."
    },
    {
      timestamp: 5,
      name: "Eli",
      rating: 4,
      message: "Pleasantly surprised by the quality!"
    },
    {
      timestamp: 6,
      name: "Fay",
      rating: 5,
      message: "Incredible experience from start to finish."
    },
  ];
  

const form = document.getElementById("reviewForm");
const reviewsContainer = document.getElementById("allReviews");
const paginationControls = document.getElementById("pagination");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const reviewsPerPage = 5;

const stars = document.querySelectorAll(".star");
stars.forEach((star) => {
  star.addEventListener("mouseover", () => {
    const value = parseInt(star.getAttribute("data-value"));
    stars.forEach((s) =>
      s.classList.toggle("hover", parseInt(s.dataset.value) <= value)
    );
  });

  star.addEventListener("mouseout", () =>
    stars.forEach((s) => s.classList.remove("hover"))
  );

  star.addEventListener("click", () => {
    const value = parseInt(star.getAttribute("data-value"));
    stars.forEach((s) =>
      s.classList.toggle("selected", parseInt(s.dataset.value) <= value)
    );
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();  

  const name = document.getElementById("name").value.trim();
  const rating = document.querySelectorAll(".star.selected").length;
  const message = document.getElementById("message").value.trim();

  let hasError = false;

   document.getElementById("name").classList.remove("input-error");
  document.getElementById("message").classList.remove("input-error");
  document.querySelector(".stars").classList.remove("stars-error");

     
  if (!name) {
    document.getElementById("name").classList.add("input-error");
    hasError = true;
  }

   if (rating === 0) {
    document.querySelector(".stars").classList.add("stars-error");
    hasError = true;
  }

   if (!message) {
    document.getElementById("message").classList.add("input-error");
    hasError = true;
  }

  if (hasError) {
    return;  
  }

   const newReview = {
    timestamp: Date.now(),
    name,
    rating,
    message,
  };

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push(newReview);
  localStorage.setItem("reviews", JSON.stringify(reviews));

  form.reset();
  stars.forEach((s) => s.classList.remove("selected"));
  document.querySelector(".stars").classList.remove("stars-error");

  currentPage = Math.ceil(reviews.length / reviewsPerPage);
  displayReviews();
  showReviewSuccessPopup();
});

 
stars.forEach((star) => {
  star.addEventListener("click", () => {
    document.querySelector(".stars").classList.remove("stars-error");
  });
});


function deleteReview(timestamp) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const filtered = reviews.filter((r) => r.timestamp !== timestamp);
  localStorage.setItem("reviews", JSON.stringify(filtered));
  const maxPage = Math.ceil(filtered.length / reviewsPerPage);
  if (currentPage > maxPage) currentPage = maxPage;
  displayReviews();
}

function displayReviews() {
    const stored = JSON.parse(localStorage.getItem("reviews")) || [];
    const combined = [...defaultReviews, ...stored];
    combined.sort((a, b) => b.timestamp - a.timestamp);
  
    const totalPages = Math.max(1, Math.ceil(combined.length / reviewsPerPage));
    const start = (currentPage - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    const currentReviews = combined.slice(start, end);
    
    reviewsContainer.innerHTML = "";
  
    if (currentReviews.length === 0) {
      reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    } else {
      currentReviews.forEach((r) => {
        const div = document.createElement("div");
        div.className = "review-card";
        const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
        div.innerHTML = `
          <h3>${r.name}</h3>
          <p>${stars}</p>
          <p>${r.message}</p>
        `;
        if (isAdmin && r.timestamp !== 1 && r.timestamp !== 2 && r.timestamp !== 3 && r.timestamp !== 4 && r.timestamp !== 5 && r.timestamp !== 6) {
          const btn = document.createElement("button");
          btn.textContent = "🗑 Delete";
          btn.className = "delete-btn";
          btn.onclick = () => deleteReview(r.timestamp);
          div.appendChild(btn);
        }
        reviewsContainer.appendChild(div);
      });
    }
  
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }
  

prevBtn.addEventListener("click", () => {
    const stored = JSON.parse(localStorage.getItem("reviews")) || [];
    const combined = [...defaultReviews, ...stored];
    const totalPages = Math.max(1, Math.ceil(combined.length / reviewsPerPage));
  
    if (currentPage > 1) {
      currentPage--;
      displayReviews();
    }
  });
  
nextBtn.addEventListener("click", () => {
    const stored = JSON.parse(localStorage.getItem("reviews")) || [];
    const combined = [...defaultReviews, ...stored];
    const totalPages = Math.max(1, Math.ceil(combined.length / reviewsPerPage));
    
  if (currentPage < totalPages) {
    currentPage++;
    displayReviews();
  }
});

displayReviews();
function showReviewSuccessPopup() {
  const popup = document.getElementById("reviewSuccessPopup");
  popup.classList.remove("hidden");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 400);  
  }, 2500);  
}
