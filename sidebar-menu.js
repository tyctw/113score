// Right-side menu functionality
class SidebarMenu {
  constructor() {
    this.addMenuElements();
    this.setupEventListeners();
  }
  
  addMenuElements() {
    // Create menu container
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('sidebar-menu');
    menuContainer.id = 'sidebarMenu';
    
    // Create menu content
    menuContainer.innerHTML = `
      <div class="sidebar-header">
        <h3 class="sidebar-title">功能選單</h3>
        <p class="sidebar-subtitle">查看更多功能選項</p>
        <button class="close-menu" id="closeMenu">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="sidebar-links-container">
        <a href="#" class="sidebar-link"><i class="fas fa-home"></i> 首頁</a>
        <a href="#" class="sidebar-link"><i class="fas fa-chart-bar"></i> 成績統計</a>
        <a href="#" class="sidebar-link"><i class="fas fa-school"></i> 學校資訊</a>
        <a href="#" class="sidebar-link"><i class="fas fa-book"></i> 升學資源</a>
        <a href="#" class="sidebar-link"><i class="fas fa-question-circle"></i> 常見問題</a>
      </div>
      <div class="sidebar-footer">
        &copy; 2025 113會考序位資料
      </div>
    `;
    
    // Create overlay for closing menu when clicking outside
    const overlay = document.createElement('div');
    overlay.classList.add('sidebar-overlay');
    overlay.id = 'sidebarOverlay';
    
    // Add to body
    document.body.appendChild(menuContainer);
    document.body.appendChild(overlay);
  }
  
  setupEventListeners() {
    // The menu toggle is already in the header, so we don't need to add it again
    // Add menu toggle button to header
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions) {
      // Set up event listeners for the existing menu toggle in the header
      const existingMenuToggle = document.getElementById('menuToggle');
      if (existingMenuToggle) {
        existingMenuToggle.addEventListener('click', () => this.openMenu());
      }
      
      document.getElementById('closeMenu').addEventListener('click', () => this.closeMenu());
      document.getElementById('sidebarOverlay').addEventListener('click', () => this.closeMenu());
    }
  }
  
  openMenu() {
    document.getElementById('sidebarMenu').classList.add('show');
    document.getElementById('sidebarOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  closeMenu() {
    document.getElementById('sidebarMenu').classList.remove('show');
    document.getElementById('sidebarOverlay').classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SidebarMenu();
});