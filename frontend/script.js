let feeds = [];
let iocs = [];
let aiSummaries = [];

async function init() {
    showLoading();
    await loadData();
    populateFilters();
    hideLoading();
    renderFeeds();
    updateStats();
    renderIOCs();
    renderAISummaries();
}

async function loadData() {
    try {
        const [feedRes, iocRes, aiRes] = await Promise.all([
            fetch('http://localhost:5000/api/feeds'),
            fetch('http://localhost:5000/api/iocs'),
            fetch('http://localhost:5000/api/ai-summaries')
        ]);

        feeds = await feedRes.json();
        iocs = await iocRes.json();
        aiSummaries = await aiRes.json();

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById("feedContent").innerHTML = '<div class="no-data">Failed to load feeds</div>';
        document.getElementById("iocContent").innerHTML = '<div class="no-data">Failed to load IOCs</div>';
        document.getElementById("aiContent").innerHTML = '<div class="no-data">Failed to load summaries</div>';
    }
}

function showLoading() {
    document.getElementById("feedContent").innerHTML = `<div class="loading">Loading feeds...</div>`;
    document.getElementById("iocContent").innerHTML = `<div class="loading">Loading IOCs...</div>`;
    document.getElementById("aiContent").innerHTML = `<div class="loading">Loading AI summaries...</div>`;
}

function hideLoading() {
    // Optional: could clear the loading, but render functions will overwrite anyway
}

// Apply filters
function applyFilters() {
    const severity = document.getElementById("severityFilter").value;
    const source = document.getElementById("sourceFilter").value;
    const iocType = document.getElementById("iocTypeFilter").value;

    const filteredFeeds = feeds.filter(feed =>
        (!severity || feed.severity === severity) &&
        (!source || feed.source === source)
    );

    const filteredIOCs = iocs.filter(ioc =>
        (!source || ioc.source === source) &&
        (!iocType || ioc.type === iocType)
    );

    renderFeeds(filteredFeeds);
    renderIOCs(filteredIOCs);
}

// Render functions
function renderFeeds(list = feeds) {
    const feedContent = document.getElementById("feedContent");
    feedContent.innerHTML = list.length
        ? list.map(feed => feedHTML(feed)).join('')
        : '<div class="no-data">No feeds available</div>';
}

function renderIOCs(list = iocs) {
    const iocContent = document.getElementById("iocContent");
    iocContent.innerHTML = list.length
        ? list.map(ioc => iocHTML(ioc)).join('')
        : '<div class="no-data">No IOCs available</div>';
}

function renderAISummaries(list = aiSummaries) {
    const aiContent = document.getElementById("aiContent");
    aiContent.innerHTML = list.length
        ? list.map(sum => `<div class="ai-summary">${sum}</div>`).join('')
        : '<div class="no-data">No summaries available</div>';
}

// Helper HTML generators
function feedHTML(feed) {
    return `
        <div class="feed-item">
            <div class="feed-title">${feed.title}</div>
            <div class="feed-summary">${feed.summary}</div>
            <div class="feed-meta">
                <span>Source: ${feed.source}</span>
                <span class="threat-level threat-${feed.severity}">${feed.severity.toUpperCase()}</span>
            </div>
            <div class="feed-meta">
                <span>Tags: ${feed.tags.join(", ")}</span>
                <span>${formatTime(feed.timestamp)}</span>
            </div>
        </div>
    `;
}

function iocHTML(ioc) {
    return `
        <div class="ioc-item">
            <div class="ioc-type">${ioc.type.toUpperCase()}</div>
            <div class="ioc-value">${ioc.value}</div>
            <div class="feed-meta">
                <span>Source: ${ioc.source}</span>
                <span>Confidence: ${ioc.confidence}</span>
            </div>
            <div class="feed-meta">
                <span>First Seen: ${formatTime(ioc.firstSeen)}</span>
            </div>
        </div>
    `;
}

function populateFilters() {
    const severitySet = new Set(feeds.map(feed => feed.severity));
    const sourceSet = new Set([...feeds.map(f => f.source), ...iocs.map(i => i.source)]);
    const iocTypeSet = new Set(iocs.map(ioc => ioc.type));

    const severityFilter = document.getElementById("severityFilter");
    const sourceFilter = document.getElementById("sourceFilter");
    const iocTypeFilter = document.getElementById("iocTypeFilter");

    // Helper to populate a select element
    function populateSelect(selectEl, items, defaultText) {
        selectEl.innerHTML = `<option value="">${defaultText}</option>`;
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item.charAt(0).toUpperCase() + item.slice(1);
            selectEl.appendChild(option);
        });
    }

    populateSelect(severityFilter, Array.from(severitySet), "All Severities");
    populateSelect(sourceFilter, Array.from(sourceSet), "All Sources");
    populateSelect(iocTypeFilter, Array.from(iocTypeSet), "All IOC Types");
}

function updateStats() {
    document.getElementById("feedCount").textContent = feeds.length;
    document.getElementById("iocCount").textContent = iocs.length;
    document.getElementById("threatCount").textContent = feeds.length; 
    document.getElementById("highThreatCount").textContent = feeds.filter(f => f.severity === "high").length;
}


// Format timestamp
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

window.onload = init;
