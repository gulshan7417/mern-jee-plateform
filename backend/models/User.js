const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName:  { type: String, required: false },
    email:     { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password:  { type: String, required: false },
    role:      { type: String, enum: ["student", "admin"], default: "student" },
    googleId:  { type: String, unique: false, sparse: false },
  },
  { timestamps: true }
);


// userSchema.pre("save", async function (next) {
  
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("User", userSchema);
