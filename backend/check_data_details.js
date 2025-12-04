require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected');

        const users = await User.find({});
        console.log('Users:');
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [${u.role}] ID: ${u._id}`);
        });

        const pets = await Pet.find({});
        console.log('\nPets:');
        pets.forEach(p => {
            console.log(`- ${p.name} (Owner: ${p.owner}) ID: ${p._id}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

connectDB();
