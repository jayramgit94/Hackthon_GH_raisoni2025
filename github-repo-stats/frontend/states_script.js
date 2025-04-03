document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const repoStats = Object.fromEntries(params.entries());

    if (!repoStats.name) {
        document.getElementById("repo-stats").innerHTML = "<p>No repository data found! Please go back and try again.</p>";
        return;
    }

    const topContributors = repoStats.topContributors ? JSON.parse(repoStats.topContributors) : [];

    const statsHTML = `
        <h2>${repoStats.name}</h2>
        <p>${repoStats.description || "No description available."}</p>
        <p><strong>Stars:</strong> ${repoStats.stars || 0}</p>
        <p><strong>Forks:</strong> ${repoStats.forks || 0}</p>
        <p><strong>Open Issues:</strong> ${repoStats.issues || 0}</p>
        <p><strong>Watchers:</strong> ${repoStats.watchers || 0}</p>
        <p><strong>Language:</strong> ${repoStats.language || "N/A"}</p>
        <p><strong>Last Updated:</strong> ${new Date(repoStats.lastUpdated).toLocaleString()}</p>
        <h3>Top Contributors</h3>
        <ul>
            ${topContributors.length > 0
                ? topContributors.map(contributor => `
                    <li>
                        <img src="${contributor.avatar}" alt="${contributor.username}" width="30">
                        <a href="${contributor.profile}" target="_blank">${contributor.username}</a>
                        (${contributor.contributions} contributions)
                    </li>
                `).join("")
                : "<p>No contributors found.</p>"}
        </ul>
        <p><strong>PR Frequency:</strong> ${repoStats.prFrequency ? parseFloat(repoStats.prFrequency).toFixed(2) : 0} PRs/day</p>
        <p><strong>Average Issue Resolution Time:</strong> ${repoStats.avgIssueResolutionTime
            ? Math.round(repoStats.avgIssueResolutionTime / (1000 * 60 * 60 * 24))
            : "N/A"} days</p>
    `;

    document.getElementById("repo-stats").innerHTML = statsHTML;
});