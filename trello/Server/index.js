const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('../Server/routes/auth');
const taskRoutes = require('../Server/routes/task');

require('dotenv').config();

const app = express();


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({
  origin: 'https://promanage-nine.vercel.app', 
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
}));


app.use('/auth', authRoutes); 
app.use('/task', taskRoutes);


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log(error));

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection established successfully');
});;

app.get('/', (req, res) => {
    res.send('Welcome to Trello API');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
