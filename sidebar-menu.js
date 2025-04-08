// Right-side menu functionality
class SidebarMenu {
  constructor() {
    this.addMenuElements();
    this.setupEventListeners();
  }
  
  addMenuElements() {
    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('nav-links');
    menuContainer.id = 'sidebarMenu';
    
    // Create menu content
    menuContainer.innerHTML = `
      <div class="nav-header">
        <h3 class="nav-title">功能選單</h3>
        <p class="nav-subtitle">查看更多功能選項</p>
        <button class="close-menu" id="closeMenu">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="nav-links-container">
        <a href="#" class="nav-link"><i class="fas fa-home"></i> 首頁</a>
        <a href="#" class="nav-link"><i class="fas fa-chart-bar"></i> 成績統計</a>
        <a href="#" class="nav-link"><i class="fas fa-school"></i> 學校資訊</a>
        <a href="#" class="nav-link"><i class="fas fa-book"></i> 升學資源</a>
        <a href="#" class="nav-link"><i class="fas fa-question-circle"></i> 常見問題</a>
      </div>
      <div class="nav-footer">
        &copy; 2025 113會考序位資料
      </div>
    `;
    
    // Create overlay for closing menu when clicking outside
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    overlay.id = 'navOverlay';
    
    // Add to body
    document.body.appendChild(menuContainer);
    document.body.appendChild(overlay);
  }
  
  setupEventListeners() {
    // Add menu toggle button to header
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions) {
      const menuToggle = document.createElement('button');
      menuToggle.id = 'menuToggle';
      menuToggle.classList.add('menu-toggle');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      
      // Insert before dark mode toggle
      const darkModeToggle = document.getElementById('darkModeToggle');
      headerActions.insertBefore(menuToggle, darkModeToggle);
      
      // Set up event listeners
      menuToggle.addEventListener('click', () => this.openMenu());
      document.getElementById('closeMenu').addEventListener('click', () => this.closeMenu());
      document.getElementById('navOverlay').addEventListener('click', () => this.closeMenu());
    }
  }
  
  openMenu() {
    document.getElementById('sidebarMenu').classList.add('show');
    document.getElementById('navOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  closeMenu() {
    document.getElementById('sidebarMenu').classList.remove('show');
    document.getElementById('navOverlay').classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SidebarMenu();
});