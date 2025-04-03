// Sample fake data
const repoData = {
    stars: "1,245",
    forks: "321",
    watchers: "156",
    openIssues: "23",
    language: "JavaScript",
    prFrequency: "15 PRs Merged/Week",
    avgResolution: "3 Days"
};

// Function to populate the dashboard
function populateDashboard() {
    document.getElementById("stars").textContent = repoData.stars;
    document.getElementById("forks").textContent = repoData.forks;
    document.getElementById("watchers").textContent = repoData.watchers;
    document.getElementById("open-issues").textContent = repoData.openIssues;
    document.getElementById("language").textContent = repoData.language;
    document.getElementById("pr-frequency").textContent = repoData.prFrequency;
    document.getElementById("avg-resolution").textContent = repoData.avgResolution;
}

// Initialize on page load for dashboard.html
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.href.includes("dashboard.html")) {
        populateDashboard();
    }
});

// Update analyzeRepo() to redirect to dashboard
function analyzeRepo() {
    const repoUrl = document.getElementById("repo-url").value;
    if (repoUrl === "") {
        alert("Please enter a GitHub repository URL.");
        return;
    }
    window.location.href = "dashboard.html";
}