document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");

  // Configure backend URL - switches based on where you're running
  const BACKEND_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:5000/message"
    : "https://toosugary.onrender.com/message";

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage("You", message);
    userInput.value = "";

    // Show loading indicator
    const loadingMsg = addMessage("TooSugary", "<span class='loading'>...</span>");

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      chatbox.removeChild(loadingMsg);  // Remove loading
      addMessage("TooSugary", data.reply);

    } catch (error) {
      console.error("Error:", error);
      chatbox.removeChild(loadingMsg);
      addMessage("TooSugary", "Oops! Couldn't connect to the server. Try again later.");
    }
  }

  function addMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender === "You" ? "user-message" : "bot-message"}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    return messageDiv;
  }
});
