const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const cors = require('cors');   
const router = require('./routes/zomato.routes');  
const authRouter = require('./routes/auth.routes');
app.use(cors()); 
const connection = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/zomato");
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);    
    }
};
connection();



app.use(express.json());
app.use("/zomato",router)
app.use("/auth", authRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
