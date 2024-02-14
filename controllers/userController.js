import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import exp from "constants";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_conf, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ Status: "failed", message: "Email already in use!" });
    } else {
      if (name && email && password && password_conf && tc) {
        if (password === password_conf) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashedPassword,
              tc: tc,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({
              email: email,
            });
            // generate jwt token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.send({
              status: "success",
              message: "Registration successful",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "unable to register" });
          }
        } else {
          res.send({
            Status: "failed",
            message: "Password and password conformation dosent match",
          });
        }
      } else {
        res.send({ Status: "failed", message: "All fields are required" });
      }
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email == email && isMatch) {
            //Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              Status: "Success",
              message: "Login succcess",
              token: token,
            });
          } else {
            res.send({
              Status: "failed",
              message: "Email or password is not valid",
            });
          }
        } else {
          res.send({ Status: "failed", message: "Not registered user" });
        }
      } else {
        res.send({ Status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  static changeUserPassword = async(req,res)=>{
    const {password,password_conf} =req.body
    if(password && password_conf){
        if(password !== password_conf){
            res.send({"status":"failed",'message':'password dosent match'})
        }else{
            const salt= await bcrypt.genSalt(10)
            const newhashedPassword=await bcrypt.hash(password,salt)
            res.send({Status:"success","message":"password changed"})
        }
        
    }else{
        res.send({"status":"failed",'message':'Please provide all the details'})
    }
  }
}

export default UserController;
