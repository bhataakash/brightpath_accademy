document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  const chatButton = document.getElementById('chat-widget-button');
  const minimizeBtn = document.querySelector('.minimize-btn');
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.getElementById('chat-input-field');
  const sendButton = document.getElementById('send-message');
  const newChatBtn = document.querySelector('.new-chat-btn');

  // API Configuration 
  const API_CONFIG = {
    key: 'a42c9183b1msh2b4a680d05177b1p153585jsn0f3f711e1699',
    host: 'unlimited-gpt-4.p.rapidapi.com',
    url: 'https://unlimited-gpt-4.p.rapidapi.com/chat/completions'
  };

  let conversationHistory = [];
  let isProcessing = false;

  function toggleChat() {
    chatWidget.classList.toggle('collapsed');
    if (!chatWidget.classList.contains('collapsed')) {
      chatInput.focus();
    }
  }

  function startNewChat() {
    conversationHistory = [];
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

  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
      ${isUser ? '' : '<i class="fas fa-robot"></i>'}
      <div class="message-content">${content}</div>
      ${isUser ? '<i class="fas fa-user"></i>' : ''}
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function getChatResponse(userMessage) {
    try {
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': API_CONFIG.key,
          'X-RapidAPI-Host': API_CONFIG.host
        },
        body: JSON.stringify({
          model: 'gpt-4o-2024-05-13',
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      // Update conversation history
      conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse }
      );

      return botResponse;

    } catch (error) {
      console.error('API Error:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again.";
    }
  }

  async function handleMessage() {
    if (isProcessing) return;

    const message = chatInput.value.trim();
    if (!message) return;

    isProcessing = true;
    chatInput.value = '';
    chatInput.disabled = true;
    sendButton.disabled = true;

    try {
      // Add user message
      addMessage(message, true);

      // Show typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'message bot typing';
      typingIndicator.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="message-content">
          <span class="typing-dot">.</span>
          <span class="typing-dot">.</span>
          <span class="typing-dot">.</span>
        </div>
      `;
      chatMessages.appendChild(typingIndicator);

      // Get bot response
      const response = await getChatResponse(message);
      
      // Remove typing indicator and add response
      chatMessages.removeChild(typingIndicator);
      addMessage(response);

    } catch (error) {
      console.error('Chat Error:', error);
      addMessage("I apologize, but I encountered an error. Please try again.");
    } finally {
      isProcessing = false;
      chatInput.disabled = false;
      sendButton.disabled = false;
      chatInput.focus();
    }
  }

  // Event Listeners
  chatButton.addEventListener('click', toggleChat);
  minimizeBtn.addEventListener('click', toggleChat);
  newChatBtn.addEventListener('click', startNewChat);
  sendButton.addEventListener('click', handleMessage);

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessage();
    }
  });

  // Initialize chat
  startNewChat();

  // Add CSS for typing animation
  const style = document.createElement('style');
  style.textContent = `
    .typing-dot {
      animation: typingDot 1s infinite;
      opacity: 0;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingDot {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
});