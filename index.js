document.addEventListener('DOMContentLoaded', function () {

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });


  let index = 0;
  const testimonials = document.querySelectorAll('.testimonial');

  function showTestimonial() {
    testimonials.forEach(t => t.classList.remove('active'));
    testimonials[index].classList.add('active');
    index = (index + 1) % testimonials.length;
  }

  setInterval(showTestimonial, 3000);
  showTestimonial();

   const reviewForm = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-container');

  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && message) {
      const review = document.createElement('div');
      review.classList.add('review');
      review.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
      reviewsContainer.prepend(review);

       reviewForm.reset();
    }
  });

   const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach((el) => {
    el.classList.add('visible');
  });
});