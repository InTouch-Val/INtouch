import React, { useState, useEffect } from 'react';
import '../css/clients.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../service/authContext';

function ClientPage() {
  const [showModal, setShowModal] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [showAssignmentModal, setShowAssignmentModal] = useState(null)
  const [clientToInteract, setClientToInteract] = useState(null)

  const [searchTerm, setSearchTerm] = useState('');
  const {currentUser, updateUserData} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    updateUserData()
  }, [])

  const filteredClients = currentUser?.doctor?.clients.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleActions = (clientId) => {
    if(!showModal){
      setShowModal(clientId)
    }else{
      setShowModal(null)
    }
  };

  const closeModal = () => setShowModal(null) 

  const handleAddClient = () => {
    navigate("/add-client")
  }

  return (
    <div className='clients-page'>
      <header className='first-row'>
        <h1>Clients</h1>
        <button className='add-client-button'
                onClick={handleAddClient}>
        <i class='fa fa-user-plus' style={{color: "white", width: "28px"}}></i> Add Client</button>
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
          <button className='search-button'>&#128269;</button>
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
                    onClick={() => toggleActions(client.id)}
                  >
                    &#8942;
                  </button>
                  {
                    showModal === client.id && (
                      <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                          <button className="close-modal-button" onClick={closeModal}>&times;</button>
                          <button className="action-button">Delete Client</button>
                          <button className='action-button'>Add Assignment</button>
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
