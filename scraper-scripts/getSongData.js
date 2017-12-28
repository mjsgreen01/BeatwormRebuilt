
var Nightmare = require('nightmare'),
    _ = require('underscore'),
    $ = require('cheerio'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    path = require('path'),
    nightmare = Nightmare();

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

    var file_name = path.join(__dirname, '../collections/albumUrls/albumUrls'+file_number+'.js'),
    song_urls;

    try {
        // get the json object of album page urls
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
    return nightmare.goto(song_url)
        .evaluate(function () {
            // scrape song data
            var song_data = buildSongObject(song_url);
            
            return song_data;
        })
        .then(function(song_data) {
            // console.log('songs data: ',song_data);
            // add the song from this page to the global list
            all_songs_array = all_songs_array.push(song_data);

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
    data.artist = getArtist(song_url);
    data.songTitle = getSongTitle(song_url);
    data.featuredArtists = getFeatured(song_url);
    data.producers = getProducers(song_url);
    data.album = getAlbum(song_url);
    data.audioLink = getAudioLink(song_url);
    data.tags = getTags(song_url);

    return data;
}

/**
 * Log message if data is not found
 * @param exists: boolean
 * @param type: string - indicates which piece of data is missing
 * @param url: string - url of the page being scraped
 */
function logDataNotFound(exists, type, url) {
    if (!exists) {
        console.log('data not found ', type, ' ', url);
    }
}

function getArtist (song_url) {
    let artist = $('[class*=primary_info-primary_artist]');
    logDataNotFound(artist && artist.text(), 'artist', song_url);
    return artist.text();
}

function getSongTitle (song_url) {
    return $('.song_header-primary_info-title').text();
}

function getFeatured (song_url) {
    var artists = [];
    $('[label="Featuring"]').find('a').each(function() {
        var artist_name = $(this).text();
        // trim whitespace and add to list of artists
        artists.push($.trim(artist_name));
    });
    return artists;
}

function getProducers (song_url) {
    
    //TODO: handle case where need to click to show `x more producers`

    var artists = [];
    $('[label="Produced By"]').find('a').each(function() {
        var artist_name = $(this).text();
        // trim whitespace and add to list of artists
        artists.push($.trim(artist_name));
    });
    return artists;
}

function getAlbum (song_url) {
    return $('song-primary-album a').text();
}

function getAudioLink (song_url) {
    return $('.song_media_controls-selector-icon').find('a').attr('href');
}

function getTags (song_url) {
    var tags = [];
    $('.metadata_unit-tags').find('a').each(function() {
        var tag = $(this).text();
        // trim whitespace and add to list of tags
        tags.push($.trim(tag));
    });
    return tags;
}

function getAdditionalProducers (song_url) {
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







