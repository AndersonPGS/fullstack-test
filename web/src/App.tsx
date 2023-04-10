import { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState('');

  const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY || '', {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  });
  const channel = pusher.subscribe('my-channel');

  useEffect(() => {
    channel.bind('my-event', (data: any) => {
      setStatus(data.status);
    });
  }, [channel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', input);

    try {
      setStatus('Enviando arquivo...');
      const response = await axios.post('https://fullstack-test-gamma.vercel.app/api', formData, {
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
