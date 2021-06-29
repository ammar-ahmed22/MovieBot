const Discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();



const client = new Discord.Client();


client.on("ready", async ()=>{
    await client.user.setActivity('for /', {type: "WATCHING"});
    console.log(`Logged in as ${client.user.tag}!`)
})

var movieList = [
    
]

const displayMovies = () =>{
    let parsedMovieList = '';
    for (let i = 0; i < movieList.length; i++){
        parsedMovieList += `${movieList[i].watched ? '✅' : '❌'}  ${movieList[i].name}\n`
    }
    
    return parsedMovieList
}

const addMovie = movie =>{
    let isAdded = false;
    movieList.forEach(movieObj => {
        if (movieObj.name === movie){
            isAdded = true
        }
    })

    if (isAdded){
        return {status: 500, error: `**${movie}** already added`}
    }else{
        movieList.push({name: movie, watched: false})
        return {status: 200, error: null}
    }
}

const watchMovie = movie =>{
    for (let i = 0; i < movieList.length; i++){
        if (movieList[i].name === movie){
            if (!movieList[i].watched){
                movieList[i].watched = true
                return {status: 200, error: null}
            }else{
                return {status: 400, error: `**${movie}** already watched`}
            }
        }
    }

    return {status: 404, error: `**${movie}** not found`}
}

const deleteMovie = movie =>{
    let tempArr = []
    for (let i = 0; i < movieList.length; i++){
        if (movieList[i].name !== movie){
            tempArr.push(movieList[i])
        }
    }
    
    if (tempArr.length !== movieList.length){
        movieList = tempArr;
        return {status: 200, error: null}
    }else{
        return {status: 404, error: `**${movie}** not found!`}
    }
}

const embedTemplate = (title, message) =>{
    const embedMessage = new Discord.MessageEmbed()

    embedMessage.setColor('#00099ff').setTitle(title).setDescription(message);

    return embedMessage
}

client.on("message", async (msg) =>{
    const message = msg.content;
    if (message === "/movies"){
    
        await msg.channel.send(embedTemplate('Movie List:', displayMovies()))

    }else if (message.slice(0, 4) === '/add'){
        
        const movie = message.slice(5);
        const {status, error} = addMovie(movie);

        if (status === 200){
            await msg.channel.send(embedTemplate(`**${movie}** sucessfully added!`, displayMovies()))
        }else{
            await msg.channel.send(embedTemplate(`${status} Error`, error))
        }
        


    }else if (message.slice(0, 6) === '/watch'){
        const movie = message.slice(7);

        const {status, error} = watchMovie(movie);

        if (status === 200){
            await msg.channel.send(embedTemplate(`**${movie}** marked watched!`, displayMovies()))
        }else{
            await msg.channel.send(embedTemplate(`${status} Error`, error))
        }


    }else if (message.slice(0, 7) === '/delete'){
        const movie = message.slice(8);

        const {status, error} = deleteMovie(movie);

        if (status === 200){
            await msg.channel.send(embedTemplate(`**${movie}** sucessfully deleted`, displayMovies()))
        }else{
            await msg.channel.send(embedTemplate(`${status} Error`, error))
        }
    }
})

client.login(process.env.TOKEN)
