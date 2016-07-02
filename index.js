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


function getListUrls() {
    
    nightmare.goto(starting_url)
        .evaluate(function () {
            var artist_list_urls = [];
            // get the list of hrefs
            $('a.character_index_list-link').each(function () {
                artist_list_urls.push( $(this).attr('href') );
            });

            return artist_list_urls;
        })
        // .end()
        .then(function (list) {
            // if (urls.length == 0){
            //     process.exit();
            // } else {
                console.log(list);
                getArtistUrlsAndSave(list);
            // }
        });
    
}

function getArtistUrlsAndSave (listUrls) {
    url = listUrls.pop();
    console.log(url);
    // go to a list of artists
    return nightmare.goto(url)
    .evaluate(function () {
        var artists_object = {};
    // save each artists page link as key/value in an object (key=name, val=url)
        $('a.artists_index_list-artist_name, .artists_index_list>li>a').each(function () {
            console.log($(this));
            var artist_name = $(this).text();
            var artist_url = $(this).attr('href');
            artists_object[artist_name] = artist_url;
        });

        return artists_object;
    }).then(function (artists_object) {
        if (listUrls.length === 0){
            // save the entire json-list of artists to a file and exit
            saveArtistList();
        } else {
             // console.log('artists object',artists_object);
            // add the artists from this page to the global list
            _.extend(all_artists_object, artists_object);
            // console.log(all_artists_object);
            // go to the next list of artists
            getArtistUrlsAndSave(listUrls);
        }

    }).catch(function (error) {
        console.error('failed', error);
      });

    // save the object as json to a file
}

function saveArtistList () {
    jsonfile.writeFileSync('artists.js', all_artists_object);
    
    process.exit();
}


getListUrls();
