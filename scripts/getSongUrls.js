
var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

var all_songs_array = [],
    file_number = 0,
    partial_album_url_list = [];

/**
 * Get album urls from local files, one file at a time.
 * Album page should have all the albums songs listed out.
 * @return Array of urls to individual song-pages
 */
function readAlbumUrls () {
    // reset the songs list for a new file
    all_songs_array = [];

    var file_name = path.join(__dirname, '../collections/albumUrls/albumUrls'+file_number+'.js'),
    album_urls_object;

    try {
        // get the json object of album page urls
        album_urls_object = jsonfile.readFileSync(file_name);
    } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File'+file_name+' not found!');
          // exit the script
          process.exit();
        } else {
          throw err;
        }
    }

    // map to an array of album-urls
    var album_urls_array = _.flatten(_.map(album_urls_object, function (albums_object, artist_name) {
        return _.map(albums_object, function (album_url, album_name) {
            return album_url;
        });
    }));

    return album_urls_array;
}

/**
 * Go to each album's page and get link to each song.
 * Final JSON object is array of song-urls
 */
function getSongUrls () {
    // if we've gone through all the albums in this specific list, go to the next one
    if (partial_album_url_list.length === 0) {
        partial_album_url_list = readAlbumUrls();
    }

    var albumUrl = partial_album_url_list.pop();
    // go to a album's page
    return nightmare.goto('http://genius.com' + albumUrl)
        .evaluate(function () {
            var song_urls_array = [];
            // save each song's page link
            $('.album_tracklist .song_list').find('a.song_link').each(function() {
                var album_url = $(this).attr('href');
                song_urls_array.push(album_url);
            });

            return song_urls_array;
        })
        .then(function(song_urls_array) {
            // console.log('songs array: ',song_urls_array);
            // add the songs from this page to the global list
            all_songs_array = all_songs_array.concat(song_urls_array);

            if (partial_album_url_list.length === 0) {
                // save the entire json-list of song-urls to a file
                saveArtistList(all_songs_array);
                file_number++;
            }

            // go to the next list of songs
            getSongUrls();

        })
        .catch(function(error) {
            console.error('failed', error);
        });

}

function saveArtistList(all_songs_array) {
    jsonfile.spaces = 4;
    var file_name = path.join(__dirname, '../collections/songUrls/songUrls'+file_number+'.js');
    // save the object as json to a file
    jsonfile.writeFileSync(file_name, all_songs_array);
}


getSongUrls();
