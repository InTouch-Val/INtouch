import React, { useState } from 'react';
import { useAuth } from '../service/authContext';
import '../css/settings.css';
import API from '../service/axios';
import FormData from 'form-data';
import { useNavigate } from 'react-router-dom';

//TODO: PopUp windows for users 

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
  const [previewImage, setPreviewImage] = useState(currentUser.photo || 'default-avatar.png')
  const fileInputRef = React.createRef()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if(file){
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
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

  const handleChooseFileClick = () => {
    fileInputRef.current.click()
  }


  return (
    <div className="settings-profile-tab">
      <div className="left-column">
        <img src={previewImage} alt="Profile" className="avatar" />
        <input type="file" ref={fileInputRef} style={{display: "none"}} onChange={handleFileSelect} />
        <button className='action-button' onClick={handleChooseFileClick}>Change Photo</button>
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
            className='settings-input'
          />
          
          <label htmlFor='lastName'>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className='settings-input'
          />

          <label htmlFor='email'>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            className='settings-input'
          />

          <label htmlFor='dateOfBirt'>Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            placeholder="Date of Birth"
            className='settings-input'
          />
          <button id='save-settings' type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  )
}

const SecurityTab = () => {
  const [userPassword, setUserPassword] = useState({
    password: '',
    new_password: '',
    confirm_new_password: ''
  })
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const {logout} = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const {name, value} = event.target
    setUserPassword({
      ...userPassword, 
      [name]: value
    })
  }

  const handleModalToggle = () => {
    setShowModal(!showModal)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      const response = await API.post(`user/update/password/`, userPassword)
      console.log(response.data)
      setMessage(response.data.message)
    }
    catch(e){
      console.error(e)
      setMessage('Error updating password: ' + e.data?.message)
    }
  }

  const handleDeleteProfile = async () => {
    try{
      const response = await API.get(`user/delete/`)
      console.log(response)
      setMessage(response.data.message)
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 1500)

    }
    catch(e){
      console.error(e)
      setMessage('Error deleting profile: ' + e.data?.message)
    }
  }

  return (
    <div className="security-tab">
      <div>
        <h2>Change Password</h2>
        <div className='change-password-form'>
          <form onSubmit={handleSubmit}>
            <label>Current Password</label>
            <input 
              type="password" 
              placeholder="***********"
              name="password"
              value={userPassword.password}
              onChange={handleChange}
              className='settings-input' />
            
            <label>New Password</label>
            <input 
              type="password" 
              placeholder="***********"
              name="new_password"
              value={userPassword.new_password}
              onChange={handleChange}
              className='settings-input' />

            <label>Confirm New Password</label>
            <input 
              type="password" 
              placeholder="***********"
              name="confirm_new_password"
              value={userPassword.confirm_new_password}
              onChange={handleChange}
              className='settings-input' />

            <button id='save-settings' type='submit'>Save Changes</button>
          </form>
          {message && <div className='success-message'>{message}</div>}
        </div>
      </div>
      <div className='danger-zone'>
        <h2>Danger zone</h2>
        <button onClick={handleModalToggle}>Delete Profile Forever</button>
        {showModal && (
          <div className='modal-overlay' onClick={handleModalToggle}>
            <div className='modal' onClick={e => e.stopPropagation()}>
              <button className="close-modal-button" onClick={handleModalToggle}>&times;</button>
              <div className='delete-modal-div'>
                <p>Are you sure you want to delete your profile forever? <strong>This action is irrevertable!</strong></p>
                <div>
                  <button className='action-button' onClick={handleModalToggle}>Cancel</button>
                  <button className='action-button' onClick={handleDeleteProfile}>Delete Forever</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage;
