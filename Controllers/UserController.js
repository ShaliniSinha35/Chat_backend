const UserModel= require('../Models/UserModel');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 86400
    });
}


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Received data:', { name, email });

        if (!name || !email || !password) {
            return res.status(400).json('All fields are required!');
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json('Email must be a valid Email.');
        }

        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
            return res.status(400).json('Email already exists!');
        }

        // Uncomment if password strength validation is required
        // if (!validator.isStrongPassword(password)) {
        //     return res.status(400).json('Password is not strong enough.');
        // }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Hashing completed');

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();
        console.log('User saved:', savedUser);

        const token = createToken(user._id);
        console.log('Generated Token:', token);

        res.status(200).json({ token, savedUser });
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json('Internal Server Error');
    }
};


const loginUser = async (req, res) => { 
    const { email, password } = req.body;

    try {
        console.log('Received data:', { email,password });

      

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json('Invalid email or password...!');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json('Invalid email or Password....!');
        }

        const token = createToken(user._id);
        console.log('Generated Token:', token);
        res.status(200).json({ token, user });
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json('Internal Server Error');
    }
};

const findUser = async (req, res) => {
    const userId= req.params.userId;

    try{
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).json('User not found');
        }
        res.status(200).json(user); 
    }
    catch(err){
        console.error('Error occurred:', err);
        res.status(500).json('Internal Server Error');      
    }
}

const getUser = async (req, res) => {
    
    try {
        const user = await UserModel.find();          

        if (!user) {    
            return res.status(404).json('User not found');
        }
        else{
            res.status(200).json(user);
        }
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json('Internal Server Error');
    }
};

module.exports = { registerUser,loginUser,findUser,getUser };