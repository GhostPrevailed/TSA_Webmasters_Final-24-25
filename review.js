const isAdmin = localStorage.getItem("isAdmin") === "true"; // Admin flag in localStorage

const defaultReviews = [
    {
        timestamp: Date.now() + 1,
        name: "Alice Johnson",
        message: "Absolutely loved the food! Will definitely come back.",
        rating: 5,
    },
    {
        timestamp: Date.now() + 2,
        name: "Bob Smith",
        message: "Great atmosphere and friendly staff. Highly recommend!",
        rating: 4,
    },
    {
        timestamp: Date.now() + 3,
        name: "Charlie Brown",
        message: "The food was good, but the service was a bit slow.",
        rating: 3,
    },
    {
        timestamp: Date.now() + 4,
        name: "Diana Prince",
        message: "Amazing experience! The desserts were to die for.",
        rating: 5,
    },
    {
        timestamp: Date.now() + 5,
        name: "Ethan Hunt",
        message: "Good food, but the wait time was longer than expected.",
        rating: 3,
    },
    {
        timestamp: Date.now() + 6,
        name: "Fiona Gallagher",
        message: "Loved the ambiance and the pasta was fantastic!",
        rating: 4,
    }
];

// Initialize localStorage with default reviews if empty
if (!localStorage.getItem("reviews")) {
    localStorage.setItem("reviews", JSON.stringify(defaultReviews));
}

// Pagination variables
let currentPage = 1; // Current page number
const reviewsPerPage = 5; // Number of reviews to show per page

// Submit review
const form = document.getElementById("reviewForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const rating = document.querySelectorAll(".star.selected").length;
    const message = document.getElementById("message").value;

    if (!name || !rating || !message) {
        alert("Please complete all fields.");
        return;
    }

    const review = {
        timestamp: Date.now(), // Unique ID based on timestamp
        name,
        message,
        rating: parseInt(rating),
    };

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    form.reset();
    displayReviews();
});

// Star rating system
const stars = document.querySelectorAll(".star");

stars.forEach(star => {
    star.addEventListener("mouseover", function () {
        const ratingValue = parseInt(this.getAttribute("data-value"));
        stars.forEach(star => {
            if (parseInt(star.getAttribute("data-value")) <= ratingValue) {
                star.classList.add("hover");
            } else {
                star.classList.remove("hover");
            }
        });
    });

    star.addEventListener("mouseout", function () {
        stars.forEach(star => {
            star.classList.remove("hover");
        });
    });

    star.addEventListener("click", function () {
        const ratingValue = parseInt(this.getAttribute("data-value"));
        stars.forEach(star => {
            if (parseInt(star.getAttribute("data-value")) <= ratingValue) {
                star.classList.add("selected");
            } else {
                star.classList.remove("selected");
            }
        });
    });
});

function displayReviews() {
    const reviewsContainer = document.getElementById("allReviews");
    reviewsContainer.innerHTML = ""; // Clear the existing reviews

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const totalPages = Math.ceil(reviews.length / reviewsPerPage); // Calculate total pages

    // If there are no reviews, display a message
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = "<p>No reviews yet. Be the first to leave a review!</p>";
        return;
    }

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = Math.min(startIndex + reviewsPerPage, reviews.length);

    // Display reviews for the current page
    for (let i = startIndex; i < endIndex; i++) {
        const review = reviews[i];
        const div = document.createElement("div");
        div.classList.add("review-card");

        // Create the star rating
        const starsDisplay = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

        div.innerHTML = `
            <h3>${review.name}</h3>
            <p class="stars">${starsDisplay}</p>
            <p>${review.message}</p>
        `;

        if (isAdmin) {
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.dataset.id = review.timestamp; // Use 'timestamp' as the unique ID
            deleteButton.innerText = "🗑 Delete";

            div.appendChild(deleteButton);

            deleteButton.addEventListener("click", function () {
                const id = parseInt(this.dataset.id);
                deleteReview(id);  // Pass the ID (timestamp) to deleteReview
            });
        }

        reviewsContainer.appendChild(div);
    }

    // Display pagination controls
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");

    // Previous button
    if (currentPage > 1) {
        paginationDiv.innerHTML += `
            <button class="prev-btn" onclick="changePage(currentPage - 1)">Previous</button>
        `;
    }

    // Page indicator
    paginationDiv.innerHTML += `<span>Page ${currentPage} of ${totalPages}</span>`;

    // Next button
    if (currentPage < totalPages) {
        paginationDiv.innerHTML += `
            <button class="next-btn" onclick="changePage(currentPage + 1)">Next</button>
        `;
    }

    reviewsContainer.appendChild(paginationDiv);
}

function changePage(page) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    if (page < 1 || page > totalPages) return; // Prevent out-of-bounds page numbers
    currentPage = page; // Update current page
    displayReviews(); // Re-display reviews for the new page
}

// Delete review
function deleteReview(id) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews = reviews.filter(review => review.timestamp !== id); // Use 'timestamp' to match the review ID

    localStorage.setItem("reviews", JSON.stringify(reviews)); // Update localStorage with the new reviews list
    displayReviews(); // Re-render the reviews list
}

// Initial render of reviews
displayReviews();