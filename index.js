const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3077;

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' is the field name for the uploaded file

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Set up a basic route
app.get('/', (req, res) => res.send('Hello World!'));

// Upload endpoint
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send({ message: err });
    } else {
      if (req.file == undefined) {
        res.send({ message: 'No file selected!' });
      } else {
        res.send({
          message: 'File uploaded successfully!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
