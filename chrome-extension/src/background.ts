// Background service worker for VAMS ELD Chrome Extension (Manifest V3)

const OPENROUTER_API_KEY = "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";

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setOptions({ path: "src/popup.html", enabled: true })
    .catch((err) => console.error("Failed to set side panel options:", err));
});

chrome.action.onClicked.addListener((tab) => {
  if (tab?.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch((err) => {
      console.error("Failed to open side panel:", err);
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case "getSession": {
          const result = await chrome.storage.session.get("supabase-session");
          sendResponse({ success: true, session: result["supabase-session"] ?? null });
          break;
        }
        case "setSession": {
          if (!message.session) {
            sendResponse({ success: false, error: "No session data provided" });
            return;
          }
          await chrome.storage.session.set({ "supabase-session": message.session });
          sendResponse({ success: true });
          break;
        }
        case "clearSession": {
          await chrome.storage.session.remove("supabase-session");
          sendResponse({ success: true });
          break;
        }
        case "generateScaffold": {
          if (!message.prompt) {
            sendResponse({ success: false, error: "No prompt provided" });
            return;
          }
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + OPENROUTER_API_KEY,
              "HTTP-Referer": "https://vams-eld.app",
              "X-Title": "VAMS ELD",
            },
            body: JSON.stringify({
              model: message.model || "anthropic/claude-4.6-sonnet",
              messages: [
                {
                  role: "system",
                  content:
                    message.systemPrompt ||
                    "You are an expert ELD scaffolding specialist. Generate a differentiated assignment with the requested scaffolds. Return the result as JSON with fields: scaffolded_html (string), word_bank (array of {term, definition} or null), scaffolds_used (string array), teacher_instructions (string or null).",
                },
                { role: "user", content: message.prompt },
              ],
              max_tokens: message.maxTokens || 16384,
              temperature: message.temperature ?? 0.7,
            }),
          });
          if (!response.ok) {
            const errorBody = await response.text();
            sendResponse({
              success: false,
              error: "OpenRouter API error (" + response.status + "): " + errorBody,
            });
            return;
          }
          const data = await response.json();
          sendResponse({ success: true, data });
          break;
        }
        default:
          sendResponse({ success: false, error: "Unknown message type: " + message.type });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Background script error:", errorMessage);
      sendResponse({ success: false, error: errorMessage });
    }
  })();
  return true;
});