const withDB = require("./withDB");
const { parseUpperCase, removeSpace, embedTemplate, parseMovieList, parseMovieArray } = require("./parsing");
const checkArrays = require("./checkArray");
//displaying all movies to discord
const displayMovies = (msg) =>{
    
    withDB(async (db)=>{
        
        const movieObj = await db.collection('movieList').findOne({});

        let movies = movieObj.movies;

        await msg.channel.send(embedTemplate('Movies:', parseMovieList(movies)))
    }, msg)
    
}


//adding a movie to database then displaying movies
const addMovie = (movieArr, msg) =>{
   
    withDB(async (db)=>{
        
        const movieObj = await db.collection('movieList').findOne({});
        
        const { match, index } = checkArrays(movieObj.movies, movieArr);
        
        const parsedMovieArr = parseMovieArray(movieArr);

        
        

        if (!match){
            await db.collection('movieList').updateOne({}, {
                '$set': {
                    movies: movieObj.movies.concat(parsedMovieArr)
                }
            })

            const updatedMovieObj = await db.collection('movieList').findOne({})
            
            await msg.channel.send(embedTemplate(`**${movie}** sucessfully added!`, parseMovieList(updatedMovieObj.movies)))
        }else{
            
            await msg.channel.send(embedTemplate('500 Error', `**${movieArr[index]}** already added`))
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

let testMovieArr = ["Test Movie 4", "Test Movie 5", "Test Movie 6"];

addMovie(testMovieArr, "string")

module.exports = { displayMovies, addMovie, updateMovieStatus, deleteMovie }