
//checks if unique array has matching values with passed array and returns index of matching value of passed array
const checkArrays = (uniqueArr, passedArr) =>{
    let hasMatching = false
    let index = -1;
    for (let i = 0; i < uniqueArr.length; i++){
        for (let j = 0; j < passedArr.length; j++){
            if (uniqueArr[i] === passedArr[j]){
                hasMatching = true
                index = j
                break
            }
        }
    }

    return {match: hasMatching, index}
}

module.exports = checkArrays