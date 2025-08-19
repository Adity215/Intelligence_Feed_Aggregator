const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
const feeds = [
    {
        id: 1,
        title: "Phishing Campaign Detected",
        summary: "A large-scale phishing campaign targeting financial institutions was detected.",
        source: "ThreatFeed1",
        severity: "high",
        tags: ["phishing", "banking"],
        timestamp: Date.now() - 3600000
    },
    {
        id: 2,
        title: "Ransomware Variant Analysis",
        summary: "Analysis of a new ransomware variant shows similarities with REvil family.",
        source: "ThreatFeed2",
        severity: "medium",
        tags: ["ransomware", "malware"],
        timestamp: Date.now() - 7200000
    }
];

const iocs = [
    { id: 1, type: "ip", value: "192.168.1.50", source: "ThreatFeed1", confidence: "high", firstSeen: Date.now() - 5000000 },
    { id: 2, type: "domain", value: "malicious-site.com", source: "ThreatFeed2", confidence: "medium", firstSeen: Date.now() - 8000000 }
];

const aiSummaries = [
    "Threat activity is increasing in phishing campaigns targeting banks.",
    "Ransomware activity remains active with variants showing similarities to REvil."
];

// Routes
app.get('/api/feeds', (req, res) => res.json(feeds));
app.get('/api/iocs', (req, res) => res.json(iocs));
app.get('/api/ai-summaries', (req, res) => res.json(aiSummaries));

// Health check route (optional)
app.get('/api/health', (req, res) => res.json({ status: "OK", time: new Date() }));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
