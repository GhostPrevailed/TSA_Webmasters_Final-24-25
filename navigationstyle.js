// Wait until the DOM content is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Select the element with the class 'waffle-menu' (the button/icon for toggling the menu)
   const waffleMenu = document.querySelector(".waffle-menu");
   // Select the element with the class 'nav-links' (the container for the navigation links)
   const navLinks = document.querySelector(".nav-links");
// Add a click event listener to the waffle menu
   waffleMenu.addEventListener("click", () => {
        // Toggle the 'show' class on the navigation links container
   // This adds or removes the 'show' class, controlling the visibility of the menu
       navLinks.classList.toggle("show");
   });
});

  // Highlight the current page in the nav menu
  document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav ul li a").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  });

