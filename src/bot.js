
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();


//helper functions
const { removeSpace, parseUpperCase } = require("./modules/parsing");

//Database operation functions
const { displayMovies, addMovie, updateMovieStatus, deleteMovie } = require("./modules/dboperations");

//Logging environment settings
console.log(`Environment: ${process.env.NODE_ENV}`)
console.log(`Database URI: ${process.env.MONGO_URI}`)



//Discord client object
const client = new Discord.Client();

//What command prefix to use based on environment
const command = (process.env.NODE_ENV === 'DEVELOPMENT') ? '$' : '.';

//When the bot is ready
client.on("ready", async ()=>{
    await client.user.setActivity((process.env.NODE_ENV === 'DEVELOPMENT') ? `for ${command} (development)` : `for ${command}`, {type: "WATCHING"});
    console.log(`Logged in as ${client.user.tag}!`)
})


//listens for message sent in discord
client.on("message", async (msg) =>{
    const message = msg.content;
    if (message === `${command}movies`){
        
        displayMovies(msg)
        

    }else if (message.slice(0, 4) === `${command}add`){
        
        const movieArr = message.slice(5).split(',').map(movie =>{
            return removeSpace(movie)
        });//passed movies as comma separated list with spaces before removed


        const parsedMovieArr = movieArr.map(movie =>{
            return parseUpperCase(movie)
        })//parsing to first letter of each word capitalized

        
        
        addMovie(parsedMovieArr, msg)
        
    }    

    else if (message.slice(0, 6) === `${command}watch`){
        const movie = message.slice(7);

        updateMovieStatus(movie, true, msg)

    }else if (message.slice(0, 8) === `${command}unwatch`){
        const movie = message.slice(9)

        updateMovieStatus(movie, false, msg)
    }
    else if (message.slice(0, 7) === `${command}delete`){
        const movie = message.slice(8);

        deleteMovie(movie, msg)
    }
})

client.login((process.env.NODE_ENV === 'DEVELOPMENT') ? process.env.DEV_TOKEN : process.env.TOKEN)//if in development, use the DevMovieBot
