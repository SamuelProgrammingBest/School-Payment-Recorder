const mongoose = require("mongoose")

const connectMyDB = () => {
    mongoose.connect(process.env.MONGOCONNECT)
    .then(()=>{
        console.log("Database Connection Successful")
    })
    .catch(()=>{
        console.log("Database connection failed")
    })
}

module.exports = {connectMyDB}