const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv');
dotenv.config();

//Database connection function
const withDB = async (operations, msg) =>{
    try{
        const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});

        const db = client.db('movie-bot');

        await operations(db);

        client.close()


        
    } catch (error){
        console.log(error)
    }
}

module.exports = withDB