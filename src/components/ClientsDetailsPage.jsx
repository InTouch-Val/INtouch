import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import { useAuth } from '../service/authContext';
import { ClientAssignmentTile } from './AssignmentTile';
import API from '../service/axios';
import Notes from './Notes';
import "../css/clients.css"

const ClientDetailPage = () => {
    const { id } = useParams(); 
    const {currentUser, updateUserData} = useAuth()
    const client = currentUser?.doctor.clients.find(client => client.id === Number(id));
    
    const [activeTab, setActiveTab] = useState('profile');
    const [clientAssignments, setClientAssignments] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [editableClient, setEditableClient] = useState({ ...client.client });

    const switchToProfileTab = () => { setActiveTab("profile")}
    const switchToAssignmentsTab = () => { setActiveTab("assignments")}
    const switchToNotesTab = () => { setActiveTab("notes")}

    useEffect(() => {
        const fetchClientAssignments = async () => {
            if(activeTab === 'assignments') {
                try {
                    const response = await API.get('assignments-client/');
                    const data = response.data.filter(assignment => assignment.user === Number(id));
                    setClientAssignments(data);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        fetchClientAssignments()
    }, [id, activeTab])
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
    
    const handleEditToggle = async () => {
        if (isEditing) {
            //save changes
            await saveClientChanges();
            //update client
            await updateUserData();
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        setEditableClient({
            ...editableClient,
            [e.target.name]: e.target.value
        });
    };

    const saveClientChanges = async () => {
        const requestBody = {
            "date_of_birth": editableClient.date_of_birth ? editableClient.date_of_birth : null,
            "client": {
                "diagnosis": editableClient.diagnosis,
                "about": editableClient.about
            }
        } 
        console.log(requestBody)
        try{
            const response = await API.put(`client/update/${id}/`, requestBody)
            console.log(response)
        }
        catch(e){
            console.error("Error saving client", e.message)
        }
    }

    return (
        <div className='client-detail-page'>
            <header>
                <div>
                    <img src={client.photo} className='avatar' style={{"width": "46px"}} />
                    <h2>{`${client.first_name} ${client.last_name}`}</h2>
                </div>
                {activeTab === "profile" && (<button onClick={handleEditToggle} className='client-button'>{isEditing ? 'Save Changes' : 'Edit Client' }</button>)}
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
                    {isEditing ? (
                        <input
                            type="date"
                            name="date_of_birth"
                            value={editableClient.date_of_birth || ''}
                            onChange={handleInputChange}
                            className='settings-input'
                        />
                    ) : (
                        <p>{client.date_of_birth || "No info yet"}</p>
                    )}

                    <h3>Last Update</h3>
                    <p>{new Date(client.last_update).toLocaleDateString() || "No info yet"}</p>

                    <h3>Diagnosis</h3>
                    {isEditing ? (
                        <input
                            type="text"
                            name="diagnosis"
                            value={editableClient.diagnosis || ''}
                            onChange={handleInputChange}
                            className='settings-input'
                        />
                    ) : (
                        <p>{client.client?.diagnosis || "No info yet"}</p>
                    )}

                    <h3>About Client</h3>
                    {isEditing ? (
                        <input
                            type="text"
                            name="about"
                            value={editableClient.about || ''}
                            onChange={handleInputChange}
                            className='settings-input'
                        />
                    ) : (
                        <p>{client.client?.about || "No info yet"}</p>
                    )}
                </div>
            )}
            {/*Assignments Tab View */}
            {activeTab === 'assignments' && (
                <div className='assignments-tab'>
                    {clientAssignments.length > 0 ? clientAssignments.map((assignment) => (
                        <ClientAssignmentTile key={assignment.id} assignment={assignment} />
                    )) : (<div>There is nothing to show yet</div>)}
                </div>
            )}
            {/*Notes Tab View */}
            {activeTab === 'notes' && (
                <div className='notes-tab'>
                    <Notes />
                </div>
            )}
        </div>
    )
}

export default ClientDetailPage
