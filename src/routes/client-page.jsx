import React, { useState } from 'react';
import '../css/clients.css';
import clientsData from '../data/clients.json';
import { Link } from 'react-router-dom';

function ClientPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionsClientId, setOpenActionsClientId] = useState(null);

  const filteredClients = clientsData.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleActions = (clientId) => {
    if (openActionsClientId === clientId) {
      setOpenActionsClientId(null);
    } else {
      setOpenActionsClientId(clientId);
    }
  };

  return (
    <div className='clients-page'>
      <header className='first-row'>
        <h1>Clients</h1>
        <button className='add-client-button'> Add Client</button>
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
                  <Link to={`/clients/${client.id}`}>
                    <img src={client.avatar} alt={client.name} className='avatar' />
                    {client.name}
                  </Link>
                </td>
                <td>{client.status}</td>
                <td>{client.added}</td>
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
      <div className='pagination'>{/* Buttons for pagination */}</div>
    </div>
  );
}

export default ClientPage;
