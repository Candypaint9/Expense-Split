import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"], //the error message when the requirement is not met
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"], //uses third party vaildator,,passes the email value to the function  and if false will thorw the error message
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [6, "Minimum length of password should be 6"],
  },
  upiId: {
    type: String,
    default: "",
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

//password is stored as a hash to prevent theft
userSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next();
  // this.password = await bcrypt.hash(this.password, 10);
  // next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//the password provided is matched with the hashed password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

//static method to login user 
userSchema.statics.login= async function(email,password){
  const user = await this.findOne({email});
  if(user){
    const auth = await bcrypt.compare(password,user.password);
    if(auth){
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
}

const User = mongoose.model("User", userSchema);
export default User;
