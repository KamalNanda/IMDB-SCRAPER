
const fs = require('fs');

export const fileCreater = (movieData) => {
    fs
        .writeFileSync(
             __dirname + "/data.json"
             , JSON.stringify(movieData, null, 4)
             , {encoding:'utf-8'});
}