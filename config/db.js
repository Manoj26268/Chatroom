const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://manojanthati26:Manoj@cluster0.zxoafsd.mongodb.net/chatroomDB?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("DB connected");
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;