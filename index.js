import express from 'express';
import dotenv from 'dotenv';
import db from './models/db.js'; 
import bcrypt from 'bcrypt'
import User from './models/user.js'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import createToken from './jwt.js';

dotenv.config({
    path:'./.env'
});


const app=express();
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        username,
        password: hashedPassword
      });
      await user.save();
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Error in /register route:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });



  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({
                error: "User does not exist"
            });
        }
        
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(400).json({
                error: "Incorrect username or password"
            });
        }else{
            const accessToken=createToken(user);
            res.cookie("access-token",accessToken,{
                maxAge:60*60*24*30*1000
            })
            res.json("Logged in");
        }
        
        
        
    } catch (error) {
        res.status(500).json({
            error: "An error occurred during login"
        });
    }
});

db()
    .then(()=>{
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err)=>{
        console.log("Mongo DB connection failed!!!",err);
    });

export {app};




