// Utility function to fetch JSON data
function loadJSON(url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => callback(data))
        .catch(error => console.error("Failed to fetch JSON:", error));
}
// Function to render the last 3 items from a dataset
function renderLastThree(data, containerId, itemClass) {
    const container = document.getElementById(containerId);
    const lastThree = data.slice(0, 3); // Get the last 3 items
    lastThree.forEach(item => {
        const div = document.createElement("div");
        div.className = itemClass;
        div.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;
        container.appendChild(div);
    });
}
// Load and render the last 3 news items
loadJSON("data/news.json", data => {
    renderLastThree(data, "latest-news", "news-item");
});
// Load and render the last 3 publications
loadJSON("data/publications.json", data => {
    renderLastThree(data, "latest-publications", "publication-item");
});

