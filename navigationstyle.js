document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });
  
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav ul li a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
