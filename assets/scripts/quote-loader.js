document.addEventListener('DOMContentLoaded', () => {
  fetch('data/quotes.json', {
    cache: 'no-cache', headers: {
      'Cache-Control': 'max-age=604800', // 1 week
    },
  })
    .then(response => response.json())
    .then(quotes => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      document.getElementById('quote').textContent = randomQuote.quote
      document.getElementById('author').textContent = randomQuote.author
    })
})
