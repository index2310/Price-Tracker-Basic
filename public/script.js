document.getElementById('coinForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const ticker = document.getElementById('ticker').value;

  try {
    const response = await fetch(`/price/${ticker}`);
    const data = await response.json();

    if (data.price) {
      document.getElementById('result').innerHTML =
        `<h3>
        ${ticker.toUpperCase()}  
        <br>
        $${Number(data.price).toLocaleString()}
      </h3>`;

      // ✅ Tampilkan chart setelah harga berhasil
      document.getElementById('chartContainer').style.display = 'block';
      loadChart();

    } else {
      document.getElementById('result').innerHTML =
        `<p style="color:red;">Coin not found</p>`;

      // ❌ Sembunyikan lagi kalau error
      document.getElementById('chartContainer').style.display = 'none';
    }
      // 🔥 Ambil Detail Coin
      const detailResponse = await fetch(`/details/${ticker}`);
      const detailData = await detailResponse.json();

      document.getElementById('coinDetails').innerHTML = `
  <div class="detail-item"><strong>Name:</strong> ${detailData.name}</div>
  <div class="detail-item"><strong>Symbol:</strong> ${detailData.symbol.toUpperCase()}</div>
  <div class="detail-item"><strong>Market Cap:</strong> $${Number(detailData.marketCap).toLocaleString()}</div>
  <div class="detail-item"><strong>Circulating Supply:</strong> ${Number(detailData.circulatingSupply).toLocaleString()}</div>
  <div class="detail-item"><strong>Total Supply:</strong> ${detailData.totalSupply ? Number(detailData.totalSupply).toLocaleString() : "N/A"}</div>
  <div class="detail-item"><strong>24h Change:</strong> ${detailData.priceChange24h.toFixed(2)}%</div>
  <div class="detail-item"><strong>ATH:</strong> $${Number(detailData.ath).toLocaleString()}</div>
  <div class="detail-item"><strong>Market Rank:</strong> #${detailData.marketRank}</div>
`;

  } catch (error) {
    console.error(error);
  }
});