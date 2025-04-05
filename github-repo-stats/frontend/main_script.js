const API_BASE = "https://hackthon-gh-raisoni2025.onrender.com";
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

        // Redirect to states.html with the repository data as query parameters
        const queryParams = new URLSearchParams({
            name: data.name,
            description: data.description,
            stars: data.stars,
            forks: data.forks,
            issues: data.issues,
            watchers: data.watchers,
            language: data.language,
            lastUpdated: data.lastUpdated,
            topContributors: JSON.stringify(data.topContributors),
            prFrequency: data.prFrequency,
            avgIssueResolutionTime: data.avgIssueResolutionTime
        }).toString();

        window.location.href = `states.html?${queryParams}`;
    } catch (error) {
        console.error("Error fetching repo details:", error);
        alert("Failed to fetch repository details!");
    }
}
