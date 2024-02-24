const jwt = require('jsonwebtoken');
const User = require("../models/User");
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookie.token || req.body.token || req.header('Authentication').replace('Bearer ', '');
        if(!token){
            return res.status(401).json({
                success: false,
                messsage: 'No Token Available'
            });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } 
        catch (error) {
            return res.status(401).json({
                success: false,
                messsage: 'Token is Invalid'
            });
        }
        next();
    } 
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            messsage: 'Cannot Validate Token'
        });
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Student'){
            return res.status(401).json({
                success: false,
                messsage: 'This Route is only for Student'
            });
        }
        next();
    } 
    catch (error) {
        return res.status(401).json({
            success: false,
            messsage: 'User Role Cannot be Verify'
        });
    }
}

exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Instructor'){
            return res.status(401).json({
                success: false,
                messsage: 'This Route is only for Student'
            });
        }
        next();
    } 
    catch (error) {
        return res.status(401).json({
            success: false,
            messsage: 'User Role Cannot Be Verify'
        });
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== 'Admin'){
            return res.status(401).json({
                success: false,
                messsage: 'This Route is only for Student'
            });
        }
        next();
    } 
    catch (error) {
        return res.status(401).json({
            success: false,
            messsage: 'User Role Cannot be Verify'
        });
    }
}