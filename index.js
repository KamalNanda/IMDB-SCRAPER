const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const url = require('./URL');
const URLS = url ;
const request = require('request');

(async  () =>{
    let movieData = [];
    for(let movie of URLS) {
        
        const response = await requestPromise({
            uri : movie.url,
            headers : {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Cache-Control': 'max-age=0',
                'Sec-Fetch-Fode': 'navigate',
                'Connection' : 'keep-alive' ,
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Fser': '?1',
                'Host' : 'www.imdb.com' ,
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Mobile Safari/537.36'
            },
            gzip: true
        });
        
        let $ = cheerio.load(response);
        
        let title = $('div[class="media-body"] > h1').text().trim();
        let description = $('p[itemprop="description"]').text().trim();
        let imgLink = $('div[class="media titlemain__overview-media--mobile"]> a > img').attr('data-src-x2');
        let genres = [];
        $('span[itemprop="genre"]').each((i, element) => {
            let genre = $(element).text();
            genres.push(genre);
        });
        let actors = [];
        $('a[itemprop="url"]  strong').each((i, element) =>{
            let actor = $(element).text().trim();
            actors.push(actor);
        });
        movieData.push({
            title: title,
            imgLink: imgLink,
            description: description,
            genres: genres,
            actors: actors
        });


        let file = fs.createWriteStream(__dirname + `${movie.id}.jpg`);
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
                console.log(`${movie.id} : Downloading Finished`) ;
                resolve(); 
            })
            .on('error' , (error) => {
                reject(error);
            })

        }).catch(error =>{
            console.log(`${movie.id} has Error on download. ${error}`)
            })
    }
    console.log(movieData);
    fs.writeFileSync( __dirname + "/data.json", JSON.stringify(movieData, null, 4), {encoding:'utf-8'});
})()

