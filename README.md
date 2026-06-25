# BigQuery Release Notes Viewer

A lightweight, modern web application that fetches the latest official Google Cloud BigQuery release notes and lets you easily read and share them on X (formerly Twitter).

---

## 🚀 Features

- **Real-Time XML Fetching**: Dynamically retrieves release notes directly from the official Google Cloud RSS feed.
- **Modern Dark-Mode UI**: Built with a sleek Google Cloud-inspired aesthetic, utilizing glassmorphism headers, smooth micro-interactions, and responsive card layouts.
- **Automatic Sanitization**: Parsed HTML strings are cleaned on the backend to supply plain text for summaries and search keywords.
- **Integrated Twitter/X Web Intent**: Compose and format posts with a character counter directly inside a modal, then share instantly without needing credentials.
- **Full Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

- **Backend**: Python, Flask, Feedparser (for XML parsing)
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (custom properties, flexbox/grid), Vanilla JavaScript (ES6+, Fetch API)

---

## 📦 Getting Started

### Prerequisites
- Python 3.9+ installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/aniketdhiman1704-dot/first-repo.git
cd first-repo
```

### 2. Install dependencies
It is recommended to run this within a virtual environment:
```bash
# Optional: Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`

# Install requirements
pip install -r requirements.txt
```

### 3. Run the application
```bash
python app.py
```
Open your browser and navigate to **[http://127.0.0.1:5000](http://127.0.0.1:5000)**.

---

## 📂 Project Structure

```text
├── app.py                  # Flask backend (API endpoints & feed parser)
├── requirements.txt        # Python dependency list
├── .gitignore              # Ignored files list
├── templates/
│   └── index.html          # Main HTML structure & layout
└── static/
    ├── css/
    │   └── style.css       # Premium custom stylesheets
    └── js/
        └── app.js          # Client-side routing, AJAX calls & modal control
```

---

## 🔌 API Endpoints

### `GET /`
Serves the main frontend dashboard.

### `GET /api/notes`
Fetches and returns the parsed BigQuery release notes in a clean JSON format.

**Example Response:**
```json
{
  "feed_title": "BigQuery Release Notes",
  "notes": [
    {
      "title": "BigQuery release notes for June 24, 2026",
      "link": "https://cloud.google.com/bigquery/docs/release-notes",
      "published": "2026-06-24T00:00:00Z",
      "summary_html": "<p>BigQuery now supports <code>NEW_FEATURE</code> globally.</p>",
      "summary_text": "BigQuery now supports NEW_FEATURE globally."
    }
  ]
}
```

---

## 📄 License
This project is open-source and available under the MIT License.
