/**
 * FutureTech Unified Script
 * Final Version: API + Far-Right Save Button + Standing Box Grid
 */

window.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Username Persistence
    const loggedInName = localStorage.getItem("currentUser");
    const navNameLink = document.getElementById("navUserName");
    if (navNameLink) {
        navNameLink.textContent = loggedInName || "Jason";
    }

    // 2. Load Saved Items only if the savedList container exists (Saved.html)
    if (document.getElementById("savedList")) {
        displaySavedItems();
    }
});

// ==========================================
// 1. DISCOVERY SEARCH LOGIC (api.html)
// ==========================================
async function fetchTechNews() {
    const query = document.getElementById("newsQuery").value.trim();
    const listContainer = document.getElementById("newsList");

    if (!query) return alert("Please enter an intelligence query.");

    listContainer.innerHTML = "<p style='text-align:center; color:#8be9fd;'>📡 Querying Global Archives...</p>";

    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}+robotics&format=json&origin=*`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.query.search;
        listContainer.innerHTML = ""; // Clear loader

        if (results.length === 0) {
            listContainer.innerHTML = "<p style='text-align:center;'>No matching records found.</p>";
            return;
        }

        results.forEach(item => {
            const cleanSnippet = item.snippet.replace(/<\/?[^>]+(>|$)/g, "");
            const card = document.createElement("div");
            card.className = "result-card";
            
            // Flexbox "justify-content: space-between" in CSS will push the button to the far right
            card.innerHTML = `
                <h4 style="color:#8be9fd; margin-bottom:8px;">${item.title}</h4>
                <p style="font-size:0.85rem; color:#ccc; line-height:1.4;">${cleanSnippet}...</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
                    <a href="https://en.wikipedia.org/?curid=${item.pageid}" target="_blank" 
                       style="color:#ff79c6; text-decoration:none; font-size:0.75rem; font-weight:bold;">
                       READ INTEL →
                    </a>
                    <button onclick="saveIntel('${item.pageid}', '${item.title.replace(/'/g, "\\'")}')" 
                            style="background:#3b0a6d; color:white; border:1px solid #8be9fd; padding:6px 12px; border-radius:4px; font-size:0.7rem; cursor:pointer;">
                            💾 SAVE INTEL
                    </button>
                </div>
            `;
            listContainer.appendChild(card);
        });
    } catch (e) {
        listContainer.innerHTML = "<p style='color:red; text-align:center;'>System Offline.</p>";
    }
}

// ==========================================
// 2. LOCALSTORAGE SAVE SYSTEM
// ==========================================
function saveIntel(id, title) {
    let archives = JSON.parse(localStorage.getItem("techArchives")) || [];

    // Prevent Duplicates
    if (archives.some(i => i.id === id)) {
        alert("⚠️ Intelligence already archived.");
        return;
    }

    // Save Data
    archives.push({ 
        id: id, 
        title: title, 
        date: new Date().toLocaleDateString() 
    });
    
    localStorage.setItem("techArchives", JSON.stringify(archives));
    alert("✅ Successfully archived to Saves.");
}

// ==========================================
// 3. DISPLAY SAVED AS STANDING RECTANGLES
// ==========================================
function displaySavedItems() {
    const container = document.getElementById("savedList");
    const archives = JSON.parse(localStorage.getItem("techArchives")) || [];
    
    if (!container) return;

    if (archives.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#555; margin-top:100px;'>No archived intel found.</p>";
        return;
    }

    container.innerHTML = ""; // Clear existing content

    // Note: Ensure your CSS has #savedList { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
    archives.forEach(item => {
        const box = document.createElement("div");
        
        // Inline styles for the "Standing Box" look
        box.style.cssText = `
            width: 180px;
            height: 240px;
            background: rgba(59, 10, 109, 0.2);
            border: 1px solid #3b0a6d;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 15px;
            color: white;
        `;

        box.innerHTML = `
            <div style="font-size:2rem; margin-bottom:10px;">📟</div>
            <h4 style="font-size:0.9rem; color:#8be9fd; margin-bottom:8px;">${item.title}</h4>
            <small style="color:#666; font-size:0.7rem; margin-bottom:15px;">Archived: ${item.date}</small>
            <button onclick="deleteIntel('${item.id}')" 
                    style="background:#ff4444; border:none; color:white; padding:5px 12px; border-radius:4px; font-size:0.7rem; cursor:pointer;">
                    REMOVE
            </button>
        `;
        container.appendChild(box);
    });
}

// ==========================================
// 4. MANAGEMENT FUNCTIONS (Delete/Clear)
// ==========================================
function deleteIntel(id) {
    let archives = JSON.parse(localStorage.getItem("techArchives")) || [];
    archives = archives.filter(i => i.id !== id);
    localStorage.setItem("techArchives", JSON.stringify(archives));
    displaySavedItems(); // Refresh the grid
}

function clearAllSaved() {
    if (confirm("Permanently wipe all archived intelligence?")) {
        localStorage.removeItem("techArchives");
        displaySavedItems();
    }
}

// ==========================================
// 5. LOGIN LOGIC
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const user = loginForm.querySelector("input[type='text']").value;
        const pass = loginForm.querySelector("input[type='password']").value;

        if (user === "admin" && pass === "admin123") {
            localStorage.setItem("currentUser", "Admin");
            window.location.href = "admin.html";
        } else {
            const stored = JSON.parse(localStorage.getItem("user"));
            if (stored && user === stored.username && pass === stored.password) {
                localStorage.setItem("currentUser", stored.username);
                window.location.href = "lee.html";
            } else {
                alert("Access Denied: Invalid Credentials.");
            }
        }
    });
}