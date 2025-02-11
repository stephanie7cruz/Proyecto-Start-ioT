document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll(".scroll-effect");
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, {
      threshold: 0.5
    });
  
    elements.forEach(element => {
      observer.observe(element);
    });
  });
  