const testMsg = '/add movie';


// console.log(`command: ${testMsg.slice(0, 4)}`);
// console.log(`movie: ${testMsg.slice(5)}`);


let testMovieList = [
    {
        name: "Test Movie",
        watched: true
    },
    {
        name: "Test Movie 2",
        watched: false
    }
]

const addMovie = movie =>{
    let isAdded = false;
    testMovieList.forEach(movieObj => {
        if (movieObj.name === movie){
            isAdded = true
        }
    })

    if (isAdded){
        return {status: 500, error: `${movie} already added`}
    }else{
        testMovieList.push({name: movie, watched: false})
        return {status: 200, error: null}
    }
}




const watchMovie = movie =>{
    for (let i = 0; i < testMovieList.length; i++){
        if (testMovieList[i].name === movie){
            if (!testMovieList[i].watched){
                testMovieList[i].watched = true
                return {status: 200, error: null}
            }else{
                return {status: 400, error: `${movie} already watched`}
            }
        }
    }

    return {status: 404, error: `${movie} not found`}
}

//console.log(testMovieList.indexOf({name: 'Test Movie', watched: true}))

const deleteMovie = movie =>{
    let tempArr = []
    for (let i = 0; i < testMovieList.length; i++){
        if (testMovieList[i].name !== movie){
            tempArr.push(testMovieList[i])
        }
    }
    //console.log(tempArr)
    if (tempArr.length !== testMovieList.length){
        testMovieList = tempArr;
        return {status: 200, error: null}
    }else{
        return {status: 404, error: `${movie} not found!`}
    }
}


//console.log(deleteMovie('Test Movie'))
//console.log(testMovieList)

