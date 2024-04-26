import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const socket = io('http://localhost:5172');

function Login() {
    const [userName, setUserName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const User = {
          user: userName
        }
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'sendUser' })
        };

        fetch('http://localhost:5172/login', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
        
      }
 
    return (
        <div className='h-screen bg-zinc-700 text-white flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='bg-zinc-800 p-10'>
                <h1 className='text-2xl font-bold my-2'>Write your userName:</h1>
                <input
                    type="text"
                    placeholder='User Name. . . '
                    className='border-2 border-zinc-500 p-2 w-full text-black'
                    onChange={(e) => setUserName(e.target.value)}
                />
            </form>
        </div>
    )
}

export default Login;
