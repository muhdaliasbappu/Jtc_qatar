const async = require('hbs/lib/async')
var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
const { ObjectId } = require("mongodb");


    const bcrypt = require("bcrypt");


module.exports = {
  createAdmin: async (adminData) => {
    try {
      const { username, password } = adminData;

      // Check if the username already exists
      const existingAdmin = await db.get().collection("adminlogin").findOne({ username });
      if (existingAdmin) {
        return { status: false, message: "Username already taken" };
      }

      // Hash the password before storing (recommended)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create admin object
      const newAdmin = {
        username,
        password: hashedPassword,
      };

      // Insert into "adminlogin" collection
      await db.get().collection("adminlogin").insertOne(newAdmin);

      return { status: true };
    } catch (error) {
      console.error("Error in createAdmin:", error);
      return { status: false };
    }
  },
  doLogin: async (adminData) => {
    try {
      // Find the admin by username
      const admin = await db
        .get()
        .collection("adminlogin")
        .findOne({ username: adminData.username });

      if (!admin) {
        // If admin user is not found
        return { status: false };
      }

      // Compare the plain text password with the stored hashed password
      const passwordMatch = await bcrypt.compare(adminData.password, admin.password);

      if (passwordMatch) {
        // If they match, login is successful
        return { status: true, admin };
      } else {
        // If they don’t match, login fails
        return { status: false };
      }
    } catch (err) {
      console.error(err);
      return { status: false };
    }
  },

    getadminDetails: () => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection('adminlogin').findOne({})
            resolve(admin)
        })
    },

  updateadmin: async (adminId, adminDetails) => {
    try {
      const updateFields = {};

      // Update username if provided
      if (adminDetails.username) {
        updateFields.username = adminDetails.username;
      }

      // If a new password is provided, hash it (optional)
      if (adminDetails.password) {
        const bcrypt = require("bcrypt");
        const saltRounds = 10;
        updateFields.password = await bcrypt.hash(adminDetails.password, saltRounds);
      }

      // Perform the update in the database
      const result = await db
        .get()
        .collection("adminlogin")
        .updateOne(
          { _id: new ObjectId(adminId) }, // Convert adminId to ObjectId
          { $set: updateFields }
        );

      if (result.modifiedCount > 0) {
        return { status: true };
      } else {
        return { status: false, message: "No changes made or admin not found" };
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      return { status: false, error };
    }
  },


}
