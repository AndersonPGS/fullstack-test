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

    const formData = new FormData();
    formData.append('file', input);

    try {
      setStatus('Enviando arquivo...');
      const response = await axios.post('http://localhost:3001/api', formData, {
        responseType: 'blob'
      });

      setStatus('Processando arquivo...');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'image.png');
      document.body.appendChild(link);
      link.click();

      link.onload = () => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      };
    } catch (error) {
      console.log(error);
    }
  };


  console.log(status)

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="data-input">
          <input
            id="data-input"
            type="file"
            onChange={(e) => setInput(e.target.files[0])}
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {status ? (status === "Finalizado" ? <p>{data}</p> : <p>Status: {status}</p>) : null}
    </div>
  );
}

export default App;
