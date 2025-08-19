const iocs = [
    { type: "ip", value: "192.168.1.50", source: "ThreatFeed1", confidence: "high", firstSeen: Date.now() - 5000000 },
    { type: "domain", value: "malicious-site.com", source: "ThreatFeed2", confidence: "medium", firstSeen: Date.now() - 8000000 }
];

module.exports = iocs;
