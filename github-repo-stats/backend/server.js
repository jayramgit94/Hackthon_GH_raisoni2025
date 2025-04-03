const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, "../frontend")));

const GITHUB_API_BASE = "https://api.github.com/repos";

// Serve the landing page (index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🟢 Fetch Repository Details
app.get("/repo", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "GitHub repo URL is required!" });

        // Extract owner & repo name from URL
        const [owner, repo] = url.replace("https://github.com/", "").split("/");

        // Fetch repository details
        const { data: repoData } = await axios.get(`${GITHUB_API_BASE}/${owner}/${repo}`);

        // Fetch contributors
        const { data: contributorsData } = await axios.get(`${GITHUB_API_BASE}/${owner}/${repo}/contributors`);

        // Fetch pull requests
        const { data: pullRequestsData } = await axios.get(`${GITHUB_API_BASE}/${owner}/${repo}/pulls?state=all`);

        // Fetch issues
        const { data: issuesData } = await axios.get(`${GITHUB_API_BASE}/${owner}/${repo}/issues?state=all`);

        // Calculate statistics
        const topContributors = contributorsData.map(user => ({
            username: user.login,
            avatar: user.avatar_url,
            profile: user.html_url,
            contributions: user.contributions
        })).sort((a, b) => b.contributions - a.contributions).slice(0, 5);

        const prFrequency = pullRequestsData.length / (new Date(repoData.updated_at) - new Date(repoData.created_at)) * 1000 * 60 * 60 * 24; // PRs per day

        const issueResolutionTimes = issuesData
            .filter(issue => issue.state === "closed" && issue.closed_at)
            .map(issue => new Date(issue.closed_at) - new Date(issue.created_at));
        const avgIssueResolutionTime = issueResolutionTimes.length
            ? issueResolutionTimes.reduce((a, b) => a + b, 0) / issueResolutionTimes.length
            : 0;

        // 📌 Response Data
        const result = {
            name: repoData.full_name,
            description: repoData.description,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            issues: repoData.open_issues_count,
            watchers: repoData.subscribers_count,
            language: repoData.language,
            lastUpdated: repoData.updated_at,
            owner: { avatar: repoData.owner.avatar_url, profile: repoData.owner.html_url },
            topContributors,
            prFrequency,
            avgIssueResolutionTime
        };

        console.log("📜 GitHub Repo Data:", result);
        res.json(result);
    } catch (error) {
        console.error("❌ Error Fetching Repo Data:", error.message);
        res.status(500).json({ error: "Failed to fetch repository details!" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
