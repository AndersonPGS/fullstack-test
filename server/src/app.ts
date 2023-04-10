import express from 'express';
import multer from 'multer';
import path from 'path';
import { createServer } from 'http';
import Pusher from 'pusher';

const app = express();
const httpServer = createServer(app);
const pusher = new Pusher({
  appId: "1581758",
  key: "a82b30f1eb6a9725e188",
  secret: "f2e6bbb1f8215d0484f8",
  cluster: "sa1",
  useTLS: true
});

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
      pusher.trigger('my-channel', 'status', { status });
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

