let chartInstance = null;

async function loadChart() {
    const coin = document.getElementById('ticker').value;
    const days = document.getElementById('daysSelect').value;

    if (!coin) {
        alert('Input Coin Name!');
        return;
    }

    try {
        const response = await fetch(`/chart/${coin}?days=${days}`);
        const data = await response.json();

        if (!Array.isArray(data)) {
            alert('Coin not found!');
            return;
        }

        const labels = data.map(item => {
            const date = new Date(item.time);
            return date.toLocaleDateString();
        });

        const prices = data.map(item => item.price);
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];

        const isUptrend = lastPrice >= firstPrice;

        const lineColor = isUptrend ? 'rgb(0, 200, 83)' : 'rgb(220, 53, 69)';

        const ctx = document.getElementById('priceChart').getContext('2d');

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Harga ${coin.toUpperCase()} (USD)`,
                    data: prices,
                    borderColor: lineColor,
                    backgroundColor: lineColor,
                    tension: 0.2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        alert('Error occured while collecting data');
    }
}
document.getElementById('daysSelect').addEventListener('change', function() {
    loadChart();
});