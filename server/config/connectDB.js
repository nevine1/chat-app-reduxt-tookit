const mongoose = require('mongoose');

async function connectDB (){
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        const connection = mongoose.connection;
        connection.on('connected', () =>{
            console.log('connected to mongoose db')
        });
        
        // if it is not connected 
        connection.on("not connected", (error) =>{
            console.log("not connection, " , error)
        })
    }catch(err){
        console.log(`something is wrong, ${err}`)
    }
}


module.exports = connectDB;