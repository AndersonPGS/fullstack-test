import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState('');

  const ws = new WebSocket('ws://localhost:3001/');

  useEffect(() => {
    ws.onmessage = event => {
      const { status } = JSON.parse(event.data);
      setStatus(status);
    };
  }, [ws]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3001/api', { input });
    setData(response.data.message)
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="data-input">
          Insira um texto:
          <input
            id="data-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {status ? (status === "Finalizado" ? <p>{data}</p> : <p>Status: {status}</p>) : null}
    </div>
  );
}

export default App;
