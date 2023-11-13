import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve messages when the component mounts
    retrieveMessages();
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== '' && username.trim() !== '') {
      const messageData = {
        fromUsername: sessionStorage.getItem('token'),
        toUsername: username,
        text: inputText,
      };

      try {
        // Send the message using Axios
        await axios.post('http://localhost:3005/chats/send', messageData);

        // Update the local state with the new message
        setMessages([...messages, { text: inputText, fromUsername: sessionStorage.getItem('token'), id: new Date().getTime() }]);
        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const retrieveMessages = async () => {
    // Implement logic to retrieve messages if needed
  };

  return (
    <div>
      <h2>Chatbox</h2>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.fromUsername}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div>
        <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
        <input type="text" placeholder="Message" value={inputText} onChange={handleInputChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
