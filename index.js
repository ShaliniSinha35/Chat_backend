const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userRoute = require('./Routes/UserRoute');

app.use(express.static('public'));
app.use(express.json());
dotenv.config();

app.use(cors());


const port = process.env.PORT || 5000;
const uri = process.env.uri


app.get('/', (req, res) => {
    res.send('Welcome to our Chat APP!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.use('/api/users', userRoute);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {  
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('MongoDB Error: ', err.message);
});