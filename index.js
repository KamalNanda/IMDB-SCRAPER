
const url = require('./URL');
const URLS = url ;
const request = require('request');
const { fileCreater } = require('./utilities/file_writer');
const { image_downloader } = require('./utilities/image_scraper');
const { movieScrapper } = require('./utilities/movie_scrapper');

const scrape = async () => {
    let movieData = [];
    for(let movie of URLS) { 
       let movieObj = await movieScrapper(movie.url)
        movieData.push(movieObj);

        image_downloader(imgLink, movie.id)
    }
    console.log(movieData);
    fileCreater(movieData)
}

scrape()

