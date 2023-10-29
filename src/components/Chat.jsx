import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/chat.css';

const Chat = ({ chatHistory, newMessage, setNewMessage, sendMessage, clientAvatar }) => {
    const userAvatar = "https://yt3.ggpht.com/ytc/AKedOLS-kQc4UMbZacpN7VbKRiVHnYJaRKbTaKu6SSMojw=s88-c-k-c0x00ffffff-no-rj"
    const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((message) => (
          <div
            key={message.messageId}
            className={`message ${message.sender === 'user' ? 'user-message' : 'client-message'}`}
          >
            <img src={message.sender === 'user' ? userAvatar : clientAvatar} alt={message.sender} className="message-avatar" />
            <div className="message-content">
              <p className="message-sender">{message.sender}</p>
              <p className="message-text">{message.text}</p>
              <p className="message-date">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
