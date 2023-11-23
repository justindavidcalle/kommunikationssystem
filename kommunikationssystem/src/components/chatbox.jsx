import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chatbox.css';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedUsername, setSelectedUsername] = useState(
    sessionStorage.getItem('token').replace(/['"]+/g, '')
  );
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    fetchUsernames();
  }, []);

  const fetchUsernames = async () => {
    try {
      const response = await axios.get('http://localhost:3005/users');
      setUsernames(response.data);
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== '' && selectedUsername.trim() !== '') {
      const messageData = {
        fromUsername: sessionStorage.getItem('token').replace(/['"]+/g, ''),
        toUsername: selectedUsername,
        text: inputText,
      };

      try {
        await axios.post('http://localhost:3005/chats/send', messageData);
        setMessages([
          ...messages,
          {
            text: inputText,
            fromUsername: sessionStorage
              .getItem('token')
              .replace(/['"]+/g, ''),
            id: new Date().getTime(),
          },
        ]);
        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const retrieveMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/chats/retrieve?fromUsername=${sessionStorage
          .getItem('token')
          .replace(/['"]+/g, '')}&toUsername=${selectedUsername}`
      );

      // Convert ObjectId to string for the 'id' field and format timestamp
      const messagesWithIdString = response.data.map((message) => ({
        ...message,
        id: message._id.toString(),
        formattedTime: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      setMessages(messagesWithIdString);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  };

  const handleSelectUsername = (selectedUsername) => {
    setSelectedUsername(selectedUsername);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:3005/chats/${messageId}`);
      const updatedMessages = messages.filter((message) => message.id !== messageId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div>
      <h2>Chatbox</h2>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.fromUsername}:</strong> {message.text} - {message.formattedTime}
            <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Message"
          value={inputText}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={retrieveMessages}>GetMessages</button>

        <ul>
          {usernames.map((user) => (
            <li
              key={user._id}
              className={user.username === selectedUsername ? 'selected' : ''}
            >
              <button onClick={() => handleSelectUsername(user.username)}>
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chatbox;
