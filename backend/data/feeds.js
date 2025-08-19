const feeds = [
    {
        title: "Phishing Campaign Detected",
        summary: "A new large-scale phishing campaign targeting financial institutions was detected.",
        source: "ThreatFeed1",
        severity: "high",
        tags: ["phishing", "banking"],
        timestamp: Date.now() - 3600000
    },
    {
        title: "Ransomware Variant Analysis",
        summary: "Analysis of a new ransomware variant shows similarities with REvil family.",
        source: "ThreatFeed2",
        severity: "medium",
        tags: ["ransomware", "malware"],
        timestamp: Date.now() - 7200000
    }
];

module.exports = feeds;
