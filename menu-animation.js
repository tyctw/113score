// Menu animation effects
document.addEventListener('DOMContentLoaded', function() {
  // Ripple effect for menu items
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mousedown', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Hover effect for close button
  const closeButton = document.querySelector('.close-menu');
  if (closeButton) {
    closeButton.addEventListener('mouseover', function() {
      this.classList.add('hover-effect');
    });
    
    closeButton.addEventListener('mouseout', function() {
      this.classList.remove('hover-effect');
    });
  }
});

