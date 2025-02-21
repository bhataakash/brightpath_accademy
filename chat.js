document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  const chatButton = document.getElementById('chat-widget-button');
  const minimizeBtn = document.querySelector('.minimize-btn');
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.getElementById('chat-input-field');
  const sendButton = document.getElementById('send-message');
  const newChatBtn = document.querySelector('.new-chat-btn');

  // RapidAPI Configuration
  const RAPIDAPI_KEY = 'a42c9183b1msh2b4a680d05177b1p153585jsn0f3f711e1699';
  const RAPIDAPI_HOST = 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com';
  const RAPIDAPI_URL = 'https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask';

  // Toggle chat widget
  function toggleChat() {
    chatWidget.classList.toggle('collapsed');
    if (!chatWidget.classList.contains('collapsed')) {
      chatInput.focus();
    }
  }

  // Start new chat
  function startNewChat() {
    chatMessages.innerHTML = `
      <div class="message bot">
        <i class="fas fa-robot"></i>
        <div class="message-content">
          Hi! I'm GURUAI, your personal learning assistant. How can I help you today?
        </div>
      </div>
    `;
    chatInput.value = '';
    chatInput.focus();
  }

  // Add event listeners
  chatButton.addEventListener('click', toggleChat);
  minimizeBtn.addEventListener('click', toggleChat);
  newChatBtn.addEventListener('click', startNewChat);

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const icon = document.createElement('i');
    icon.className = isUser ? 'fas fa-user' : 'fas fa-robot';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    if (isUser) {
      messageDiv.appendChild(messageContent);
      messageDiv.appendChild(icon);
    } else {
      messageDiv.appendChild(icon);
      messageDiv.appendChild(messageContent);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Process message using RapidAPI
  async function processMessage(userMessage) {
    try {
      const response = await fetch(RAPIDAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        },
        body: JSON.stringify({
          query: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "I apologize, but I couldn't process that request.";

    } catch (error) {
      console.error('Error:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again later.";
    }
  }

  // Message handling with queue system
  let isProcessing = false;
  const messageQueue = [];

  async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message || isProcessing) return;

    try {
      isProcessing = true;
      
      // Add user message
      addMessage(message, true);
      chatInput.value = '';

      // Show typing indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot typing';
      typingDiv.innerHTML = '<i class="fas fa-robot"></i><div class="message-content">Typing...</div>';
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Get AI response
      const response = await processMessage(message);
      chatMessages.removeChild(typingDiv);
      addMessage(response);

    } catch (error) {
      console.error('Error in message handling:', error);
      addMessage("I apologize, but I encountered an error. Please try again.");
    } finally {
      isProcessing = false;
      
      // Process next message in queue
      if (messageQueue.length > 0) {
        const nextMessage = messageQueue.shift();
        handleSendMessage(nextMessage);
      }
    }
  }

  // Send message event listeners
  sendButton.addEventListener('click', () => {
    if (isProcessing) {
      messageQueue.push(chatInput.value.trim());
    } else {
      handleSendMessage();
    }
  });
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isProcessing) {
        messageQueue.push(chatInput.value.trim());
      } else {
        handleSendMessage();
      }
    }
  });

  // Initialize chat
  startNewChat();

  // Error handling for network issues
  window.addEventListener('online', () => {
    addMessage("Connection restored! You can continue chatting.");
  });

  window.addEventListener('offline', () => {
    addMessage("Connection lost. Please check your internet connection.");
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    messageQueue.length = 0;
    isProcessing = false;
  });
});