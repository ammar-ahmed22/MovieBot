const Discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const MongoClient = require('mongodb').MongoClient


console.log(`Environment: ${process.env.NODE_ENV}`)

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

//Discord client object
const client = new Discord.Client();


//When the bot is ready
client.on("ready", async ()=>{
    await client.user.setActivity((process.env.NODE_ENV === 'DEVELOPMENT') ? 'for . (development)' : 'for .', {type: "WATCHING"});
    console.log(`Logged in as ${client.user.tag}!`)
})

//parsing the list of movies from the database for discord
const parseMovieList = movies =>{
    let parsedMovieList = '';


    for (let i = 0; i < movies.length; i++){
        parsedMovieList += `${movies[i].watched ? '✅' : '❌'}  ${movies[i].name}\n`
    }

    return parsedMovieList
}

//displaying all movies to discord
const displayMovies = (msg) =>{
    
    withDB(async (db)=>{
        
        const movieObj = await db.collection('movieList').findOne({});

        let movies = movieObj.movies;

        await msg.channel.send(embedTemplate('Movies:', parseMovieList(movies)))
    }, msg)
    
}


//adding a movie to database then displaying movies
const addMovie = (movie, msg) =>{
   
    withDB(async (db)=>{
        const movieObj = await db.collection('movieList').findOne({});

        const isAdded = movieObj.movies.some(item =>{
            return item.name === movie;
        })

        if (!isAdded){
            await db.collection('movieList').updateOne({}, {
                '$set': {
                    movies: movieObj.movies.concat({
                        "name": movie,
                        "watched": false
                    })
                }
            })

            const updatedMovieObj = await db.collection('movieList').findOne({})

            await msg.channel.send(embedTemplate(`**${movie}** sucessfully added!`, parseMovieList(updatedMovieObj.movies)))
        }else{
            await msg.channel.send(embedTemplate('500 Error', `**${movie}** already added`))
        }
    }, msg)
}

//updating movie status to watched or not watched then displaying movies
const updateMovieStatus = (movie, status, msg) =>{
    
    withDB(async (db) =>{
        const movieObj = await db.collection('movieList').findOne({});

        const isAdded = movieObj.movies.some(item =>{
            return item.name === movie
        })

        if (isAdded){
            await db.collection('movieList').updateOne({}, {
                '$set': {
                    movies: movieObj.movies.map(item =>{
                        if (item.name === movie){
                            return {
                                'name': item.name,
                                'watched': status
                            }
                        }else{
                            return{
                                'name': item.name,
                                'watched': item.watched
                            }
                        }
                    })
                }
            })

            const updatedMovieObj = await db.collection('movieList').findOne({});

            await msg.channel.send(embedTemplate(`**${movie}** marked watched!`, parseMovieList(updatedMovieObj.movies)))
        }else{
            await msg.channel.send(embedTemplate(`404 Error`, `**${movie}** not found!`))
        }
    }, msg)

}


//deleting a movie from database then displaying movies
const deleteMovie = (movie, msg) =>{
    
    withDB(async (db)=>{

        const movieObj = await db.collection('movieList').findOne({});

        const isAdded = movieObj.movies.some(item =>{
            return item.name === movie
        })

        if (isAdded){
            await db.collection('movieList').updateOne({}, {
                '$set': {
                    movies: movieObj.movies.filter(item =>{
                        return item.name !== movie
                    })
                }
            })

            const updatedMovieObj = await db.collection('movieList').findOne({});

            await msg.channel.send(embedTemplate(`**${movie}** sucessfully removed!`, parseMovieList(updatedMovieObj.movies)))
        }else{
            await msg.channel.send(embedTemplate('404 Error', `**${movie}** not found!`))
        }

    }, msg)

}

//creating a template for Embed discord message (allows for nice formatting)
const embedTemplate = (title, message) =>{
    const embedMessage = new Discord.MessageEmbed()

    embedMessage.setColor('#00099ff').setTitle(title).setDescription(message);

    return embedMessage
}

//listens for message sent in discord
client.on("message", async (msg) =>{
    const message = msg.content;
    if (message === ".movies"){
        
        displayMovies(msg)
        

    }else if (message.slice(0, 4) === '.add'){
        
        const movie = message.slice(5);
        addMovie(movie, msg)
        
    }    

    else if (message.slice(0, 6) === '.watch'){
        const movie = message.slice(7);

        updateMovieStatus(movie, true, msg)

    }else if (message.slice(0, 8) === '.unwatch'){
        const movie = message.slice(9)

        updateMovieStatus(movie, false, msg)
    }
    else if (message.slice(0, 7) === '.delete'){
        const movie = message.slice(8);

        deleteMovie(movie, msg)
    }
})

client.login((process.env.NODE_ENV === 'DEVELOPMENT') ? process.env.DEV_TOKEN : process.env.TOKEN)//if in development, use the DevMovieBot
