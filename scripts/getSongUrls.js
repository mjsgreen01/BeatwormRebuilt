// "Dr. Dre": {
//     "2001": {
//         "The Chronic (Intro)": "http://genius.com/Dr-dre-the-chronic-intro-lyrics",

//     },
//     "Compton": {

//     }
// }



var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

var all_songs_array = [],
    file_number = 0,
    partial_artist_url_list = [];

/** 
 * Get artist names and the urls to the page that has their albums listed out.
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

    // map to an array of arrays => [artistName, artistsPageUrl]
    var album_urls_array = _.map(album_urls_object, function (val, key) {
        return _.map(val, function (val, key) {
            return val;
        });
    });

    // flatten from array of arrays to single array
    album_urls_array = album_urls_array.reduce(function(a, b) {
      return a.concat(b);
    }, []);

    return album_urls_array;
}


function getSongUrls () {
    // if we've gone through all the artists in this specific list, go to the next one
    if (partial_artist_url_list.length === 0) {
        partial_artist_url_list = readAlbumUrls();
    }

    var albumUrl = partial_artist_url_list.pop();
    // go to a artist's page
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
            console.log('songs array: ',song_urls_array);
            // add the artists from this page to the global list
            all_songs_array = all_songs_array.concat(song_urls_array);

            if (partial_artist_url_list.length === 0) {
                // save the entire json-list of artists to a file
                saveArtistList(all_songs_array);
                file_number++;
            }

            // go to the next list of artists
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
