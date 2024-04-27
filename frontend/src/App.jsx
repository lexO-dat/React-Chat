import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-api-w1i0.onrender.com/');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [isUserNameSet, setIsUserNameSet] = useState(false); // Estado para controlar si el nombre de usuario ya está establecido
  const [showUserNameInput, setShowUserNameInput] = useState(false); // Estado para controlar si se muestra el cuadro de entrada del nombre de usuario

  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMessage = {
      user: userName,
      body: message,
      from: 'Me'
    }

    socket.emit('message', newMessage);
    setMessages([...messages, newMessage]);
    setMessage('');
  }

  useEffect(() => {
    socket.on('message', receiveMessage);

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      socket.off('message', receiveMessage);
    }
  }, [messages]);

  useEffect(() => {
    // Si el nombre de usuario no está establecido, mostrar el popup para solicitarlo
    if (!isUserNameSet && !userName) {
      setShowUserNameInput(true);
    }
  }, [isUserNameSet, userName]);

  useEffect(() => {
    // Escuchar eventos de teclado para ocultar el cuadro de entrada del nombre de usuario al presionar Enter
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        setIsUserNameSet(true);
        setShowUserNameInput(false);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const receiveMessage = (message) => {
    setMessages((state) => [...state, message]);
  }

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className='h-screen bg-zinc-700 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-800 p-10'>
        <h1 className='text-2xl font-bold my-2'>Chat React y Socket.io</h1>
        <div className="message-container max-h-96 overflow-y-auto">
          <ul>
            {messages.map((message, index) => (
              <li key={index} className={`my-2 p-2 flex items-start rounded-md ${message.from === 'Me' ? 'justify-end' : ''}`}>
                {message.from !== 'Me' && (
                  <div className="w-8 h-8 mr-2 overflow-hidden rounded-full inline-flex items-center justify-center">
                    <img className="object-cover w-full h-full" src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" alt="" />
                  </div>
                )}
                <div className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"}`}>
                  <span className='text-xs text-slade-500 font-bold block'>{message.from}</span>
                  <span className=''>{message.body}</span>
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>

        <input
          type="text"
          placeholder='Write your message: '
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='border-2 border-zinc-500 p-2 w-full text-black'
        />

        <button type='submit' className='bg-sky-700 text-white p-2 w-full mt-2'>Send</button>

        {showUserNameInput && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-700 p-8 rounded-md">
              <h2 className="text-xl font-bold mb-4">Enter your username:</h2>
              <input
                type="text"
                placeholder='Username. . .'
                value={userName}
                onChange={handleUserNameChange}
                className='border-2 border-gray-300 p-2 w-full text-black font-bold'
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default App;
