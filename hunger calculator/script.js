const form = document.getElementById('wasteForm');
const resultDiv = document.getElementById('result');
const progressBar = document.getElementById('progressBar');
let wasteChart, pieChart;

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputs = form.querySelectorAll('input');
  const data = Array.from(inputs).map(input => parseFloat(input.value));

  const totalWaste = data.reduce((sum, val) => sum + val, 0);
  const avgWaste = (totalWaste / 7).toFixed(2);

  resultDiv.innerHTML = `
    <h3>Total Food Waste: ${totalWaste.toFixed(2)} kg</h3>
    <p>Average per day: ${avgWaste} kg</p>
  `;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (wasteChart) wasteChart.destroy();
  if (pieChart) pieChart.destroy();

  const ctx1 = document.getElementById('wasteChart').getContext('2d');
  wasteChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Food Waste (kg)',
        data,
        backgroundColor: '#2196f3',
        borderRadius: 8
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const ctx2 = document.getElementById('pieChart').getContext('2d');
  pieChart = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: days,
      datasets: [{
        data,
        backgroundColor: [
          '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5',
          '#0288d1', '#0277bd', '#01579b'
        ]
      }]
    }
  });

  // Animate progress
  progressBar.style.width = '100%';

  setTimeout(() => {
    setTimeout(() => {
      const again = confirm("Do you want to enter data again?");
      if (again) {
        inputs.forEach(input => input.value = '');
        resultDiv.innerHTML = '';
        progressBar.style.width = '0%';
        if (wasteChart) wasteChart.destroy();
        if (pieChart) pieChart.destroy();
      }
    }, 100);
  }, 800);
});

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function saveAsPDF() {
  const element = document.getElementById('pdfContent');
  html2pdf().from(element).save('food-waste-report.pdf');
}