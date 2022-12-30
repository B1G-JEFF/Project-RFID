const tagModel = /^([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+$/g

let tag = "AF 23 34 EE"

if (tagModel.test(tag)) {
    if (tag.length != 11) {
        console.log("isso nao e uma tag")
        return false
    }
    console.log("isso e uma tag")
    return true
}
//  else {
//     console.log("isso nao e uma tag")
//     return false
// }

