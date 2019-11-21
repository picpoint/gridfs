const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const port = process.env.port || 4000;
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});
const urlMongoDB = 'mongodb+srv://rmtar:rmtar@cluster0-nw44p.mongodb.net/gridfsdb?retryWrites=true&w=majority';

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

const conn = mongoose.createConnection(urlMongoDB);

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('gridfscollection');
});

const storage = new GridFsStorage({
  url: urlMongoDB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(err) {
          reject(err);
        } 
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'gridfscollection'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploads = multer({storage});

app.post('/uploads', uploads.single('file'), (req, res) => {
  res.json({file: req.file});
});

app.get('/uploads', (req, res) => {
  res.render('uploads.hbs');
});

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.listen(port, (req, res) => {
  console.log(`--- server start on port ${port}---`);  
});