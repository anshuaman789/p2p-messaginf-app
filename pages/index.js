import React, { useState, useEffect } from 'react';
import { createSwarm } from '../lib/swarm';

const Message = ({ timestamp, username, message }) => (
  <div>
    [{timestamp}] {username}: {message}
  </div>
);

const Index = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [swarm, setSwarm] = useState(null);

  useEffect(() => {
    if (username) {
      const newSwarm = createSwarm(username, (message) => {
        setMessages((messages) => [...messages, message]);
      });
      setSwarm(newSwarm);
    }
  }, [username]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const timestamp = new Date().getTime();
    const newMessage = {
      timestamp,
      username,
      message,
    };
    setMessages((messages) => [...messages, newMessage]);
    if (swarm) {
        swarm.peers.forEach((peer) => {
          peer.send(JSON.stringify(newMessage));
        });
      }
      setMessage('');
    };
  
    return (
      <div>
        <h1>P2P Messaging App</h1>
        {!username && (
          <form onSubmit={handleSubmit}>
            <label>
              Enter your username:
              <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <button type="submit">Join Chat</button>
          </form>
        )}
        {username && (
          <div>
            <h2>Welcome, {username}!</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Message:
                <input type="text" value={message} onChange={handleMessageChange} />
              </label>
              <button type="submit">Send</button>
            </form>
            <div>
              {messages.map((message, index) => (
                <Message key={index} {...message} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Index;
  