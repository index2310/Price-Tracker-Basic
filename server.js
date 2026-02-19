// app.js

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Pemetaan ticker umum ke ID CoinGecko
const tickerMap = {
  btc: 'bitcoin',
  eth: 'ethereum',
  ada: 'cardano',
  xrp: 'ripple',
  doge: 'dogecoin',
  ltc: 'litecoin',
  sol: 'solana',      // Solana
  link: 'chainlink',  // Chainlink
  matic: 'polygon',   // Polygon (MATIC)
  bnb: 'binancecoin', // Binance Coin (BNB)
  dot: 'polkadot',    // Polkadot (DOT)
  trx: 'tron',        // TRON (TRX)
  uni: 'uniswap',     // Uniswap (UNI)
  shiba: 'shiba-inu', // Shiba Inu
  veti: 'vet',        // VeChain (VET)
  etc: 'ethereum-classic', // Ethereum Classic (ETC)
  // Tambahkan pemetaan lainnya sesuai kebutuhan
};

// Endpoint untuk mendapatkan harga koin dari CoinGecko
app.get('/price/:coin', async (req, res) => {
  const coinTicker = req.params.coin.toLowerCase(); // Ubah menjadi huruf kecil
  
  // Periksa apakah ticker valid dan ada dalam pemetaan
  const coinId = tickerMap[coinTicker] || coinTicker;  // Gunakan pemetaan atau tetap menggunakan input asli
  
  try {
    // Ambil harga koin dari API CoinGecko
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    
    if (response.data[coinId]) {
      res.json({ price: response.data[coinId].usd });
    } else {
      res.status(404).json({ error: 'Coin tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error fetching price from CoinGecko:", error);  // Log error di server
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }

  
});

// Endpoint untuk mendapatkan data chart (historical market chart)
app.get("/chart/:coin/:days", async (req, res) => {
  try {
    const coinTicker = req.params.coin.toLowerCase();
    const days = req.params.days;

    // 🔥 gunakan mapping seperti route lain
    const coinId = tickerMap[coinTicker] || coinTicker;

    console.log("Request chart:", coinId, days);

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: days
        }
      }
    );

    const data = response.data;

    if (!data.prices) {
      return res.status(400).json({ error: "No price data" });
    }

    const formatted = data.prices.map(p => ({
      time: p[0],
      price: p[1]
    }));

    res.json(formatted);

  } catch (error) {
    console.error("Chart route error:", error.response?.data || error.message);
    res.status(500).json({ error: "Chart error" });
  }
});


// Endpoint untuk mendapatkan detail coin
app.get('/details/:coin', async (req, res) => {
    const coinTicker = req.params.coin.toLowerCase();
    const coinId = tickerMap[coinTicker] || coinTicker;

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}`,
            {
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false
                }
            }
        );

        const data = response.data;

        res.json({
            name: data.name,
            symbol: data.symbol,
            marketCap: data.market_data.market_cap.usd,
            circulatingSupply: data.market_data.circulating_supply,
            totalSupply: data.market_data.total_supply,
            priceChange24h: data.market_data.price_change_percentage_24h,
            ath: data.market_data.ath.usd,
            marketRank: data.market_cap_rank,
            homepage: data.links.homepage[0]
        });

    } catch (error) {
        console.error("Error fetching coin details:", error);
        res.status(500).json({ error: 'Gagal mengambil detail coin' });
    }
});

// Menyajikan file static (HTML, CSS, JS) dari folder 'public'
app.use(express.static('public'));

// Server Express
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});