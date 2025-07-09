const mongoose = require('mongoose');
require('dotenv').config();

const DBConnection = async () => {

    const MONG_URI = process.env.MONGO_URL;
    try {
        await mongoose.connect(MONG_URI, { useNewUrlParser: true });
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting with the database ', error.message);
    }
}

module.exports =  DBConnection ;