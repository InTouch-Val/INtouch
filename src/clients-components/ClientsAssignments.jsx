import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../service/authContext'
import API from '../service/axios'

const ClientsAssignments = () => {
    const {currentUser} = useAuth()
    const [currentTab, setCurrentTab] = useState("all")
    const [assignments, setAssignments] = useState([])
    const [filteredAssignments, setFilteredAssignments] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAssignments = async () => {
            try{
                var response = await API.get('assignments-client/')
                console.log(response)
                response = response.data.filter(assignment => assignment.user === currentUser.id) 
                console.log(response)
            }
            catch(e){
                console.error(e.message)
            }
        }

        fetchAssignments()
    }, [navigate])

  return (
    <div>ClientsAssignments</div>
  )
}

export default ClientsAssignments