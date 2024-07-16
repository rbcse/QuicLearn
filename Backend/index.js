import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { signup, login , authorizeUser , getUserDetailsforProfile } from "./user.js";
import { addQuizQuestion, displayQuizzes, calculateScore } from "./quiz.js";
import { addCourse, getCourses, getCoursesBySearch, getCoursesByRating, addToCart } from "./courses.js";
import  {Authenticate} from "./authenticate.js";
import cookieParser from "cookie-parser";
import { showCartItems , removeFromCart , getNoOfItems  } from "./cart.js";
import { createBlog , getBlogs , getMyBlogs , getBlogsBySearch , likeBlog , dislikeBlog } from "./blog.js";
import { createOrder , makePayment,savePaymentDetails } from "./payment.js";

const PORT = process.env.PORT || 3000;

// Variables
const app = express();
const db = 'mongodb+srv://rahul:rahul@cluster0.rsdrqkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect database
mongoose.connect(db).then(() => {
    console.log("Mongo DB connected");
}).catch((err) => {
    console.log("Retry DB connection");
});

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(session({
    secret: "TOP SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Ensures the cookie is sent only over HTTP(S)
        secure: false // Set to true if using HTTPS
    }
}));


// Functions
app.post("/signup", signup);
app.post("/login", login);
app.get("/getuserdetails",Authenticate,authorizeUser);
app.get("/getprofiledetails",Authenticate,getUserDetailsforProfile);

app.post("/addQuestion", addQuizQuestion);
app.post("/searchSubject", displayQuizzes);
app.post("/calculateScore", Authenticate , calculateScore);

app.post("/addcourse", addCourse);
app.get("/getcourses", getCourses);
app.post("/getcoursesbysearch", getCoursesBySearch);
app.post("/getcoursesbyrating", getCoursesByRating);
app.post("/addtocart", Authenticate, addToCart);

app.get("/getcart",Authenticate,showCartItems);
app.post("/removefromcart",Authenticate,removeFromCart);
app.get("/getnoofitems",Authenticate,getNoOfItems);

app.post("/createblog",Authenticate,createBlog);
app.get("/getblogs",Authenticate,getBlogs);
app.get("/getmyblogs",Authenticate,getMyBlogs);
app.post("/getblogsbysearch",Authenticate,getBlogsBySearch);
app.post("/likeblog",Authenticate,likeBlog);
app.post("/dislikeblog",Authenticate,dislikeBlog);

app.post("/orders",createOrder);
app.get("/payment/:paymentId",makePayment);
app.post("/savepaymentdetails",Authenticate,savePaymentDetails);

app.listen(PORT, () => {
    console.log("Server has started");
});
