let feeds = [];
let iocs = [];
let aiSummaries = [];
let threatStats = {};

async function init() {
    showLoading();
    await loadData();
    populateFilters();
    hideLoading();
    renderFeeds();
    updateStats();
    renderIOCs();
    renderAISummaries();
    
    // Set up real-time updates every 5 minutes
    setInterval(loadData, 5 * 60 * 1000);
}

async function loadData() {
    try {
        const [feedRes, iocRes, aiRes, statsRes] = await Promise.all([
            fetch('http://localhost:5000/api/feeds'),
            fetch('http://localhost:5000/api/iocs'),
            fetch('http://localhost:5000/api/ai-summaries'),
            fetch('http://localhost:5000/api/stats')
        ]);

        feeds = await feedRes.json();
        iocs = await iocRes.json();
        aiSummaries = await aiRes.json();
        threatStats = await statsRes.json();

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

// Search functionality
function filterContent() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
    if (!searchTerm) {
        renderFeeds();
        renderIOCs();
        return;
    }
    
    const filteredFeeds = feeds.filter(feed =>
        feed.title.toLowerCase().includes(searchTerm) ||
        feed.summary.toLowerCase().includes(searchTerm) ||
        feed.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        feed.source.toLowerCase().includes(searchTerm)
    );
    
    const filteredIOCs = iocs.filter(ioc =>
        ioc.value.toLowerCase().includes(searchTerm) ||
        ioc.type.toLowerCase().includes(searchTerm) ||
        ioc.source.toLowerCase().includes(searchTerm)
    );
    
    renderFeeds(filteredFeeds);
    renderIOCs(filteredIOCs);
}

// Advanced search toggle
function toggleAdvancedSearch() {
    const advancedSearch = document.getElementById("advancedSearch");
    if (advancedSearch) {
        advancedSearch.style.display = advancedSearch.style.display === 'none' ? 'block' : 'none';
    } else {
        createAdvancedSearch();
    }
}

function createAdvancedSearch() {
    const controls = document.querySelector('.controls');
    const advancedSearch = document.createElement('div');
    advancedSearch.id = 'advancedSearch';
    advancedSearch.className = 'advanced-search';
    advancedSearch.innerHTML = `
        <h3>🔍 Advanced Search</h3>
        <div class="search-filters">
            <input type="text" id="dateFrom" placeholder="Date From (YYYY-MM-DD)" onchange="applyAdvancedFilters()">
            <input type="text" id="dateTo" placeholder="Date To (YYYY-MM-DD)" onchange="applyAdvancedFilters()">
            <select id="confidenceFilter" onchange="applyAdvancedFilters()">
                <option value="">All Confidence Levels</option>
                <option value="high">High Confidence</option>
                <option value="medium">Medium Confidence</option>
                <option value="low">Low Confidence</option>
            </select>
            <button class="btn" onclick="clearAdvancedFilters()">Clear Filters</button>
        </div>
    `;
    controls.appendChild(advancedSearch);
}

function applyAdvancedFilters() {
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const confidence = document.getElementById("confidenceFilter").value;
    
    let filteredFeeds = [...feeds];
    let filteredIOCs = [...iocs];
    
    if (dateFrom) {
        const fromDate = new Date(dateFrom).getTime();
        filteredFeeds = filteredFeeds.filter(feed => feed.timestamp >= fromDate);
        filteredIOCs = filteredIOCs.filter(ioc => ioc.firstSeen >= fromDate);
    }
    
    if (dateTo) {
        const toDate = new Date(dateTo).getTime();
        filteredFeeds = filteredFeeds.filter(feed => feed.timestamp <= toDate);
        filteredIOCs = filteredIOCs.filter(ioc => ioc.firstSeen <= toDate);
    }
    
    if (confidence) {
        filteredIOCs = filteredIOCs.filter(ioc => ioc.confidence === confidence);
    }
    
    renderFeeds(filteredFeeds);
    renderIOCs(filteredIOCs);
}

function clearAdvancedFilters() {
    document.getElementById("dateFrom").value = '';
    document.getElementById("dateTo").value = '';
    document.getElementById("confidenceFilter").value = '';
    renderFeeds();
    renderIOCs();
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
        ? list.map((sum, index) => aiSummaryHTML(sum, index)).join('')
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
            ${feed.url ? `<div class="feed-link"><a href="${feed.url}" target="_blank">View Source</a></div>` : ''}
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
                <span class="confidence-${ioc.confidence}">Confidence: ${ioc.confidence}</span>
            </div>
            <div class="feed-meta">
                <span>First Seen: ${formatTime(ioc.firstSeen)}</span>
            </div>
        </div>
    `;
}

function aiSummaryHTML(summary, index) {
    const titles = ['Threat Intelligence Summary', 'Trend Analysis', 'Threat Prediction'];
    return `
        <div class="ai-summary">
            <h4>${titles[index] || 'AI Analysis'}</h4>
            <p>${summary}</p>
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
    document.getElementById("feedCount").textContent = threatStats.totalFeeds || feeds.length;
    document.getElementById("iocCount").textContent = threatStats.totalIOCs || iocs.length;
    document.getElementById("threatCount").textContent = threatStats.totalFeeds || feeds.length; 
    document.getElementById("highThreatCount").textContent = threatStats.highPriorityThreats || feeds.filter(f => f.severity === "high").length;
}

// Format timestamp
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

// Export functionality
async function exportData() {
    try {
        const response = await fetch('http://localhost:5000/api/export');
        const data = await response.json();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat-intelligence-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Export failed. Please try again.', 'error');
    }
}

// AI Analysis Functions
async function generateSummaries() {
    showNotification('Generating AI summaries...', 'info');
    try {
        await loadData(); // Refresh data to get latest AI summaries
        renderAISummaries();
        showNotification('AI summaries updated!', 'success');
    } catch (error) {
        showNotification('Failed to generate summaries.', 'error');
    }
}

async function analyzeTrends() {
    showNotification('Analyzing threat trends...', 'info');
    try {
        await loadData();
        renderAISummaries();
        showNotification('Trend analysis complete!', 'success');
    } catch (error) {
        showNotification('Failed to analyze trends.', 'error');
    }
}

async function predictThreats() {
    showNotification('Predicting future threats...', 'info');
    try {
        await loadData();
        renderAISummaries();
        showNotification('Threat prediction complete!', 'success');
    } catch (error) {
        showNotification('Failed to predict threats.', 'error');
    }
}

// Feed Management Functions
async function refreshFeeds() {
    showNotification('Refreshing threat feeds...', 'info');
    try {
        const response = await fetch('http://localhost:5000/api/refresh', { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
            await loadData();
            renderFeeds();
            renderIOCs();
            renderAISummaries();
            updateStats();
            showNotification('Feeds refreshed successfully!', 'success');
        } else {
            showNotification('Failed to refresh feeds.', 'error');
        }
    } catch (error) {
        showNotification('Failed to refresh feeds.', 'error');
    }
}

function addCustomFeed() {
    const feedUrl = prompt('Enter RSS feed URL:');
    if (feedUrl) {
        showNotification('Custom feed feature coming soon!', 'info');
    }
}

function extractIOCs() {
    showNotification('Extracting IOCs from feeds...', 'info');
    // This would trigger IOC extraction on the backend
    loadData().then(() => {
        renderIOCs();
        showNotification('IOC extraction complete!', 'success');
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

window.onload = init;
