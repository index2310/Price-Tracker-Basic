let chartInstance = null;

// mapping ticker → CoinGecko id
const coinMap = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  bnb: "binancecoin",
  ada: "cardano",
  xrp: "ripple"
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("coinForm");
  const tickerInput = document.getElementById("ticker");
  const resultDiv = document.getElementById("result");
  const coinDetails = document.getElementById("coinDetails");
  const daysSelect = document.getElementById("daysSelect");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let coin = tickerInput.value.toLowerCase();
    if (!coin) return;

    // convert ticker → real id
    const coinId = coinMap[coin] || coin;

    try {
      /* ================= PRICE ================= */
      const priceRes = await fetch(`/price/${coinId}`);
      const priceData = await priceRes.json();

      if (!priceData.price) {
        resultDiv.innerHTML = "Coin not found";
        return;
      }

      resultDiv.innerHTML = `<h2>$${Number(priceData.price).toLocaleString()}</h2>`;

      /* ================= DETAILS ================= */
      const detailRes = await fetch(`/details/${coinId}`);
      const detailData = await detailRes.json();

      coinDetails.innerHTML = `
        <p><strong>Name:</strong> ${detailData.name}</p>
        <p><strong>Symbol:</strong> ${detailData.symbol?.toUpperCase()}</p>
        <p><strong>Market Cap:</strong> $${Number(detailData.marketCap).toLocaleString()}</p>
        <p><strong>Circulating Supply:</strong> ${Number(detailData.circulatingSupply).toLocaleString()}</p>
        <p><strong>Total Supply:</strong> ${
          detailData.totalSupply
            ? Number(detailData.totalSupply).toLocaleString()
            : "N/A"
        }</p>
        <p><strong>24h Change:</strong> ${detailData.priceChange24h?.toFixed(2)}%</p>
        <p><strong>ATH:</strong> $${Number(detailData.ath).toLocaleString()}</p>
        <p><strong>Market Rank:</strong> #${detailData.marketRank}</p>
      `;

      /* ================= CHART ================= */
      await loadChart(coinId);

    } catch (err) {
      console.log(err);
    }
  });

  daysSelect.addEventListener("change", () => {
    let coin = tickerInput.value.toLowerCase();
    if (!coin) return;
    const coinId = coinMap[coin] || coin;
    loadChart(coinId);
  });
});


async function loadChart(coin) {
  const days = document.getElementById("daysSelect").value;

  try {
    const res = await fetch(`/chart/${coin}/${days}`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.log("Invalid chart data", data);
      return;
    }

    const labels = data.map(d =>
      new Date(d.time).toLocaleDateString()
    );

    const prices = data.map(d => d.price);

    const ctx = document.getElementById("priceChart");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: `${coin.toUpperCase()} Price`,
          data: prices,
          borderColor: "#00bfff",
          backgroundColor: "rgba(0,191,255,0.2)",
          fill: true,
          tension: 0.3
        }]
      }
    });

  } catch (err) {
    console.log("Chart error", err);
  }
}
