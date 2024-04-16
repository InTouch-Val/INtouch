import { useState, createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormData from 'form-data';
import { useAuth } from '../../service/authContext';
import { API } from '../../service/axios';
import '../../css/settings.css';
import { ProfileTab } from './ProfileTab/ProfileTab';
import { SecurityTab } from './SecurityTab/SeciurityTab';

// TODO: PopUp windows for users

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentUser } = useAuth();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="settings-page">
      <header>
        <img alt="img" src={currentUser.photo || 'default-avatar.png'}></img>
        <h2>{`${currentUser.first_name} ${currentUser.last_name}`}</h2>
      </header>
      <div className="tabs">
        <button
          onClick={() => handleTabClick('profile')}
          className={activeTab === 'profile' ? 'active' : ''}
        >
          Profile
        </button>
        <button
          onClick={() => handleTabClick('security')}
          className={activeTab === 'security' ? 'active' : ''}
        >
          Security
        </button>
      </div>
      <div>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}

export { SettingsPage };
