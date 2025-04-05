document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
  
    // Extract basic stats
    const repoStats = {
      name: params.get("name"),
      description: params.get("description"),
      stars: parseInt(params.get("stars")),
      forks: parseInt(params.get("forks")),
      issues: parseInt(params.get("issues")),
      watchers: parseInt(params.get("watchers")),
      language: params.get("language"),
      lastUpdated: params.get("lastUpdated"),
      prFrequency: parseInt(params.get("prFrequency")),
    };
  
    const topContributors = params.get("topContributors")
      ? JSON.parse(params.get("topContributors"))
      : [];
  
    if (!repoStats.name) {
      document.getElementById("repo-summary").innerHTML =
        "<p>No repository data found! Please go back and try again.</p>";
      return;
    }
  
    // Styled box function
    function createDetailBox(icon, label, value, bgColor) {
      return `
        <div class="detail-box" style="background-color: ${bgColor}">
          <span class="icon">${icon}</span>
          <div>
            <div class="label">${label}</div>
            <div class="value">${value}</div>
          </div>
        </div>
      `;
    }
  
    // Render HTML
    const summaryHTML = `
      <h2 class="repo-title">${repoStats.name}</h2>
      <p class="repo-description">${repoStats.description || "No description available."}</p>
      <div class="repo-details">
        ${createDetailBox("⭐", "Stars", repoStats.stars || 0, "#ffeaa7")}
        ${createDetailBox("🍴", "Forks", repoStats.forks || 0, "#fab1a0")}
        ${createDetailBox("🐞", "Open Issues", repoStats.issues || 0, "#ff7675")}
        ${createDetailBox("👀", "Watchers", repoStats.watchers || 0, "#74b9ff")}
        ${createDetailBox("📝", "Language", repoStats.language || "N/A", "#55efc4")}
        ${createDetailBox("⏰", "Last Updated", new Date(repoStats.lastUpdated).toLocaleString(), "#a29bfe")}
      </div>
    `;
  
    document.getElementById("repo-summary").innerHTML = summaryHTML;
  
    // Charts
    generateContributorsChart(topContributors);
    generateIssuesChart(repoStats);
  });
  
  // Chart 1: Contributors
  function generateContributorsChart(contributors) {
    const ctx = document.getElementById("contributorsChart").getContext("2d");
    const labels = contributors.map((contributor) => contributor.username);
    const data = contributors.map((contributor) => contributor.contributions);
  
    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Contributions",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Top Contributors" },
        },
      },
    });
  }
  
  // Chart 2: Issues/PRs
  function generateIssuesChart(repoStats) {
    const ctx = document.getElementById("issuesChart").getContext("2d");
    const data = [repoStats.issues || 0, repoStats.prFrequency || 0];
  
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Open Issues", "PR Frequency"],
        datasets: [
          {
            data,
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Issues and PR Frequency" },
        },
      },
    });
  }
  