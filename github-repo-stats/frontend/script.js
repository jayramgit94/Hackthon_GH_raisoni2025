async function fetchRepo() {
    const repoUrl = document.getElementById("repo-url").value;
    if (!repoUrl) {
        alert("Please enter a GitHub repository URL!");
        return;
    }

    try {
        const response = await fetch(`/repo?url=${encodeURIComponent(repoUrl)}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        const repoDetails = `
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <p><strong>Stars:</strong> ${data.stars}</p>
            <p><strong>Forks:</strong> ${data.forks}</p>
            <p><strong>Open Issues:</strong> ${data.issues}</p>
            <p><strong>Watchers:</strong> ${data.watchers}</p>
            <p><strong>Language:</strong> ${data.language}</p>
            <p><strong>Last Updated:</strong> ${new Date(data.lastUpdated).toLocaleString()}</p>
            <h3>Top Contributors</h3>
            <ul>
                ${data.topContributors.map(contributor => `
                    <li>
                        <img src="${contributor.avatar}" alt="${contributor.username}" width="30">
                        <a href="${contributor.profile}" target="_blank">${contributor.username}</a>
                        (${contributor.contributions} contributions)
                    </li>
                `).join("")}
            </ul>
            <p><strong>PR Frequency:</strong> ${data.prFrequency.toFixed(2)} PRs/day</p>
            <p><strong>Average Issue Resolution Time:</strong> ${Math.round(data.avgIssueResolutionTime / (1000 * 60 * 60 * 24))} days</p>
        `;

        document.getElementById("repo-details").innerHTML = repoDetails;
    } catch (error) {
        console.error("Error fetching repo details:", error);
        alert("Failed to fetch repository details!");
    }
}
