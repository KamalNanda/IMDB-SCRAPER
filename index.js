const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const URLS = [
    'https://www.imdb.com/title/tt0371746/?ref_=fn_al_tt_1',
    'https://www.imdb.com/title/tt1228705/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt1300854/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt0458339/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt1843866/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt3498820/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt0800369/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt1981115/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt3501632/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt0800080/?ref_=nv_sr_srsg_0',
    'https://www.imdb.com/title/tt0848228/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt2395427/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt4154756/?ref_=nv_sr_srsg_0',
    'https://www.imdb.com/title/tt4154796/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt0478970/?ref_=nv_sr_srsg_0',
    'https://www.imdb.com/title/tt5095030/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt2250912/?ref_=nv_sr_srsg_0',
    'https://www.imdb.com/title/tt6320628/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt2015381/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt3896198/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt1211837/?ref_=tt_sims_tti',
    'https://www.imdb.com/title/tt4154664/?ref_=nv_sr_srsg_0',
    'https://www.imdb.com/title/tt1825683/?ref_=nv_sr_srsg_0',
];

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

