// src/tracker.js

// A simple Tracker module that logs and sends events.
const tracker = (() => {
    // Local cache for events (optional—you might use this for debugging)
    const events = [];
    
    // Your API endpoint to send tracking events. Replace with your actual URL.
    const endpoint = "http://localhost:5000/api/track";
  
    /**
     * Logs an event by name and additional data.
     * @param {string} eventName - The name of the event, e.g. "user_login"
     * @param {object} eventData - Additional event data (e.g. { success: true })
     */
    const trackEvent = (eventName, eventData = {}) => {
      const event = {
        eventName,
        eventData,
        timestamp: new Date().toISOString()
      };

      // Tracking disabled to reduce console noise during debugging.
      events.push(event);
    };
  
    /**
     * Sends the event data to the server.
     * @param {object} event - The event data object
     */
    const sendEvent = (event) => {
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Event successfully sent:", data);
        })
        .catch((err) => {
          console.error("Error sending event:", err);
        });
    };
  
    /**
     * Attaches a global click listener to track mouse clicks.
     * You can modify the level of detail captured as needed.
     */
    const attachClickTracker = () => {
      document.addEventListener("click", (e) => {
        const target = e.target;
        // Build a minimal data object describing the clicked element:
        const eventData = {
          tagName: target.tagName,
          id: target.id || null,
          classes: target.className || null,
          text: target.textContent.trim().substring(0, 100) // Limit text to 100 characters
        };
        trackEvent("mouse_click", eventData);
      });
    };
  
    /**
     * Initializes the tracker by attaching event listeners.
     * Call this once when your application starts.
     */
    const init = () => {
      // Tracking disabled to reduce console noise during debugging.
      // attachClickTracker();
      // You could also attach other global listeners here.
    };
  
    // Expose the tracking functions
    return {
      trackEvent,
      init,
      get events() {
        return events;
      }
    };
  })();
  
  export default tracker;
  
