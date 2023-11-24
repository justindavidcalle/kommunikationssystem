import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../css/Chatbox.css';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedUsername, setSelectedUsername] = useState(
    sessionStorage.getItem('token').replace(/['"]+/g, '')
  );
  const [usernames, setUsernames] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3005');
    setSocket(newSocket);

    fetchUsernames();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

  useEffect(() => {
    retrieveMessages();
  }, [messages, selectedUsername]);

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

      socket.emit('sendMessage', messageData);

      setInputText('');
      retrieveMessages();
    }
  };

  const retrieveMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/chats/retrieve?fromUsername=${sessionStorage
          .getItem('token')
          .replace(/['"]+/g, '')}&toUsername=${selectedUsername}`
      );

      const messagesWithIdString = response.data.map((message) => ({
        ...message,
        id: message._id.toString(),
        formattedTime: new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages(messagesWithIdString);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  };

  const handleSelectUsername = (newSelectedUsername) => {
    if (newSelectedUsername === selectedUsername) {
      setShowUserList(false);
    } else {
      setSelectedUsername(newSelectedUsername);
      setShowUserList(false);
      retrieveMessages();
    }
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

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    alert('Reload the page please!');
  };

  const handleToggleUserList = () => {
    setShowUserList((prevShowUserList) => !prevShowUserList);
  };

  return (
    <div>
      <div className="header">
        <h2>Chatbox</h2>
        <div>
          <button onClick={handleToggleUserList}>
            {selectedUsername === ''
              ? 'Select User'
              : `Chat with ${selectedUsername}`}
          </button>
        </div>
      </div>
      <div className="container">
        {showUserList && (
          <ul className="user-list">
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
        )}
        <div className="message-container">
          {messages.map((message) => (
            <div key={message.id}>
              <strong>{message.fromUsername}:</strong> {message.text} - {message.formattedTime}
              <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Message"
            value={inputText}
            onChange={handleInputChange}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Chatbox;
