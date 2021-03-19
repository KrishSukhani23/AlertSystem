var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const axios = require('axios');
var yahooStockPrices = require('yahoo-stock-prices');
const app = express();
var fs = require('fs');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var locations = []
const gTTS = require('gtts');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"))

// GET Requests
app.get('/', (req, res) => {

    return res.render('landing')
})

app.get('/login', (req, res) => {
    //Serves the body of the page aka "main1.handlebars" to the container //aka "index.handlebars"
    res.render('login');
});

app.get('/landingpage', (req, res) => {
    //Serves the body of the page aka "main1.handlebars" to the container //aka "index.handlebars"
    res.render('landingpage');
});

app.get('/register', (req, res) => {
    //Serves the body of the page aka "main1.handlebars" to the container //aka "index.handlebars"
    res.render('index');
});


app.get('/Homepage', async (req, res) => {
    res.render('Homepage', {

    })
})
app.get('/Alert', (req, res) => {
    //Serves the body of the page aka "main1.handlebars" to the container //aka "index.handlebars"
    res.render('Alert');
});








// POST Requests



app.post('/find', async (req, res) => {
    const response2 = await axios.get('https://driveralert-8d64b-default-rtdb.firebaseio.com/mapInfo.json');
    console.log(response2.data);
    allMapData = []
    for (var key2 in response2.data) {
        // console.log(response2.data[key2])
        allMapData.push([response2.data[key2].Lat, response2.data[key2].Lon, response2.data[key2].Sign])

    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    valsFinal = []
    lat1 = req.body.lat;
    lon1 = req.body.lon;

    console.log(lat1)
    console.log(lon1)
    console.log(locations)
    allMapData.forEach(element => {
        lat2 = element[0];
        lon2 = element[1];
        sign = element[2];
        // console.log(lat2)
        // console.log(lon2)
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        // console.log(dLat)
        var dLon = deg2rad(lon2 - lon1);
        // console.log(dLon)
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // console.log(a)
        // console.log(c)
        var d = R * c; // Distance in km
        console.log(d)
        if (d < 5) {
            valsFinal.push(sign)
        }
    })
    console.log(valsFinal)
    var speech = 'These are the signs you will approach soon\n';

    valsFinal.forEach(function callback(value, index) {
        speech = speech + `${index + 1}` + " " + `${value}`;

    })
    console.log(speech)
    var gtts = new gTTS(speech, 'en');

    gtts.save('C:\\Users\\Krish\\Desktop\\AlertSystem\\public\\audio\\Voice.mp3', function (err, result) {
        if (err) { throw new Error(err); }
        // console.log("Text to speech converted!"); 
    });
    res.render('Alert', {
        email: req.body.email.toString(),
        predictValFinal: valsFinal
    });





    // const response = await axios.post('https://driveralert-8d64b-default-rtdb.firebaseio.com/driverInfo.json', obj);
    // console.log(response);
    // return res.redirect("login");
})


app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    // console.log(req.file)
    fs.readFile(req.file.path, async (err, data) => {
        var parser = require('exif-parser').create(data);
        var result = parser.parse();
        console.log(result.tags.GPSLatitude);
        console.log(result.tags.GPSLongitude);
        // res.json(result);


        // console.log(response);

        const spawn = require('child_process').spawn
        // console.log("Hello")
        const pythonProcess = spawn('python', ['./predict.py', req.file.path])
        // console.log("Hello1")
        pythonProcess.stdout.on('data', async (data) => {
            // console.log("Hello2")
            console.log(data.toString())
            const obj = {
                'Lat': result.tags.GPSLatitude,
                'Lon': result.tags.GPSLongitude,
                'Sign': data.toString(),
            }
            const response = await axios.post('https://driveralert-8d64b-default-rtdb.firebaseio.com/mapInfo.json', obj);
            res.render('Homepage', {
                locations: JSON.stringify(locations),
                email: req.body.email.toString(),
                predictVal: data.toString()
            });
        })

    });
})


app.post('/login', async (req, res) => {
    const response = await axios.get('https://driveralert-8d64b-default-rtdb.firebaseio.com/driverInfo.json');
    console.log(response.data);
    const response2 = await axios.get('https://driveralert-8d64b-default-rtdb.firebaseio.com/mapInfo.json');
    console.log(response2.data);



    for (var key in response.data) {
        console.log(response.data[key])
        var user = response.data[key];
        locations = []
        if (user.email === req.body.email && user.password === req.body.password) {
            for (var key2 in response2.data) {
                // console.log(response2.data[key2])
                locations.push([response2.data[key2].Lat, response2.data[key2].Lon])

            }
            console.log(locations)


            res.render('landingpage', {
                email: req.body.email.toString()
            });

            // res.render('Homepage', {
            //     locations: JSON.stringify(locations),
            //     email: req.body.email.toString()
            // });
            // if(user.consulted === true)
            // {
            //     res.render("thankyou",{presp : user.medicines, consulted : true})
            // }
            // return res.render('Homepage',{email : req.body.email.toString()});
        }
    }

})

app.post('/register', async (req, res) => {
    console.log(req.body);
    if (req.body.email === null || req.body.email.trim().length === 0) {
        console.log('Name should not be empty');
        return;
    }
    if (req.body.password === null || req.body.password.trim().length === 0) {
        console.log('Password should not be empty');
        return;
    }
    if (req.body.contact < 10 || req.body.conact > 10) {
        console.log('Contact can be less or greater than 10');
        return;
    }

    const obj = {
        'email': req.body.email,
        'password': req.body.password,
        'contact': req.body.contact
    }
    const response = await axios.post('https://driveralert-8d64b-default-rtdb.firebaseio.com/driverInfo.json', obj);
    console.log(response);
    return res.redirect("login");
})

app.listen(5000, () => {
    console.log("Server started");
})