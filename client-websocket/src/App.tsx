import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import logo from './logo.svg';
import './App.css';

const ws = new WebSocket('ws://localhost:3030');

function App() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    ws.onopen = () => {
      console.log('Connected');
    }
    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data);
      console.log(packet);
      if (packet.type === 'message') {
        setMessages([...messages, packet.data.timestamp + ": " + packet.data.text])
      }
    }
    ws.onclose = () => {
      console.log('Disconnected');
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ws.send(JSON.stringify({type: 'message', data: { text: message }}))
          }}
        >
          <input
              type="text"
              id={'name'}
              placeholder={'Enter message...'}
              value={message}
              onChange={e => setMessage(e.target.value)}
          />
          <input
            type='submit'
            value='Send'
          />
        </form>
        <div>
          {
            messages.map(it => <p style={{margin: 0, padding: 0}} key={it}>{it}</p>)
          }
        </div>
      </header>
    </div>
  );
}

export default App;
