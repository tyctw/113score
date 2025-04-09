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

      return true;
    });

    this.currentPage = 1;
    this.renderTable();
    this.renderStats();
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
            gradeSpan.className = 'grade-badge grade-c';
          }
          
          gradeSpan.textContent = writingScore;
          td.appendChild(gradeSpan);
        } else {
          td.textContent = row[i] || '';

          // Remove value change indicators - previously had code here that added up/down arrows
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Clear container and add table
    this.tableContainer.innerHTML = '';
    this.tableContainer.appendChild(table);

    // Add pagination if needed
    if (this.filteredData.length > this.rowsPerPage) {
      this.addPagination();
    }

    // Add animation
    table.classList.add('slide-in-right');
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
      avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    // Update stats display
    document.getElementById('totalResults').textContent = totalRecords;
    document.getElementById('topGrades').textContent = topGrades;
    document.getElementById('averageScore').textContent = avgScore.toFixed(2);

    // Animate stats cards
    document.querySelectorAll('.stat-card').forEach(card => {
      card.classList.add('scale-in');
      setTimeout(() => card.classList.remove('scale-in'), 1000);
    });
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