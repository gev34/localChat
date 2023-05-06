import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.5.12:3000');

const Chat = () => {
  const [userName, setUserName] = useState('');
  const [tempUserName, setTempUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiveMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on('chat message', receiveMessage);

    return () => {
      socket.off('chat message', receiveMessage);
    };
  }, []);

  const submitUserName = (e) => {
    e.preventDefault();
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', { userName, message });
      setMessage('');
    }
  };

  return (
    <div>
      {!userName && (
        <form onSubmit={submitUserName}>
          <label htmlFor="userName">Enter your user name:</label>
          <input
            type="text"
            id="userName"
            value={tempUserName}
            onChange={(e) => setTempUserName(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      )}
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.userName}: {msg.message}
          </li>
        ))}
      </ul>
      {userName && (
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default Chat;
