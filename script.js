// ===============================
// COLLAPSIBLE PROGRAM CARDS
// ===============================
document.querySelectorAll('.program-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        content.style.display =
            content.style.display === 'block' ? 'none' : 'block';

        const icon = header.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-chevron-up');
        }
    });
});


// ===============================
// CHATBOT SYSTEM
// ===============================
const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const messages = document.getElementById("messages");
const inputField = document.getElementById("userInput");

// Hide chat initially
chatBox.style.display = "none";

// Toggle chat
chatBtn.onclick = () => {
    chatBox.style.display =
        chatBox.style.display === "block" ? "none" : "block";

    // Welcome message (only first time)
    if (chatBox.style.display === "block" && messages.innerHTML === "") {
        messages.innerHTML = `
            <p><b>Bot:</b> 👋 Welcome to the MUT ICT Assistant.<br>
            You can ask about:<br>
            • Admission requirements<br>
            • How to apply<br>
            • NSFAS<br>
            • Course duration<br>
            • Contact details</p>
        `;
    }
};


// ===============================
// FAQ DATABASE
// ===============================
const faq = [
    {
        keywords: ["requirements", "aps", "admission"],
        answer: `To study ICT at MUT you need:
• National Senior Certificate
• Required APS score
• Mathematics (not Maths Literacy)
• English
Please check the official prospectus for updated requirements.`
    },
    {
        keywords: ["apply", "application", "how to apply"],
        answer: `To apply:
1. Visit www.cao.ac.za
2. Click Apply
3. Complete the online form
4. Upload required certified documents
Applications usually open in September.`
    },
    {
        keywords: ["duration", "how long"],
        answer: "The ICT Diploma takes 3 years. Some programmes include Work Integrated Learning (WIL)."
    },
    {
        keywords: ["nsfas", "funding", "bursary"],
        answer: "NSFAS funding is available for qualifying students. Apply at www.nsfas.org.za."
    },
    {
        keywords: ["wil", "internship"],
        answer: "Work Integrated Learning (WIL) is practical industry training done in your final year."
    },
    {
        keywords: ["contact", "phone", "email"],
        answer: "Call 031 907 7111 or email info@mut.ac.za."
    },
    {
        keywords: ["appointment", "advisor", "book"],
        answer: "For detailed academic queries, please book an appointment with the ICT department office."
    }
];


// ===============================
// SEND MESSAGE FUNCTION
// ===============================
function sendMessage() {
    const text = inputField.value.trim();
    const lowerText = text.toLowerCase();

    if (!text) return;

    // Show user message
    messages.innerHTML += `<p><b>You:</b> ${text}</p>`;

    let reply = "For specific or complex queries, please book an appointment with the ICT department.";

    // Greeting
    if (lowerText.includes("hi") || lowerText.includes("hello")) {
        reply = "Hello 👋 How can I assist you today?";
    }
    else {
        // Search FAQ
        for (let item of faq) {
            for (let keyword of item.keywords) {
                if (lowerText.includes(keyword)) {
                    reply = item.answer;
                    break;
                }
            }
        }
    }

    // Show bot reply
    messages.innerHTML += `<p><b>Bot:</b><br>${reply.replace(/\n/g, "<br>")}</p>`;

    inputField.value = "";
    messages.scrollTop = messages.scrollHeight;
}


// ===============================
// ENTER KEY SUPPORT
// ===============================
inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
})
// ===============================
// COOKIE CONSENT SYSTEM
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");

    // Check if cookie already exists
    if (document.cookie.includes("cookiesAccepted=true")) {
        banner.style.display = "none";
    }

    // When user clicks accept
    acceptBtn.addEventListener("click", function () {
        document.cookie = "cookiesAccepted=true; path=/; max-age=" + 60 * 60 * 24 * 365;
        banner.style.display = "none";
    });

});

// ===============================
// SMART SEARCH SYSTEM
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.getElementById("searchIcon");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    if (!searchIcon || !searchBox || !searchInput || !searchResults) return;

    function clearSearchResults() {
        searchResults.innerHTML = "";
    }

    function showMessage(message) {
        searchResults.innerHTML = `<div class="search-result-item">${message}</div>`;
    }

    function renderResults(results) {
        clearSearchResults();

        if (!results || results.length === 0) {
            showMessage("No results found");
            return;
        }

        results.forEach(item => {
            const resultLink = document.createElement("a");
            resultLink.href = item.url;
            resultLink.className = "search-result-item";

            const title = document.createElement("strong");
            title.textContent = item.title;

            const snippet = document.createElement("small");
            snippet.textContent = item.snippet || "Open this page";

            resultLink.appendChild(title);
            resultLink.appendChild(document.createElement("br"));
            resultLink.appendChild(snippet);
            searchResults.appendChild(resultLink);
        });
    }

    searchIcon.addEventListener("click", function () {
        searchBox.style.display = searchBox.style.display === "block" ? "none" : "block";
        searchInput.focus();
    });

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim();

        if (query.length < 2) {
            clearSearchResults();
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            renderResults(data.results);
        } catch (error) {
            showMessage("Search is not available. Please make sure the Node.js server is running.");
        }
    });

    document.addEventListener("click", function (event) {
        if (!searchBox.contains(event.target) && event.target !== searchIcon) {
            searchBox.style.display = "none";
        }
    });
});
