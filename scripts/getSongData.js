
var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

var all_songs_array = [],
    file_number = 20,
    partial_artist_url_list = [];

/** 
 * Get artist names and the urls to the page that has their albums listed out.
 */
function readSongUrls () {
    // reset the songs list for a new file
    all_songs_array = [];

    var file_name = path.join(__dirname, '../collections/albumUrls/albumUrls'+file_number+'.js'),
    song_urls_object;

    try {
        // get the json object of album page urls
        song_urls_object = jsonfile.readFileSync(file_name);
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
    var song_urls_array = _.map(song_urls_object, function (val, key) {
        return _.map(val, function (val, key) {
            return val;
        });
    });

    // flatten from array of arrays to single array
    song_urls_array = song_urls_array.reduce(function(a, b) {
      return a.concat(b);
    }, []);

    return song_urls_array;
}


function getSongData () {
    // if we've gone through all the artists in this specific list, go to the next one
    if (partial_artist_url_list.length === 0) {
        partial_artist_url_list = readSongUrls();
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
            // console.log('songs array: ',song_urls_array);
            // add the artists from this page to the global list
            all_songs_array = all_songs_array.concat(song_urls_array);

            if (partial_artist_url_list.length === 0) {
                // save the entire json-list of artists to a file
                saveArtistList(all_songs_array);
                file_number++;
            }

            // go to the next list of artists
            getSongData();

        })
        .catch(function(error) {
            console.error('failed', error);
        });

}


function getArtist () {
    return $('.song_header-primary_info-primary_artist').text();
}

function getSongTitle () {
    return $('.song_header-primary_info-title').text();
}

function getFeatured () {
    var artists = [];
    $('[label="Produced By"]').find('a').each(function() {
        var artist_name = $(this).text();
        // trim whitespace and add to list of artists
        artists.push($.trim(artist_name));
    });
    return artists;
}

function getProducers () {
    var artists = [];
    $('[label="Featuring"]').find('a').each(function() {
        var artist_name = $(this).text();
        // trim whitespace and add to list of artists
        artists.push($.trim(artist_name));
    });
    return artists;
}

function getAlbum () {
    return $('song-primary-album a').text();
}

function getAudioLink () {
    return $('.song_media_controls-selector-icon').find('a').attr('href');
}

function getTags () {
    var tags = [];
    $('.metadata_unit-tags').find('a').each(function() {
        var tag = $(this).text();
        // trim whitespace and add to list of tags
        tags.push($.trim(tag));
    });
    return tags;
}

function getAdditionalProducers () {
    var artists = [];
    $('[label="Additional Production by"]').find('a').each(function() {
        var artist_name = $(this).text();
        // trim whitespace and add to list of artists
        artists.push($.trim(artist_name));
    });
    return artists;
}

function saveArtistList(all_songs_array) {
    jsonfile.spaces = 4;
    var file_name = path.join(__dirname, '../collections/songUrls/songUrls'+file_number+'.js');
    // save the object as json to a file
    jsonfile.writeFileSync(file_name, all_songs_array);
}


getSongData();







