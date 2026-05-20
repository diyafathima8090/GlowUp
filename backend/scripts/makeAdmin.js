/**
 * Run this script to promote a user to admin:
 *   node scripts/makeAdmin.js <email>
 * 
 * Example:
 *   node scripts/makeAdmin.js admin@example.com
 */
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/user");

const email = process.argv[2];
if (!email) {
    console.error("Usage: node scripts/makeAdmin.js <email>");
    process.exit(1);
}

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            console.error(`❌ User with email "${email}" not found.`);
        } else {
            console.log(`✅ User "${user.name || user.email}" is now an admin!`);
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        mongoose.disconnect();
    }
}

makeAdmin();
