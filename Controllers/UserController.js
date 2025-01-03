const UserModel= require('../Models/UserModel');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: 86400
    });
}


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const emailExists = await UserModel.findOne({ email });

    if (emailExists) {
        return res.status(400).json('Email already exists!');
    }
    if(!name || !email || !password){
        return res.status(400).json('All fields are required!');
    }

    if(validateEmail(email) === false){ 
        return res.status(400).json('Email must be a valid Email.');
    }

    if(validator.isStrongPassword(password) === false){ 

        return res.status(400).json('Password is not strong enough.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
        name,
        email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
}



module.exports = { registerUser };