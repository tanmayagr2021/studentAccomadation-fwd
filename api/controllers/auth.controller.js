// api/controllers/auth.controller.js
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(errorHandler(400, "User already exists"));
    }

    // Hash the password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();
    return res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return next(error);  // Forward the error to the errorHandler middleware
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Validate password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid password"));
    }

    // Generate token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error(error);
    return next(error);  // Forward the error to the errorHandler middleware
  }
};

export const google = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Log entire request body
    console.log("photoURL:", req.body.photoURL); // Log photoURL specifically

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = 
        Math.random().toString(36).slice(-8) + 
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      console.log("Generated Password:", generatedPassword); // Log generated password

      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photoURL || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
      });

      console.log("New User Data:", newUser); // Log new user data before saving

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      return res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.error("Error in Google Auth:", error); // Log errors
    return next(error); // Pass error to the error handler
  }
};


// export const google = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email }); // Fixed `reg` to `req`
//     if (user) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//       const { password: pass, ...rest } = user._doc; // Fixed typo: changed `user-_doc` to `user._doc`
//       res
//         .cookie('access_token', token, { httpOnly: true })
//         .status(200)
//         .json(rest);
//     } else {
//       const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
//       const newUser = new User({ // Fixed incorrect use of `await` (not required for instance creation)
//         username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
//         email: req.body.email,
//         password: hashedPassword,  avatar: req.body.photoURL || "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"
//       });
//       await newUser.save();
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//       res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

//     }
//   } catch (error) {
//     next(error); // Ensure errors are passed to the error handler
//   }
// };
