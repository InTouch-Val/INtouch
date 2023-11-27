import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import { useAuth } from '../service/authContext';
import Notes from './Notes';
import "../css/clients.css"

const ClientDetailPage = () => {
    const { id } = useParams(); 
    const {currentUser} = useAuth()
    const client = currentUser?.clients.find(client => client.id === Number(id));
    
    const [activeTab, setActiveTab] = useState('profile');
    const [chatHistory, setChatHistory] = useState(client.chatHistory);
    const [newMessage, setNewMessage] = useState('');

    const switchToProfileTab = () => { setActiveTab("profile")}
    const switchToAssignmentsTab = () => { setActiveTab("assignments")}
    const switchToNotesTab = () => { setActiveTab("notes")}

    // const sendMessage = () => {
    //     if (newMessage.trim() !== '') {
    //         const message = {
    //             messageId: chatHistory.length + 1,
    //             sender: 'user',
    //             content: newMessage,
    //             date: new Date().toLocaleString(),
    //         };
    //         setChatHistory([...chatHistory, message]);
    //         setNewMessage('');
    //     }
    // };
    
    //   useEffect(() => {
    //     setChatHistory(client.chatHistory);
    //   }, [client.chatHistory]);
    

    return (
        <div className='client-detail-page'>
            <header>
                <img src={client.photo} className='avatar' style={{"width": "46px"}} />
                <h2>{`${client.first_name} ${client.last_name}`}</h2>
            </header>
            <div className='tabs'>
                <button className={activeTab === 'profile'? 'active' : ''} onClick={switchToProfileTab}>Profile</button>
                {/* <button className={activeTab === 'chat'? 'active' : ''} onClick={switchToChatTab}>Chat</button> */}
                <button className={activeTab === 'assignments'? 'active' : ''} onClick={switchToAssignmentsTab}>Assignments</button>
                {/* <button className={activeTab ==='stats'? 'active' : ''} onClick={switchToStatsTab}>Stats</button> */}
                <button className={activeTab === 'notes'? 'active' : ''} onClick={switchToNotesTab}>Notes</button>
            </div>
            {/*Profile Tab View */}
            {activeTab === 'profile' && (
                <div className='profile-tab'>
                    <h3>Date Of Birth</h3>
                    <p>{client.date_of_birth || "No info yet"}</p>

                    <h3>Last Update</h3>
                    <p>{client.last_update || "No info yet"}</p>

                    <h3>Diagnosis</h3>
                    <p>{client.diagnosis || "No info yet"}</p>

                    <h3>About Client</h3>
                    <p>{client.about || "No info yet"}</p>
                </div>
            )}
            {/*Chat Tab View */}
            {/* {activeTab === 'chat' && (
                <div className='chat-tab'>
                    <Chat
                        chatHistory={chatHistory}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                        clientAvatar={client.avatar}
                    />
                </div>
            )} */}
            {/*Assignments Tab View */}
            {activeTab === 'assignments' && (
                <div className='assignments-tab'>
                    
                </div>
            )}
            {/*Notes Tab View */}
            {activeTab === 'notes' && (
                <div className='notes-tab'>
                    <Notes clientNotes={client.notes} />
                </div>
            )}
        </div>
    )
}

export default ClientDetailPage
