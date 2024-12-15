// api/controllers/auth.controller.js
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();
    return res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const signin = async (req, res, next) => {
    const {email, password } = req.body;
  
    try {
      // Check if user already exists
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, "user not found")); 
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(404, "invalid password"));
      const token = jwt.sign({id :validUser._id},process.env.JWT_SECRET )
      const {password: pass, ...rest} = validUser._doc;
      res
      .cookie('access_token', token ,{httpOnly: true})
      .status(200)
      .json(rest);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  };
