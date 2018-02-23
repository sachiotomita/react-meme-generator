let express = require('express'),
    path = require('path'),
    router = express.Router(),
    multer = require('multer');
let app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, '..', 'public'))); //serves the index.html
app.use('/upload', express.static('upload'));
app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port'));
});

// configuring Multer to use files directory for storing files
// this is important because later we'll need to access file path
const storage = multer.diskStorage({
    destination: './upload',
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({
    storage
});

// express route where we receive files from the client
// passing multer middleware
app.post('/upload', upload.single('file'), (req, res, next) => {
    res.sendStatus(200);
});

app.get('/upload/:name', function (req, res, next) {

    let options = {
        root: path.join(__dirname, '..', '..', 'upload'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    let fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});