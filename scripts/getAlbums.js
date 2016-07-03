

// go to artist page
// get all album names and urls as json object
// {
//     kendrick: {
//         TPAB: tbap/url/
//     }
// }
// extend to master object
// write master object to file

var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

var starting_url = 'http://genius.com/artists',
    all_albums_object = {};


var fileName = path.join(__dirname, '../collections/artistUrls.js');
// get the json object of artist page urls
var artist_urls_object = jsonfile.readFileSync(fileName);
// map to an array of arrays => [artistName, artistsPageUrl]
var artist_urls_array = _.map(artist_urls_object, function (val, key) {
    return [key, val];
});


function getAlbumUrls(listUrls) {
    var artist = listUrls.pop();
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
            // add the artists from this page to the global list
            _.extend(all_albums_object, albums_object);

            if (listUrls.length === 0) {
                // save the entire json-list of artists to a file and exit
                saveArtistList(all_albums_object);
            } else {
                // go to the next list of artists
                getAlbumUrls(listUrls);
            }

        })
        .catch(function(error) {
            console.error('failed', error);
        });

}

function saveArtistList(all_albums_object) {
    jsonfile.spaces = 4;
    var fileName = path.join(__dirname, '../collections/albumUrls.js');
    // save the object as json to a file
    jsonfile.writeFileSync(fileName, all_albums_object);
    // exit the script
    process.exit();
}


getAlbumUrls(artist_urls_array);
