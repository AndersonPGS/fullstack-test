import express from 'express';
import WebSocket from 'ws';

const app = express();

const server = app.listen(3001, () => {
  console.log('Servidor iniciado na porta 3001');
});

const wss = new WebSocket.Server({ server });

var cors = require('cors')

app.use(cors())
app.use(express.json());

app.post('/api', (req, res) => {
  const { input } = req.body;

  const updateStatus = (status: string) => {
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ status }));
    });
  }

  updateStatus('Editando');
  setTimeout(() => {
    updateStatus('Processando');
    setTimeout(() => {
      updateStatus(`Finalizado`);
      res.json({ message: `Mensagem: ${input}` });
    }, 5000);
  }, 5000);
});
