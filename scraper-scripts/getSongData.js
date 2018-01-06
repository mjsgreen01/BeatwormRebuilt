var opts = {
    show: true
};
var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare(opts);

var all_songs_array = [],
    file_number = 0,
    partial_song_url_list = [];

/**
 * Get song urls from local files, one file at a time.
 * @return Array of urls to individual song-pages
 */
function readSongUrls () {
    // reset the songs list for a new file
    all_songs_array = [];

    var file_name = path.join(__dirname, '../collections/songUrls/songUrls'+file_number+'.js');
    // var file_name = path.join(__dirname, '../collections/songUrls/testUrls.js');
    var song_urls;

    try {
        // get the array of song urls
        song_urls = jsonfile.readFileSync(file_name);
    } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File'+file_name+' not found!');
          // exit the script
          process.exit();
        } else {
          throw err;
        }
    }

    return song_urls;
}


/**
 * Go to each song's page and scrape metadata.
 * Final JSON objects will have properties: artist, songTitle, featuredArtists, producers, album, audioLink, tags
 */
function getSongData () {
    // if we've gone through all the songs in this specific list, go to the next one
    if (partial_song_url_list.length === 0) {
        partial_song_url_list = readSongUrls();
    }

    var song_url = partial_song_url_list.pop();
    // go to a song's page
    nightmare
        // TODO: remove this on event when done debugging and running the script
        .on('console', (log,a,b,c,d) => {
            console.log(a,b,c,d)
        })
        .goto(song_url)
        // load script in browser context
        .inject('js', 'getSongDataBrowserHelpers.js')
        // scrape data
        .evaluate(buildSongObject, song_url)
        .then(function(song_data) {
            console.log('songs data: ',all_songs_array);
            // add the song from this page to the global list
            all_songs_array.push(song_data);

            if (partial_song_url_list.length === 0) {
                // save the entire json-list of songs to a file
                saveArtistList(all_songs_array);
                file_number++;
            }

            // go to the next song
            getSongData();

        })
        .catch(function(error) {
            console.error('failed', error);
        });

}

/**
 * Scrape song data from the page and add it to an object
 * @returns {}
 */
function buildSongObject (song_url) {
    let data = {};
    data.artist = window.browserHelpers.getArtist(song_url);
    data.songTitle = window.browserHelpers.getSongTitle(song_url);
    data.featuredArtists = window.browserHelpers.getFeatured(song_url);
    data.producers = window.browserHelpers.getProducers(song_url);
    data.album = window.browserHelpers.getAlbum(song_url);
    data.audioLink = window.browserHelpers.getAudioLink(song_url);

    return data;
}

function getAdditionalProducers (song_url) {

    var artists = [];
    let elem = $('[label="Additional Production by"]');
    logDataNotFound(elem && elem.find('a').length, 'additional producers section ', song_url);

    // add each prod one at a time
    elem.find('a').each(function() {
        let elem = $(this);
        logDataNotFound(elem && elem.text(), 'additional producer ', song_url);
        // trim whitespace and add to list of artists
        artists.push(elem.text().trim());
    });
    return artists;
}

function saveArtistList(all_songs_array) {
    jsonfile.spaces = 4;
    var file_name = path.join(__dirname, '../collections/songData/songData'+file_number+'.js');
    // save the object as json to a file
    jsonfile.writeFileSync(file_name, all_songs_array);
}


getSongData();







