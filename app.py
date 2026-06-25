"""
BigQuery Release Notes Viewer
Flask app that fetches and serves BigQuery release notes from the official XML feed.
"""

import feedparser
import html
import re
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://cloud.google.com/feeds/bigquery-release-notes.xml"


def strip_html(raw_html: str) -> str:
    """Remove HTML tags and decode entities to produce clean plain text."""
    clean = re.sub(r"<[^>]+>", " ", raw_html)
    clean = html.unescape(clean)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/notes")
def get_notes():
    """Fetch the BigQuery release notes XML feed and return parsed JSON."""
    try:
        feed = feedparser.parse(FEED_URL)

        if feed.bozo and not feed.entries:
            return jsonify({"error": "Failed to fetch or parse the feed."}), 502

        notes = []
        for entry in feed.entries:
            raw_summary = entry.get("summary", "")
            notes.append(
                {
                    "title": entry.get("title", "Untitled"),
                    "link": entry.get("link", "#"),
                    "published": entry.get("published", "Unknown date"),
                    "summary_html": raw_summary,
                    "summary_text": strip_html(raw_summary),
                }
            )

        return jsonify({"notes": notes, "feed_title": feed.feed.get("title", "BigQuery Release Notes")})

    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
