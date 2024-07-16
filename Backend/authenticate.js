import User from "./usermodel.js";
import jwt from "jsonwebtoken";
const Authenticate = async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        console.log(token);
        if(!token){
            throw new Error("No token provided");
        }
        const verifyToken = jwt.verify(token,"TOP SECRET");
        const rootUser = await User.find({_id:verifyToken.userId});

        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        next();
    }
    catch(err){
        res.status(401).send("Unauthorized user");
        console.log(err);
    }
};

export {Authenticate};
