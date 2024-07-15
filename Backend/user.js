import User from "./usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import session from "express-session";
import Blogs from "./blogmodel.js";
import Profile from "./profile.js";
import Payments from "./paymentmodel.js";
import Courses from './coursemodel.js';

const signup = async (req, res) => {
    const { user_name, user_email, user_password } = req.body;
    const userExists = await User.findOne({ email: user_email });
    if (userExists) {
        console.log("User already exists");
        return res.status(200).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const newUser = new User({
        name: user_name,
        email: user_email,
        password: hashedPassword
    });

    await newUser.save();
    console.log("User signed up successfully");
    return res.status(200).json({ message: 'User signed up successfully' });
}

const login = async (req, res, next) => {
    const {user_email , user_password} = req.body;
    const userExists = await User.findOne({email : user_email});
    if(!userExists){
        return res.status(200).json({message : "User does not exists"});
    }

    const isMatches = await bcrypt.compare(user_password,userExists.password);
    if(!isMatches){
        return res.status(200).json({message : "Incorrect password"});
    }

    // Successfull login
    const token = await userExists.generateToken();
    req.session.jwt = token;
    return res.status(200).json({message : "Login Successful" , token : token});
    
}

const authorizeUser = async(req,res) => {
    const userDetails = [];
    userDetails.push(req.rootUser.name);
    userDetails.push(req.rootUser.email);
    return res.status(200).json({username : req.rootUser.name , useremail : req.rootUser.email , userDetails:userDetails});
}

const getUserDetailsforProfile = async (req,res) => {
    const user_name = req.rootUser.name;
    const user_email = req.rootUser.email;
    const all_blogs = await Blogs.find({user_email : user_email});
    const quiz_data = await Profile.find({email : user_email});
    const userDetails = {
        user_name : user_name , 
        user_email : user_email,
        blogs : all_blogs,
        quiz_data : quiz_data
    }
    const email = req.rootUser.email;
    const courseIds = await Payments.find({email:email}).select('course_id');
    console.log(courseIds);
    const courseDetails = [];
    for(let i=0;i<courseIds.length;i++){
        for(let j=0;j<courseIds[i].course_id.length;j++){
            const obj = {
                course_id : courseIds[i].course_id[j],
                course : await Courses.findOne({_id : courseIds[i].course_id[j]})
            }
            courseDetails.push(obj);
        }
    }
    return res.status(200).json({userDetails:userDetails , courseDetails:courseDetails});
}


export { signup, login,authorizeUser,getUserDetailsforProfile };
