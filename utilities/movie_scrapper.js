const requestPromise = require('request-promise');
const cheerio = require('cheerio');

export const movieScrapper = async (url) => {
    const response = await requestPromise({
        uri : url,
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
    let movie_data = {}
    movie_data['title'] = $('div[class="media-body"] > h1').text().trim();
    movie_data['description'] = $('p[itemprop="description"]').text().trim();
    movie_data['imgLink'] = $('div[class="media titlemain__overview-media--mobile"]> a > img').attr('data-src-x2');
    movie_data['genres'] = [];
    $('span[itemprop="genre"]').each((i, element) => {
        let genre = $(element).text();
        movie_data['genres'].push(genre);
    });
    movie_data['actors'] = [];
    $('a[itemprop="url"]  strong').each((i, element) =>{
        let actor = $(element).text().trim();
        movie_data['actors'].push(actor);
    });

    return movie_data 
}
