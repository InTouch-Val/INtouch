import React, { useState } from 'react';
import { useAuth } from '../service/authContext';
import '../css/settings.css';
import API from '../service/axios';
import FormData from 'form-data';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const {currentUser} = useAuth()

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='settings-page'>
        <header>
            <img src={currentUser.photo || 'default-avatar.png'}></img>
            <h2>{`${currentUser.first_name} ${currentUser.last_name}`}</h2>
        </header>
        <div className="tabs">
            <button onClick={() => handleTabClick('profile')} className={activeTab === 'profile' ? 'active' : ''}>
                Profile
            </button>
            <button onClick={() => handleTabClick('security')} className={activeTab === 'security' ? 'active' : ''}>
                Security
            </button>
        </div>
        <div>
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
        </div>
    </div>
  )
}

const ProfileTab = () => {
  const {currentUser, updateUserData} = useAuth()
  const [userData, setUserData] = useState({
    firstName: currentUser.first_name || '',
    lastName: currentUser.last_name || '',
    email: currentUser.email || '',
    dateOfBirth: currentUser.date_of_birth || ''
  })
  const [selectedFile, setSelectedFile] = useState([])


  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0])
    console.log(selectedFile)
  }


  const handleChange = (event) => {
    const {name, value} = event.target
    setUserData({
      ...userData, 
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("first_name", userData.firstName)
    formData.append("last_name", userData.lastName)
    formData.append("email", userData.email)
    formData.append("date_of_birth", userData.dateOfBirth)
    if(selectedFile){
      formData.append("photo", selectedFile)
    }
    
    try{
      const response = await API.put(`user/update/${currentUser.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(() => updateUserData())

      console.log(response);
    } catch(error){
      console.error("Error updating profile:" + error)
    }
  }



  return (
    <div className="settings-profile-tab">
      <div className="left-column">
        <img src={currentUser.photo || 'default-avatar.png'} alt="Profile" className="avatar" />
        <input type="file" onChange={handleFileSelect} />
      </div>
      <div className="right-column">
        <form onSubmit={handleSubmit}>

          <label htmlFor='firstName'>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
          
          <label htmlFor='lastName'>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />

          <label htmlFor='email'>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <label htmlFor='dateOfBirt'>Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            placeholder="Date of Birth"
          />
          <button id='save-settings' type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  )
}

const SecurityTab = () => {
  // Здесь будет логика для безопасности пользователя
  return (
    <div className="security-tab">
      {/* Содержимое вкладки безопасности */}
      <h2>Change Password</h2>
      <input type="password" placeholder="Current Password" />
      {/* И так далее для каждого поля */}
    </div>
  )
}

export default SettingsPage;
