import React, { useState } from 'react'
import api from '../api'


const AddFriends = () => {
const [searchTerm, setSearchTerm] = useState('')
const [searchResults, setSearchResults] = useState([])
const [error, setError] = useState('')

const handleSearch = async () => {
    if(!searchTerm.trim()) {
        setError('Please enter a username to search.')
        return
    } 
    try {
        const response = await api.get(`/search-users/?username=${searchTerm}`)
        setSearchResults(response.data)
        setError('')
    } catch(err) {
        setError('Failed to fetch users.')
        console.log(err)
    }
}

  return (
    <div>AddFriends</div>
  )
}

export default AddFriends