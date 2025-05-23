import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"],
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
    },
    phone: {
        type: String,
        default: "",
    },
    upiId: {
        type: String,
        default: "",
    },
    qrCode: {
        type: String,  // Can store base64 image or image URL
        default: "",
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
});


//password is stored as a hash to prevent theft
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
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
// userSchema.statics.login= async function(user,password){
//   if(user){
//     const auth = await bcrypt.compare(password,user.password);
//     if(auth){
//       return user;
//     }
//     throw Error('Incorrect password');
//   }
//   throw Error('Incorrect email');
// }
// Method to check if another user is a friend
userSchema.methods.isFriend = function(userId) {
    return this.friends.some(friendId => friendId.toString() === userId.toString());
  };
  
  // Method to get all user's groups
  userSchema.methods.getGroups = async function() {
    return await mongoose.model('Group').find({ _id: { $in: this.groups }}).populate('members', 'name email');
  };
const User = mongoose.model("User", userSchema);
export default User;
