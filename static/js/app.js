/* ═══════════════════════════════════════════════════════════════
   BigQuery Release Notes — Client-Side Logic
   ═══════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // ─── DOM handles ───
  const refreshBtn      = document.getElementById("refresh-btn");
  const loadingOverlay  = document.getElementById("loading-overlay");
  const errorBanner     = document.getElementById("error-banner");
  const errorMessage    = document.getElementById("error-message");
  const notesContainer  = document.getElementById("notes-container");
  const emptyState      = document.getElementById("empty-state");

  // Modal
  const tweetModal      = document.getElementById("tweet-modal");
  const tweetTextarea   = document.getElementById("tweet-text");
  const charCurrent     = document.getElementById("char-current");
  const modalCloseBtn   = document.getElementById("modal-close");
  const modalCancelBtn  = document.getElementById("modal-cancel");
  const modalTweetBtn   = document.getElementById("modal-tweet");


  // ─── Helpers ───
  function show(el) { el.classList.remove("hidden"); }
  function hide(el) { el.classList.add("hidden"); }

  function formatDate(raw) {
    try {
      const d = new Date(raw);
      if (isNaN(d)) return raw;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return raw;
    }
  }

  function truncate(text, max = 200) {
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
  }


  // ─── Fetch & Render ───
  async function fetchNotes() {
    // UI → loading
    refreshBtn.classList.add("spinning");
    show(loadingOverlay);
    hide(errorBanner);
    hide(emptyState);

    try {
      const res = await fetch("/api/notes");
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      renderNotes(data.notes);
    } catch (err) {
      errorMessage.textContent = err.message || "An unexpected error occurred.";
      show(errorBanner);
      notesContainer.innerHTML = "";
      show(emptyState);
    } finally {
      hide(loadingOverlay);
      refreshBtn.classList.remove("spinning");
    }
  }

  function renderNotes(notes) {
    notesContainer.innerHTML = "";

    if (!notes || notes.length === 0) {
      show(emptyState);
      return;
    }

    hide(emptyState);

    notes.forEach((note, idx) => {
      const card = document.createElement("article");
      card.className = "note-card";
      card.style.animationDelay = `${idx * 40}ms`;

      card.innerHTML = `
        <span class="note-date">
          <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          ${formatDate(note.published)}
        </span>
        <h3 class="note-title">
          <a href="${note.link}" target="_blank" rel="noopener">${note.title}</a>
        </h3>
        <p class="note-summary">${truncate(note.summary_text, 220)}</p>
        <div class="note-actions">
          <button class="btn-tweet" data-title="${encodeURIComponent(note.title)}" data-link="${encodeURIComponent(note.link)}" data-summary="${encodeURIComponent(truncate(note.summary_text, 100))}">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X
          </button>
          <a class="btn-read-more" href="${note.link}" target="_blank" rel="noopener">
            Read more →
          </a>
        </div>
      `;

      notesContainer.appendChild(card);
    });
  }


  // ─── Tweet Modal ───
  function openTweetModal(title, link, summary) {
    const decoded_title = decodeURIComponent(title);
    const decoded_link  = decodeURIComponent(link);
    const decoded_summary = decodeURIComponent(summary);

    const draft = `📢 ${decoded_title}\n\n${decoded_summary}\n\n🔗 ${decoded_link}\n\n#BigQuery #GoogleCloud #DataEngineering`;
    tweetTextarea.value = draft.slice(0, 280);
    charCurrent.textContent = tweetTextarea.value.length;
    show(tweetModal);
    tweetTextarea.focus();
  }

  function closeTweetModal() {
    hide(tweetModal);
    tweetTextarea.value = "";
    charCurrent.textContent = "0";
  }

  function postTweet() {
    const text = encodeURIComponent(tweetTextarea.value);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, "_blank", "noopener,width=600,height=400");
    closeTweetModal();
  }


  // ─── Event Listeners ───
  refreshBtn.addEventListener("click", fetchNotes);

  // Delegate click on tweet buttons
  notesContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-tweet");
    if (!btn) return;
    openTweetModal(btn.dataset.title, btn.dataset.link, btn.dataset.summary);
  });

  modalCloseBtn.addEventListener("click", closeTweetModal);
  modalCancelBtn.addEventListener("click", closeTweetModal);
  modalTweetBtn.addEventListener("click", postTweet);

  // Close modal on backdrop click
  tweetModal.addEventListener("click", (e) => {
    if (e.target === tweetModal) closeTweetModal();
  });

  // Close modal on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !tweetModal.classList.contains("hidden")) {
      closeTweetModal();
    }
  });

  // Character counter
  tweetTextarea.addEventListener("input", () => {
    charCurrent.textContent = tweetTextarea.value.length;
  });

  // ─── Initial load ───
  fetchNotes();
})();
