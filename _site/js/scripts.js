document.addEventListener("DOMContentLoaded", () => {
    // Fetch and render news
    fetch("data/news.json")
        .then((response) => response.json())
        .then((data) => {
            const newsContent = document.getElementById("news-content");
            data.forEach((item) => {
                const newsItem = document.createElement("div");
                newsItem.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
                newsContent.appendChild(newsItem);
            });
        });

    // Fetch and render projects
    fetch("data/projects.json")
        .then((response) => response.json())
        .then((data) => {
            const projectsContent = document.getElementById("projects-content");
            data.forEach((item) => {
                const projectItem = document.createElement("div");
                projectItem.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
                projectsContent.appendChild(projectItem);
            });
        });

    // Fetch and render publications
    fetch("data/publications.json")
        .then((response) => response.json())
        .then((data) => {
            const publicationsContent = document.getElementById("publications-content");
            data.forEach((item) => {
                const publicationItem = document.createElement("div");
                publicationItem.innerHTML = `<h3>${item.title}</h3><p>${item.authors}</p>`;
                publicationsContent.appendChild(publicationItem);
            });
        });
});


function toggleBio(button) {
    const bio = button.nextElementSibling;
    if (bio.style.display === "block") {
        bio.style.display = "none";
        button.textContent = "View Bio";
    } else {
        bio.style.display = "block";
        button.textContent = "Hide Bio";
    }
}


