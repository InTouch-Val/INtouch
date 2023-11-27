import React, { useState, useEffect } from 'react';
import '../css/clients.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../service/authContext';

function ClientPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionsClientId, setOpenActionsClientId] = useState(null);
  const {currentUser, updateUserData} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    updateUserData()
  }, [])

  const filteredClients = currentUser?.clients.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleActions = (clientId) => {
    if (openActionsClientId === clientId) {
      setOpenActionsClientId(null);
    } else {
      setOpenActionsClientId(clientId);
    }
  };

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
                <td className='full-name-cell'>
                  <Link className='link-to-client' to={`/clients/${client.id}`}>
                    <img src={client.photo} alt={`${client.first_name} ${client.last_name}`} className='avatar' />
                    {`${client.first_name} ${client.last_name}`}
                  </Link>
                </td>
                <td>{client.is_active ? "Active" : "Inactive"}</td>
                <td>{new Date(client.date_joined).toLocaleDateString()}</td>
                <td>
                  <button
                    className='actions-button'
                    onClick={() => toggleActions(client.id)}
                  >
                    &#8942;
                  </button>
                  {openActionsClientId === client.id && (
                    <div className='actions-menu'>
                      <Link to={`/clients/${client.id}`}>Edit</Link>
                      <button className='delete-client-button'>Delete</button>
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
