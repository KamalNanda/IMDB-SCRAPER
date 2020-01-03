const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const url = require('./URL');
const URLS = url;

(async  () =>{
    let movieData = [];
    for(let movie of URLS) {
        
        const response = await request({
            uri : movie,
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
        })
        
    }
    console.log(movieData);
    console.log(process.cwd());
    fs.writeFileSync( __dirname + "/data.json", JSON.stringify(movieData, null, 4), {encoding:'utf-8'});
})()

