document.addEventListener("DOMContentLoaded", function() {
    fetch("data/quotes.json")
        .then(response => response.json())
        .then(quotes => {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
            document.getElementById("quote").textContent = randomQuote.quote
            document.getElementById("author").textContent = randomQuote.author
        })
});
