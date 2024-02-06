import { useState } from 'react';
import { Link } from 'react-router-dom';
import communityData from '../data/community.json';
import '../css/community.css';

function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = communityData.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="community-page">
      <header>
        <h1>Community</h1>
      </header>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="chat-list">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Last Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredChats.map((chat) => (
              <tr key={chat.chatId}>
                <td className="user-cell">
                  <Link to={`/community/${chat.chatId}`} state={{ chatId: chat.chatId }}>
                    <img src={chat.avatar} alt={chat.name} className="avatar" />
                    {chat.name}
                  </Link>
                </td>
                <td>{chat.messages[chat.messages.length - 1].text}</td>
                <td>{formatDate(chat.messages[chat.messages.length - 1].timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(timestamp) {
  const currentDate = new Date();
  const messageDate = new Date(timestamp);
  const diffDays = Math.floor((currentDate - messageDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return '1 day ago';
  } else {
    return `${diffDays} days ago`;
  }
}

export { CommunityPage };
