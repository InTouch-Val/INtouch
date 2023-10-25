import React, {useState, useEffect} from 'react'
import clientsData from '../data/clients.json'
import { useParams } from "react-router-dom";
import Chat from './Chat' 
import Assignments from './Assignments';
import Notes from './Notes';

const ClientDetailPage = () => {
    const { id } = useParams(); 
    const client = clientsData.find(client => client.id === Number(id));
    
    const [activeTab, setActiveTab] = useState('profile');
    const [chatHistory, setChatHistory] = useState(client.chatHistory);
    const [newMessage, setNewMessage] = useState('');

    const switchToProfileTab = () => { setActiveTab("profile")}
    const switchToChatTab = () => { setActiveTab("chat")}
    const switchToAssignmentsTab = () => { setActiveTab("assignments")}
    const switchToStatsTab = () => { setActiveTab("stats")}
    const switchToNotesTab = () => { setActiveTab("notes")}

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const message = {
                messageId: chatHistory.length + 1,
                sender: 'user',
                content: newMessage,
                date: new Date().toLocaleString(),
            };
            setChatHistory([...chatHistory, message]);
            setNewMessage('');
        }
    };
    
      useEffect(() => {
        setChatHistory(client.chatHistory);
      }, [client.chatHistory]);
    

    return (
        <div className='client-detail-page'>
            <header>
                <img src={client.avatar} alt={client.name} className='avatar' />
                <h3>{client.name}</h3>
            </header>
            <div className='tabs'>
                <button className={activeTab === 'profile'? 'active' : ''} onClick={switchToProfileTab}>Profile</button>
                <button className={activeTab === 'chat'? 'active' : ''} onClick={switchToChatTab}>Chat</button>
                <button className={activeTab === 'assignments'? 'active' : ''} onClick={switchToAssignmentsTab}>Assignments</button>
                <button className={activeTab ==='stats'? 'active' : ''} onClick={switchToStatsTab}>Stats</button>
                <button className={activeTab === 'notes'? 'active' : ''} onClick={switchToNotesTab}>Notes</button>
            </div>
            {/*Profile Tab View */}
            {activeTab === 'profile' && (
                <div className='profile-tab'>
                    <h2>Date Of Birth</h2>
                    <p>{client.dateOfBirth}</p>

                    <h2>Diagnosis</h2>
                    <p>{client.diagnoses.join(', ')}</p>

                    <h2>Last Update</h2>
                    <p>{client.lastUpdate}</p>

                    <h2>About Client</h2>
                    <p>{client.about}</p>
                </div>
            )}
            {/*Chat Tab View */}
            {activeTab === 'chat' && (
                <div className='chat-tab'>
                    <Chat
                        chatHistory={chatHistory}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                        clientAvatar={client.avatar}
                    />
                </div>
            )}
            {/*Assignments Tab View */}
            {activeTab === 'assignments' && (
                <div className='assignments-tab'>
                    <Assignments clientAssignments={client.assignments} />
                </div>
            )}
            {/*Stats Tab View */}
            {/*TODO: Add Stats Tab View*/}
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
