import express from 'express';
import multer from 'multer';
import path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = process.env.PORT || 3001;

httpServer.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

var cors = require('cors');

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/api', upload.single('file'), (req, res) => {
  try {
    const { file } = req;

    const updateStatus = (status: string) => {
      io.emit('status', status);
    };

    updateStatus('Editando');
    setTimeout(() => {
      updateStatus('Processando');
      setTimeout(() => {
        console.log(file);
        if (file) {
          console.log('file');
          updateStatus(`Finalizado`);
          res.download(path.join(file.path));
        }
      }, 2000);
    }, 2000);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
});

app.get('/', (req, res) => {
  return res.json('Created by AndersonPGS | Access my github profile to more info');
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
});

