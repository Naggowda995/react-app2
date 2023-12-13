import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [existingNames, setExistingNames] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Fetch existing names from the server on component mount
    fetchExistingNames();
  }, []);

  const fetchExistingNames = async () => {
    try {
      const response = await axios.get('http://localhost:8088/api/existingNames');
      setExistingNames(response.data);
    } catch (error) {
      console.error('Error fetching existing names:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the name already exists locally
    if (existingNames.includes(name)) {
      setAlertMessage('Username already exists');
      return;
    }

    try {
      // Make a POST request to the backend API
      const response = await axios.post('http://localhost:8088/api/submit', {
        name,
      });

      // Display the alert message from the server response
      setAlertMessage(response.data);

      // Clear the input field after successful submission
      setName('');

      // Fetch updated existing names from the server
      fetchExistingNames();
    } catch (error) {
      // Handle errors, such as network issues or server errors
      console.error('Error submitting data:', error);
      setAlertMessage('Server error, connect to the server.');
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value.replace(/[^A-Za-z]/g, '');
    setName(newName);
  };

  return (
    <div>
      <h1>User Input</h1>
      {alertMessage && <p>{alertMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;

