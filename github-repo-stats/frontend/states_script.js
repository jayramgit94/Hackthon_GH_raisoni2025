document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const repoStats = Object.fromEntries(params.entries());

    if (!repoStats.name) {
        document.getElementById("repo-summary").innerHTML = "<p>No repository data found! Please go back and try again.</p>";
        return;
    }

    const topContributors = repoStats.topContributors ? JSON.parse(repoStats.topContributors) : [];

    // Populate repository summary
    const summaryHTML = `
        <h2>${repoStats.name}</h2>
        <p>${repoStats.description || "No description available."}</p>
        <p><strong>Stars:</strong> ${repoStats.stars || 0}</p>
        <p><strong>Forks:</strong> ${repoStats.forks || 0}</p>
        <p><strong>Open Issues:</strong> ${repoStats.issues || 0}</p>
        <p><strong>Watchers:</strong> ${repoStats.watchers || 0}</p>
        <p><strong>Language:</strong> ${repoStats.language || "N/A"}</p>
        <p><strong>Last Updated:</strong> ${new Date(repoStats.lastUpdated).toLocaleString()}</p>
    `;
    document.getElementById("repo-summary").innerHTML = summaryHTML;

    // Generate charts
    generateContributorsChart(topContributors);
    generateIssuesChart(repoStats);
});

// Generate contributors chart
function generateContributorsChart(contributors) {
    const ctx = document.getElementById("contributorsChart").getContext("2d");
    const labels = contributors.map(contributor => contributor.username);
    const data = contributors.map(contributor => contributor.contributions);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Contributions",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Top Contributors" }
            }
        }
    });
}

// Generate issues chart
function generateIssuesChart(repoStats) {
    const ctx = document.getElementById("issuesChart").getContext("2d");
    const data = [repoStats.issues || 0, repoStats.prFrequency || 0];

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Open Issues", "PR Frequency"],
            datasets: [{
                data,
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Issues and PR Frequency" }
            }
        }
    });
}