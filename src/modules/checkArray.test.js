const checkArray = require("./checkArray");

test("correctly checking if two array's have any matching values. Returns index of matched value in second array and boolean", ()=>{
    const array1 = ['Ammar', "Saniya", "Zaryab"];
    const array2 = ["Ammar", "Maryam", "Sajjad"];
    const array3 = ["Ittefak", "Mysha", "Yasmina"];

    expect(checkArray(array1, array2)).toEqual({match: true, index: 0})
    expect(checkArray(array1, array3)).toEqual({match: false, index: -1})

})