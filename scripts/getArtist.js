var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

var starting_url = 'http://genius.com/artists',
    file_number = 0;

/**
 * Get list of urls to pages that have lists of artists, sorted alphabetically.
 * Each page has artists with a different starting letter A-Z, and '#' for numbers
 */
function getListUrls() {

    nightmare.goto(starting_url)
        .evaluate(function() {
            var artist_list_urls = [];
            // get the list of hrefs
            $('a.character_index_list-link').each(function() {
                artist_list_urls.push($(this).attr('href'));
            });

            return artist_list_urls;
        })
        .then(function(list) {
            getArtistUrls(list);
        });

}

/**
 * Go to each page with list of artists, and get artist names & artist-page urls
 * Final JSON object is structured `{ artistName: artistUrl }`
 */
function getArtistUrls(listUrls) {
    url = listUrls.pop();
    // go to a list of artists
    return nightmare.goto(url)
        .evaluate(function() {
            var artists_object = {};
            // save each artists page link as key/value in an object (key=artistName, val=url)
            $('a.artists_index_list-artist_name, .artists_index_list>li>a').each(function() {
                var artist_name = $(this).text();
                var artist_url = $(this).attr('href');
                artists_object[artist_name] = artist_url;
            });

            return artists_object;
        }).then(function(artists_object) {
            // save the json-list of artists to a file
            saveArtistList(artists_object);

            // if we've gone thorugh all the lists of artists, exit the script
            if (listUrls.length === 0) {
                process.exit();
            } else {
                // go to the next list of artists
                getArtistUrls(listUrls);
            }

        }).catch(function(error) {
            console.error('failed', error.message);
        });

}

function saveArtistList(artists_object) {
    jsonfile.spaces = 4;
    var fileName = path.join(__dirname, '../collections/artistUrls/artistUrls'+file_number+'.js');
    // save the object as json to a file
    jsonfile.writeFileSync(fileName, artists_object);
    file_number++;
}


getListUrls();
