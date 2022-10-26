
const fs = require('fs');

export const image_downloader = async (imgLink, id) => {
    
    let file = fs.createWriteStream(__dirname + `${id}.jpg`);
    
    await new Promise((resolve, reject) =>{
        let stream = request({
            uri : imgLink,
            headers : {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection' : 'keep-alive' ,
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Mobile Safari/537.36'
            },
            gzip: true
        })
        .pipe(file)
        .on('finish', () =>{
            console.log(`${id} : Downloading Finished`) ;
            resolve(); 
        })
        .on('error' , (error) => {
            reject(error);
        })

    }).catch(error =>{
        console.log(`${id} has Error on download. ${error}`)
        })
}