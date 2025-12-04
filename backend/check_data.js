require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected');

        const userCount = await User.countDocuments();
        const petCount = await Pet.countDocuments();

        console.log(`Users: ${userCount}`);
        console.log(`Pets: ${petCount}`);

        if (petCount > 0) {
            const pets = await Pet.find({});
            console.log('First pet:', JSON.stringify(pets[0], null, 2));
        }

        if (userCount > 0) {
            const users = await User.find({});
            console.log('First user:', JSON.stringify(users[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

connectDB();
