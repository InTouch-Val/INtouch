import React, { useState, useEffect } from 'react';
import '../css/clients.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../service/authContext';
import API from '../service/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserPlus, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';



function ClientPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [modalAction, setModalAction] = useState(null)
  const [favoriteAssignments, setFavoriteAssignments] = useState([])
  const [messageToUser, setMessageToUser] = useState(null)

  const [searchTerm, setSearchTerm] = useState('');
  const {currentUser, updateUserData} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    updateUserData()
  }, [])

  useEffect(() => {
    const fetchAssignments = async () => {
      if(modalAction === 'add'){
        try{
          const response = await API.get('assignments/').then(
            response => {
              const data = response.data.filter(assignment => currentUser.doctor.assignments.includes(assignment.id))
              setFavoriteAssignments(data)
            }
          )
        }catch(e){
          console.error(e)
        }
      }
    }

    fetchAssignments()
  }, [modalAction])

  const filteredClients = currentUser?.doctor?.clients.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const openModal = (clientId) => {
    setShowModal(true)
    setSelectedClientId(clientId)    
  };

  const closeModal = () => {
    setShowModal(false)
    setSelectedClientId(null)
    setModalAction(null)
  }
  
  const handleActionSelect = (action) => {
    setModalAction(action)
  }

  const handleAddClient = () => {
    navigate("/add-client")
  }

  const handleDeleteClient = async () => {
    try{
      const response = await API.delete(`client/delete/${selectedClientId}/`)
      await updateUserData()
      setMessageToUser(response.data.message)
      closeModal()
    }
    catch(e){
      console.error(e)
      setMessageToUser('There was an error deleting the client')
    }
  }

  const handleAssignmentAddToClient = async (assignment) => {
    try{
      const response = await API.get(`assignments/set-client/${assignment}/${selectedClientId}/`)
      closeModal()
      setMessageToUser(response.data.detail);

    }catch(e){
      setMessageToUser(e.message);
    }
  }


  return (
    <div className='clients-page'>
      <header className='first-row'>
        <h1>Clients</h1>
        <button className='client-button'
                onClick={handleAddClient}>
               <FontAwesomeIcon icon={faUserPlus} /> Add Client</button>
      </header>
      <div className='search-filters'>
        <form className='search'>
          <input
            type='text'
            className='search-input'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <select className='activity-filters'>
          <option value='all'>All</option>
          <option value='active'>Active clients</option>
          <option value='inactive'>Inactive clients</option>
        </select>
        <select className='added-filters'>
          <option value='added'>Added</option>
        </select>
      </div>
      {messageToUser && (
        <p className='success-message'>
          {messageToUser}
        </p>
      )}
      <div className='clients-list'>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Status</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <Link className='link-to-client' to={`/clients/${client.id}`}>
                    <img src={client.photo} alt={`${client.first_name} ${client.last_name}`} className='avatar' />
                    {`${client.first_name} ${client.last_name}`}
                  </Link>
                </td>
                <td>{client.is_active ? "Active" : "Inactive"}</td>
                <td>{new Date(client.date_joined).toLocaleDateString()}</td>
                <td className='actions'>
                  <button
                    className='open-modal-button'
                    onClick={() => openModal(client.id)}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                  {showModal && (
                      <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                          <button className="close-modal-button" onClick={closeModal}>&times;</button>
                          {
                            !modalAction && (
                              <div>
                                <button className="action-button" onClick={() => handleActionSelect('delete')}>Delete Client</button>
                                <button className='action-button' onClick={() => handleActionSelect('add')}>Add Assignment</button>
                              </div>
                            )
                          }
                          {
                            modalAction == "delete" && (
                              <div className='delete-modal-div'>
                                <p>Are you sure you want to delete this client? This action is irrevertable!</p>
                                <div>
                                  <button className='action-button' onClick={handleDeleteClient}>Delete</button>
                                  <button className='action-button' onClick={closeModal}>Cancel</button>
                                </div>
                              </div>
                            )
                          }
                          {
                            modalAction == "add" && (
                              <div>
                                <p>Choose the assignment you want to assign:</p>
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Title</th>
                                      <th>Description</th>
                                      <th>Type</th>
                                      <th>Language</th>
                                      <th>Author</th>
                                      <th>Update Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {favoriteAssignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                      <td>{assignment.title}</td>
                                      <td>{assignment.text}</td>
                                      <td>{assignment.assignment_type}</td>
                                      <td>{assignment.language}</td>
                                      <td>{assignment.author_name ? assignment.author_name : "Unknow Author" }</td>
                                      <td>{assignment.update_date}</td>
                                      <td>
                                        <button className='action-button' onClick={() => handleAssignmentAddToClient(assignment.id)}>Assign</button>
                                      </td>
                                    </tr>
                                ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientPage;
