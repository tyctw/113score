// Main application script
document.addEventListener('DOMContentLoaded', function() {
  // Constants
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf9NdevMRBrHNtKId9qLcz2GmSXj26UY27ihHW_E2_N6Lj6CA0IaRqIheEWoDpKhebYA/exec';

  // DOM Elements
  const tableContainer = document.getElementById('tableContainer');
  const subjectFilter = document.getElementById('subjectFilter');
  const gradeFilter = document.getElementById('gradeFilter');
  const searchInput = document.getElementById('searchInput');
  const resetFilters = document.getElementById('resetFilters');
  const backToTopButton = document.getElementById('backToTop');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const loading = document.getElementById('loading');
  const statsContainer = document.getElementById('statsContainer');

  // State
  let allData = [];
  // Initialize enhanced data display
  const dataDisplay = new EnhancedDataDisplay();
  
  // Initialize loading animator
  const loadingAnimator = new LoadingAnimator('loading', {
    type: 'blocks', 
    color: '#4a90e2',
    size: 'medium',
    message: '載入資料中...',
    showMessage: true
  });

  fetchData();

  function fetchData() {
    // Show loading animator
    loadingAnimator.show();
    tableContainer.innerHTML = '';

    axios.get(SCRIPT_URL)
      .then(response => {
        allData = response.data;
        // Use the enhanced data display
        dataDisplay.setData(allData);
        loadingAnimator.hide();
        
        // Update stats
        updateStats(allData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        loadingAnimator.hide();
        tableContainer.innerHTML = '<p>載入資料時發生錯誤。請重新整理頁面再試。</p>';
      });
  }

  function updateStats(data) {
    if (!statsContainer) return;
    
    const totalRecords = data.length;
    const topGrades = data.reduce((sum, row) => 
      sum + row.slice(0, 5).filter(g => g === 'A++' || g === 'A+').length, 0);
    
    // Calculate average score (based on column 9 - "積分")
    let avgScore = 0;
    if (data.length > 0) {
      const scores = data.map(row => parseFloat(row[9] || 0));
      avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
    
    // Update stats display
    document.getElementById('totalResults').textContent = totalRecords;
    document.getElementById('topGrades').textContent = topGrades;
    document.getElementById('averageScore').textContent = avgScore.toFixed(2);
  }

  function applyFilters() {
    const filters = {
      subject: subjectFilter.value,
      grade: gradeFilter.value,
      search: searchInput.value.toLowerCase()
    };
    
    dataDisplay.applyFilters(filters);
  }

  searchInput.addEventListener('input', applyFilters);
  subjectFilter.addEventListener('change', applyFilters);
  gradeFilter.addEventListener('change', applyFilters);

  resetFilters.addEventListener('click', function() {
    subjectFilter.value = '';
    gradeFilter.value = '';
    searchInput.value = '';
    dataDisplay.setData(allData);
  });

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  particlesJS.load('particles', 'particles.json', function() {
    console.log('particles.js loaded - callback');
  });

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  const closeMenu = document.getElementById('closeMenu');

  menuToggle.addEventListener('click', function() {
    navLinks.classList.add('show');
    navOverlay.classList.add('show');
  });

  closeMenu.addEventListener('click', function() {
    navLinks.classList.remove('show');
    navOverlay.classList.remove('show');
  });

  navOverlay.addEventListener('click', function() {
    navLinks.classList.remove('show');
    navOverlay.classList.remove('show');
  });

  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener('keyup', function(e) {
    if (e.key == 'PrintScreen') {
      navigator.clipboard.writeText('');
      alert('截圖功能已被禁用');
    }
  });

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('selectstart', function() {
    return false;
  });
});