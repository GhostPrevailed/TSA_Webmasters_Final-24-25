document.addEventListener("DOMContentLoaded", () => {
  // Hamburger button and nav toggle
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  
  // Toggle the menu open/close when the hamburger button is clicked
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });
  
  // Highlight the current page in the nav menu
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav ul li a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
