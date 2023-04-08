import express from 'express';
import WebSocket from 'ws';
import multer from 'multer';
import path from 'path';

const app = express();

const server = app.listen(3001, () => {
  console.log('Servidor iniciado na porta 3001');
});

const wss = new WebSocket.Server({ server });

var cors = require('cors')

app.use(cors())
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

app.post('/api', upload.single('file'), (req, res) => {
  const { file } = req;

  const updateStatus = (status: string) => {
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ status }));
    });
  }

  updateStatus('Editando');
  setTimeout(() => {
    updateStatus('Processando');
    setTimeout(() => {
      console.log(file)
      if (file) {
        console.log("file")
        updateStatus(`Finalizado`);
        res.download(path.join(file.path))
      }
    }, 2000);
  }, 2000);
});


app.get('/', (req, res) => {
  return res.json("Created by AndersonPGS access my github to more info")
});