const mongoose = require("mongoose");

const connDb = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to ${db.connection.host}`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = connDb;