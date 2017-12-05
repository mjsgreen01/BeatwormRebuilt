

var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

var starting_url = 'http://genius.com/artists',
    all_albums_object = {},
    file_number = 0,
    partial_artist_url_list = [];

/**
 * Get artist names and artist-page urls from local files, one file at a time.
 * Artist page should have all their albums listed out.
 * @return Array of tuples with name & url
 */
function readArtistUrls () {
    // reset the albums list for a new file
    all_albums_object = {};

    var file_name = path.join(__dirname, '../collections/artistUrls/artistUrls'+file_number+'.js'),
    artist_urls_object;

    try {
        // get the json object of artist page urls
        artist_urls_object = jsonfile.readFileSync(file_name);
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
    var artist_urls_array = _.map(artist_urls_object, function (val, key) {
        return [key, val];
    });

    return artist_urls_array;
}

/**
 * Go to each artist's page and get name & link to each album.
 * Final JSON object is structured `{ artistName: { albumName: albumUrl } }`
 */
function getAlbumUrls () {
    // if we've gone through all the artists in this specific list, go to the next one
    if (partial_artist_url_list.length === 0) {
        partial_artist_url_list = readArtistUrls();
    }

    var artist = partial_artist_url_list.pop();
    // go to a artist's page
    return nightmare.goto(artist[1])
        .evaluate(function (artist) {
            var artist_name = artist[0];
            var albums_object = {};
            albums_object[artist_name] = {};
            // save each album's page link as key/value in an object (key=albumName, val=url)
            $('.album_list').find('a.album_link').each(function() {
                var album_name = $(this).text();
                var album_url = $(this).attr('href');
                albums_object[artist_name][album_name] = album_url;
            });

            return albums_object;
        }, artist)
        .then(function(albums_object) {
            console.log('album object: ',albums_object);
            // add the albums from this page to the global list
            _.extend(all_albums_object, albums_object);

            if (partial_artist_url_list.length === 0) {
                // save the entire json-list of albums to a file
                saveAlbumList(all_albums_object);
                file_number++;
            }

            // go to the next list of albums
            getAlbumUrls();

        })
        .catch(function(error) {
            console.error('failed', error);
        });

}

function saveAlbumList(all_albums_object) {
    jsonfile.spaces = 4;
    var file_name = path.join(__dirname, '../collections/albumUrls/albumUrls'+file_number+'.js');
    // save the object as json to a file
    jsonfile.writeFileSync(file_name, all_albums_object);
}


getAlbumUrls();
