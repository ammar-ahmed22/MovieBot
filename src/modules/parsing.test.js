import { parseUpperCase, removeSpace } from "./parsing";

test("correctly converting strings to first letter uppercased", ()=>{
    const teststrings = ["aMmAr", "ammar", "AMMAR", "aMMAR"];

    teststrings.forEach( item => {
        expect(parseUpperCase(item)).toBe("Ammar")
    })
})

test("correctly removing spaces from beginning of strings", ()=>{
    const teststrings = [" ammar", "ammar", "  ammar", "     ammar"];

    teststrings.forEach( item =>{
        expect(removeSpace(item)).toBe("ammar")
    })
})