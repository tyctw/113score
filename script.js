import Chart from 'chart.js';

// Election data
const electionData = {
  progress: 0.98,
  totalVotes: 13439360,
  eligibleVoters: 19547444,
  lastUpdated: "2024-01-13 20:30:00",
  candidates: [
    {
      id: 1,
      name: "賴清德、蕭美琴",
      party: "Democratic Progressive Party",
      votes: 5586019,
      color: "#84cb98"
    },
    {
      id: 2,
      name: "侯友宜、趙少康",
      party: "Chinese Nationalist Party",
      votes: 4671021,
      color: "#000095"
    },
    {
      id: 3,
      name: "柯文哲、吳欣盈",
      party: "Taiwan People's Party",
      votes: 3162077,
      color: "#ffcd00"
    }
  ]
};

// Format numbers with commas
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate percentages
function calculatePercentages() {
  const totalVotes = electionData.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  
  electionData.candidates.forEach(candidate => {
    candidate.percentage = (candidate.votes / totalVotes) * 100;
  });
  
  return totalVotes;
}

// Update the UI with the latest data
function updateUI() {
  const totalVotes = calculatePercentages();
  const turnoutRate = (totalVotes / electionData.eligibleVoters) * 100;
  
  // Update progress, total votes, and turnout
  document.getElementById('progress').textContent = `${(electionData.progress * 100).toFixed(2)}%`;
  document.getElementById('total-votes').textContent = formatNumber(totalVotes);
  document.getElementById('turnout').textContent = `${turnoutRate.toFixed(2)}%`;
  
  // Update last updated time
  document.getElementById('last-updated').textContent = electionData.lastUpdated;
  
  // Update candidate information
  electionData.candidates.forEach(candidate => {
    document.getElementById(`votes-${candidate.id}`).textContent = formatNumber(candidate.votes);
    document.getElementById(`percentage-${candidate.id}`).textContent = `${candidate.percentage.toFixed(2)}%`;
    document.getElementById(`progress-${candidate.id}`).style.width = `${candidate.percentage}%`;
  });
  
  // Update chart
  updateChart();
}

// Initialize and update the chart
function updateChart() {
  const ctx = document.getElementById('resultsChart').getContext('2d');
  
  if (window.resultsChart) {
    window.resultsChart.destroy();
  }
  
  window.resultsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: electionData.candidates.map(c => c.name),
      datasets: [{
        data: electionData.candidates.map(c => c.votes),
        backgroundColor: electionData.candidates.map(c => c.color),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const percentage = (value / electionData.candidates.reduce((sum, c) => sum + c.votes, 0) * 100).toFixed(2);
              return `${label}: ${formatNumber(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Simulate refreshing data with a slight delay
document.getElementById('refresh-btn').addEventListener('click', function() {
  this.disabled = true;
  this.textContent = '更新中...';
  
  setTimeout(() => {
    // In a real application, you would fetch new data here
    // For demo purposes, we'll just update the UI with the existing data
    updateUI();
    
    this.disabled = false;
    this.textContent = '刷新數據';
  }, 1000);
});

// Add animation effect to the cards
function addCardAnimations() {
  electionData.candidates.forEach(candidate => {
    const card = document.getElementById(`card-${candidate.id}`);
    card.addEventListener('mouseenter', () => {
      const progressBar = document.getElementById(`progress-${candidate.id}`);
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.width = `${candidate.percentage}%`;
      }, 50);
    });
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  addCardAnimations();
});

