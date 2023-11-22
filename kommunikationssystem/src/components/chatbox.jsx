import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');

  

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== '' && username.trim() !== '') {
      const messageData = {
        fromUsername: sessionStorage.getItem('token').replace(/['"]+/g, ''),
        toUsername: username,
        text: inputText,
      };

      try {
        // Send the message using Axios
        await axios.post('http://localhost:3005/chats/send', messageData);

        // Update the local state with the new message
        setMessages([...messages, { text: inputText, fromUsername: sessionStorage.getItem('token').replace(/['"]+/g, ''), id: new Date().getTime() }]);
        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const retrieveMessages = async () => {
    try{
      const response = await axios.get(`http://localhost:3005/chats/retrieve?fromUsername=${sessionStorage.getItem('token').replace(/['"]+/g, '')}&toUsername=${username}`)
      
      setMessages(response.data)

    }catch(error){
      console.error('Error sending message:', error)
    }
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
        <button onClick={retrieveMessages}>GetMessages</button>
      </div>
    </div>
  );
};

export default Chatbox;
