import express from 'express';
import WebSocket from 'ws';
import multer from 'multer';
import path from 'path';

const app = express();

const port = process.env.PORT || 3001

const server = app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
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
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
});


app.get('/', (req, res) => {
  return res.json("Created by AndersonPGS | Access my github profile to more info")
});