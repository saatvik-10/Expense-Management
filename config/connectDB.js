const mongoose = require('mongoose')
const colors = require('colors')

const connectDB =async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Server running on ${mongoose.connection.host}`.bgMagenta.white)
    }catch(err){
        console.log(`${err}`.bgRed)
    }
}

module.exports = connectDB