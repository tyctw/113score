// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = document.getElementById('closeMenu');
  const navOverlay = document.getElementById('navOverlay');

  // Open menu with animation
  menuToggle.addEventListener('click', function() {
    navLinks.classList.add('show');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    
    // Animate menu items
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach((item, index) => {
      item.style.opacity = 0;
      item.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = 1;
        item.style.transform = 'translateX(0)';
      }, 100 + (index * 50));
    });
  });

  // Close menu with animation
  function closeNav() {
    navLinks.classList.remove('show');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset menu item animations
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      item.style.transition = 'none';
    });
  }

  closeMenu.addEventListener('click', closeNav);
  navOverlay.addEventListener('click', closeNav);

  // Close menu when nav link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
});