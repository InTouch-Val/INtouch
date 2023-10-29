import React from 'react'
import '../css/storage.css'
import assignmentsData from '../data/assignments.json'

const StoragePage = () => {
  return (
    <div className='storage-page'>
        <header>
            <h1>Storage</h1>
        </header>
        <div className='storage-capacity'>
            <div className='storage-info'>
                <h4>Storage</h4>
                <h4>55%</h4>
            </div>
            <div className='storage-progress-line'>
                {/*Progress Line */}
            </div>
        </div>
        <h4>Folders</h4>
        <div className='storage-folders'>
            <div className='folder photo'>
                <h5>Photo</h5>
                <p>24 files</p>
            </div>
            <div className='folder documents'>
                <h5>Documents</h5>
                <p>30 files</p>
            </div>
            <div className='folder links'>
                <h5>Links</h5>
                <p>20 links</p>
            </div>
        </div>
        <div className='storage-notes'>
            <div className='storage-notes-first-row'>
                <h4>Notes</h4>
                <button className='add-note'>Add Note</button>
                <div className='storage-notes-clients'>
                    <p>Clients</p>
                    <select>
                        <option value="clients">Clients</option>
                    </select>
                </div>
            </div>
        <div className="storage-notes-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Type</th>
              <th>Modified</th>
              <th>Popularity</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsData.filter((assignment) => !assignment.archived).map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.title}</td>
                <td>{assignment.author}</td>
                <td>{assignment.status}</td>
                <td>{assignment.type}</td>
                <td>{assignment.modified}</td>
                <td>{assignment.popularity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        </div>
    </div>
  )
}

export default StoragePage