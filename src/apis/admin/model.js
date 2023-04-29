import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const AdminsSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  password: { type: String, required: true }
});

AdminsSchema.pre("save", async function (next) {
  // BEFORE saving the admin in db, executes this custom function automagically
  // Here I am not using arrow functions as I normally do because of "this" keyword
  // (it would be undefined in case of arrow function, it is the current admin in the case of a normal function)

  const currentAdmin = this

  if (currentAdmin.isModified("password")) {
    // only if the admin is modifying the pw (or if the admin is being created) I would like to spend some precious CPU cycles on hashing the pw
    const plainPW = currentAdmin.password

    const hash = await bcrypt.hash(plainPW, 11)
    currentAdmin.password = hash
  }
  // When we are done with this function --> next
  next()
})

AdminsSchema.methods.toJSON = function () {
  // This .toJSON method is used EVERY TIME Express does a res.send(admin/s)
  // This does mean that we could override the default behaviour of this method to remove the passwords (and other unnecessary things as well) and then return the admins

  const adminDocument = this
  const admin = adminDocument.toObject()

  delete admin.password
  delete admin.createdAt
  delete admin.updatedAt
  delete admin.__v
  return admin
}

AdminsSchema.static("checkCredentials", async function (email, password) {
  // My own custom method attached to the AdminsModel

  // Given email and plain text password, this method has to check in the db if the admin exists (by email)
  // Then it should compare the given password with the hashed one coming from the db
  // Then it should return an useful response

  // 1. Find by email
  const admin = await this.findOne({ email }) //"this" here represents the admin Model

  if (admin) {
    // 2. If the admin is found --> compare plain password with the hashed one
    const passwordMatch = await bcrypt.compare(password, admin.password)

    if (passwordMatch) {
      // 3. If passwords they match --> return admin

      return admin
    } else {
      // 4. If they don't --> return null
      return null
    }
  } else {
    // 5. In case of admin not found --> return null
    return null
  }
})

export default model("admin", AdminsSchema);
