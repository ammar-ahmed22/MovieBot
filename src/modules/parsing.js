//Helper functions for parsing strings

const parseUpperCase = str =>{
    let words = str.split(' ');

    for (let i = 0; i < words.length; i++){
        words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase()
    }

    return words.join(' ');
}

//remove space beginning of string
const removeSpace = str =>{
    let spaceCounter = 0;
    if (str[0] === " "){
        spaceCounter = 1
        for (let i = 1; i < str.length; i++){    
            if (str[i] === " " && str[i-1] === " "){
                spaceCounter++
            }
        }
    }
    

    return (spaceCounter > 0) ? str.slice(spaceCounter) : str;
}

//parsing the list of movies from the database for discord
const parseMovieList = movies =>{
    let parsedMovieList = '';


    for (let i = 0; i < movies.length; i++){
        parsedMovieList += `${movies[i].watched ? '✅' : '❌'}  ${movies[i].name}\n`
    }

    return parsedMovieList
}




//creating a template for Embed discord message (allows for nice formatting)
const embedTemplate = (title, message) =>{
    const embedMessage = new Discord.MessageEmbed()

    embedMessage.setColor('#00099ff').setTitle(title).setDescription(message);

    return embedMessage
}

//creating an array of objects for the movie array
const parseMovieArray = (movieArr) =>{
    const result = [];
    for (let i = 0; i < movieArr.length; i++){
        result[i] = {
            "name": movieArr[i],
            "watched":false
        }
    }

    return result;
}

module.exports = { embedTemplate, parseMovieList, parseUpperCase, removeSpace, parseMovieArray }