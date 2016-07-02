var urls = [
    'http://cnn.com',
    'http://google.com',
    'http://jasongreenonline.com'
];



var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    nightmare = Nightmare();

var starting_url = 'http://genius.com/artists',
    all_artists_object = {};

// get list of urls sorted alphabetically
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
            console.log(list);
            getArtistUrls(list);
        });

}

function getArtistUrls(listUrls) {
    url = listUrls.pop();
    // go to a list of artists
    return nightmare.goto(url)
        .evaluate(function() {
            var artists_object = {};
            // save each artists page link as key/value in an object (key=name, val=url)
            $('a.artists_index_list-artist_name, .artists_index_list>li>a').each(function() {
                var artist_name = $(this).text();
                var artist_url = $(this).attr('href');
                artists_object[artist_name] = artist_url;
            });

            return artists_object;
        }).then(function(artists_object) {
            if (listUrls.length === 0) {
                // save the entire json-list of artists to a file and exit
                saveArtistList();
            } else {
                // add the artists from this page to the global list
                _.extend(all_artists_object, artists_object);
                // go to the next list of artists
                getArtistUrls(listUrls);
            }

        }).catch(function(error) {
            console.error('failed', error);
        });

}

function saveArtistList() {
    // save the object as json to a file
    jsonfile.writeFileSync('artists.js', all_artists_object);
    // exit the script
    process.exit();
}


getListUrls();
