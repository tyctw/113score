// Enhanced data display functionality
class EnhancedDataDisplay {
  constructor() {
    this.tableContainer = document.getElementById('tableContainer');
    this.statsContainer = document.getElementById('statsContainer');
    this.currentPage = 1;
    this.rowsPerPage = 15;
    this.data = [];
    this.filteredData = [];

    // Setup event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  // Set data and render
  setData(data) {
    this.data = data;
    this.filteredData = [...data];
    this.renderTable();
    this.renderStats();
  }

  // Apply filters
  applyFilters(filters) {
    this.filteredData = this.data.filter(row => {
      // Subject filter
      if (filters.subject && filters.grade) {
        const subjectIndex = parseInt(filters.subject);
        if (row[subjectIndex] !== filters.grade) return false;
      }

      // Grade filter
      if (filters.grade && !filters.subject) {
        if (!row.slice(0, 5).some(g => g === filters.grade)) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!row.some(cell => cell.toString().toLowerCase().includes(searchLower))) return false;
      }

      // Min score filter (column 10 - 積分)
      if (filters.minScore && !isNaN(filters.minScore)) {
        const score = parseFloat(row[10] || 0);
        if (score < filters.minScore) return false;
      }

      // Max score filter (column 10 - 積分)
      if (filters.maxScore && !isNaN(filters.maxScore)) {
        const score = parseFloat(row[10] || 0);
        if (score > filters.maxScore) return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.renderTable();
    this.renderStats();
    this.updateFilterTags(filters);
  }

  // New method to update filter tags
  updateFilterTags(filters) {
    const filterTags = document.getElementById('filterTags');
    if (!filterTags) return;
    
    filterTags.innerHTML = '';
    
    // Create a tag for each active filter
    if (filters.subject && filters.grade) {
      const subjectNames = ['國文', '數學', '英文', '社會', '自然', '作文'];
      const subjectIndex = parseInt(filters.subject);
      this.addFilterTag(filterTags, `${subjectNames[subjectIndex]}: ${filters.grade}`, 'subject-grade');
    } else if (filters.grade) {
      this.addFilterTag(filterTags, `成績: ${filters.grade}`, 'grade');
    }
    
    if (filters.search) {
      this.addFilterTag(filterTags, `搜尋: ${filters.search}`, 'search');
    }
    
    if (filters.minScore && !isNaN(filters.minScore)) {
      this.addFilterTag(filterTags, `最低積分: ${filters.minScore}`, 'min-score');
    }
    
    if (filters.maxScore && !isNaN(filters.maxScore)) {
      this.addFilterTag(filterTags, `最高積分: ${filters.maxScore}`, 'max-score');
    }
  }
  
  // Helper method to add a filter tag
  addFilterTag(container, text, filterType) {
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    tag.innerHTML = `
      ${text}
      <span class="filter-tag-remove" data-filter="${filterType}">
        <i class="fas fa-times"></i>
      </span>
    `;
    
    // Add click handler to remove tag
    tag.querySelector('.filter-tag-remove').addEventListener('click', () => {
      this.removeFilter(filterType);
    });
    
    container.appendChild(tag);
  }
  
  // Remove a specific filter
  removeFilter(filterType) {
    const subjectFilter = document.getElementById('subjectFilter');
    const gradeFilter = document.getElementById('gradeFilter');
    const searchInput = document.getElementById('searchInput');
    const minScoreFilter = document.getElementById('minScoreFilter');
    const maxScoreFilter = document.getElementById('maxScoreFilter');
    
    switch(filterType) {
      case 'subject-grade':
        subjectFilter.value = '';
        gradeFilter.value = '';
        break;
      case 'grade':
        gradeFilter.value = '';
        break;
      case 'search':
        searchInput.value = '';
        break;
      case 'min-score':
        minScoreFilter.value = '';
        break;
      case 'max-score':
        maxScoreFilter.value = '';
        break;
    }
    
    // Re-apply filters
    const filters = {
      subject: subjectFilter.value,
      grade: gradeFilter.value,
      search: searchInput.value.toLowerCase(),
      minScore: minScoreFilter.value,
      maxScore: maxScoreFilter.value
    };
    
    this.applyFilters(filters);
  }

  // Render table with pagination
  renderTable() {
    if (!this.tableContainer) return;

    const startIdx = (this.currentPage - 1) * this.rowsPerPage;
    const endIdx = startIdx + this.rowsPerPage;
    const pageData = this.filteredData.slice(startIdx, endIdx);

    // Create table
    const table = document.createElement('table');
    table.className = 'data-table';

    // Create headers
    const headers = ['國文', '數學', '英文', '社會', '自然', '作文', '比率區間', '序位區間', '分數', '積點', '積分'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    
    // Show empty state message if no data
    if (pageData.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = headers.length;
      emptyCell.className = 'empty-state';
      emptyCell.innerHTML = `
        <div class="empty-state-icon">
          <i class="fas fa-search"></i>
        </div>
        <p class="empty-state-message">沒有符合條件的資料</p>
      `;
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      // Render data rows
      pageData.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach((header, i) => {
          const td = document.createElement('td');
          td.setAttribute('data-label', header);

          // Format cell content
          if (i >= 0 && i <= 4) {
            const grade = row[i] || '';
            const gradeSpan = document.createElement('span');
            
            if (grade === '' || grade === '未取得') {
              gradeSpan.className = 'grade-badge grade-none';
              gradeSpan.textContent = '未取得';
            } else {
              gradeSpan.className = `grade-badge grade-${grade.toLowerCase().replace(/\+/g, '-plus')}`;
              gradeSpan.textContent = grade;
            }
            
            td.appendChild(gradeSpan);
          } else if (i === 5) { // Special handling for writing score (作文)
            const writingScore = row[i] || '';
            const gradeSpan = document.createElement('span');
            
            // Apply different colors based on writing score
            if (['1', '2', '3'].includes(writingScore)) {
              gradeSpan.className = 'grade-badge grade-writing-low';
            } else if (['4', '5', '6'].includes(writingScore)) {
              gradeSpan.className = 'grade-badge grade-writing-high';
            } else {
              gradeSpan.className = 'grade-badge grade-none';
              gradeSpan.textContent = '未取得';
            }
            
            if (writingScore) {
              gradeSpan.textContent = writingScore;
            }
            
            td.appendChild(gradeSpan);
          } else {
            td.textContent = row[i] || '';
          }

          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);

    // Clear container and add table
    this.tableContainer.innerHTML = '';
    this.tableContainer.appendChild(table);

    // Add pagination if needed
    if (this.filteredData.length > this.rowsPerPage) {
      this.addPagination();
    }

    // Add table summary if data exists
    if (this.filteredData.length > 0) {
      this.addTableSummary();
    }

    // Add animation
    table.classList.add('fade-in');
  }

  // Add table summary information
  addTableSummary() {
    const summary = document.createElement('div');
    summary.className = 'table-summary';
    summary.innerHTML = `
      <div>顯示 ${Math.min(this.filteredData.length, this.rowsPerPage)} 筆，共 ${this.filteredData.length} 筆資料</div>
    `;
    this.tableContainer.appendChild(summary);
  }

  // Add pagination controls
  addPagination() {
    const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
    const pagination = document.createElement('div');
    pagination.className = 'table-pagination';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'page-button';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
      }
    });
    pagination.appendChild(prevButton);

    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = 'page-button';
      if (i === this.currentPage) pageButton.classList.add('active');
      pageButton.textContent = i;
      pageButton.addEventListener('click', () => {
        this.currentPage = i;
        this.renderTable();
      });
      pagination.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'page-button';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderTable();
      }
    });
    pagination.appendChild(nextButton);

    this.tableContainer.appendChild(pagination);
  }

  // Render stats section
  renderStats() {
    if (!this.statsContainer) return;

    const data = this.filteredData;

    // Calculate stats
    const totalRecords = data.length;
    const topGrades = data.reduce((sum, row) => 
      sum + row.slice(0, 6).filter(g => g === 'A++' || g === 'A+').length, 0);

    // Calculate average score (based on column 10 - "積分")
    let avgScore = 0;
    if (data.length > 0) {
      const scores = data.map(row => parseFloat(row[10] || 0));
      avgScore = scores.reduce((sum, score) => sum + (isNaN(score) ? 0 : score), 0) / 
                 scores.filter(score => !isNaN(score)).length;
    }

    // Update stats display with animation
    const totalElement = document.getElementById('totalResults');
    const topGradesElement = document.getElementById('topGrades');
    const avgScoreElement = document.getElementById('averageScore');
    
    if (totalElement) this.animateCounter(totalElement, 0, totalRecords, 1000);
    if (topGradesElement) this.animateCounter(topGradesElement, 0, topGrades, 1000);
    if (avgScoreElement) this.animateCounter(avgScoreElement, 0, avgScore, 1000, 2);

    // Animate stats cards
    document.querySelectorAll('.stat-card').forEach(card => {
      card.classList.add('fade-in-up');
      setTimeout(() => card.classList.remove('fade-in-up'), 1000);
    });
  }

  // Animate number counters
  animateCounter(element, start, end, duration = 1000, decimals = 0) {
    const startTime = performance.now();
    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = this.easeOutQuad(progress);
      const currentValue = start + (end - start) * easedProgress;
      
      element.textContent = decimals > 0 ? 
        currentValue.toFixed(decimals) : 
        Math.floor(currentValue).toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  // Easing function for smoother animation
  easeOutQuad(t) {
    return t * (2 - t);
  }

  // Handle window resize for responsive adjustments
  handleResize() {
    if (window.innerWidth < 768) {
      this.rowsPerPage = 10;
    } else {
      this.rowsPerPage = 15;
    }

    this.renderTable();
  }
}