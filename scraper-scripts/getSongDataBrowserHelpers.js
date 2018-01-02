/**
 *
 * Methods for executing in the browser context using nightmare.js/cheerio
 * This file gets injected on page-load
 * Methods are attached to the window object making them available
 *  from within the `evaluate` function of our other scripts
 *
 */

window.browserHelpers = {};

/**
 * Log message if data is not found
 * @param exists: boolean
 * @param type: string - indicates which piece of data is missing
 * @param url: string - url of the page being scraped
 */
window.browserHelpers.logDataNotFound = function (exists, type, url) {
    if (!exists) {
        console.log('data not found ', type, ' ', url);
    }
}

window.browserHelpers.getArtist = function (song_url) {
    let elem = $('[class*=primary_info-primary_artist]');
    window.browserHelpers.logDataNotFound(elem && elem.text(), 'artist ', song_url);
    return elem.text();
}


window.browserHelpers.getSongTitle = function (song_url) {

    // TODO: remove backslashes before apostrophes? or leave for migration? will removing `\` cause problems with quotes closing?

    let elem = $('[class*=primary_info-title]');
    window.browserHelpers.logDataNotFound(elem && elem.text(), 'song title ', song_url);
    return elem.text();
}


window.browserHelpers.getFeatured = function (song_url) {

    var artists = [];
    let elem = $('[class*=metadata_unit]')
        .filter(function() {
        return $(this).children('.metadata_unit-label').text().trim() === 'Featuring';
    });
    // console.log('elem ', elem.html());
    window.browserHelpers.logDataNotFound(elem, 'featuring section ', song_url);

    // add each featured artist one at a time
    elem.find('a').each(function() {
        let elem = $(this);
        window.browserHelpers.logDataNotFound(elem && elem.text(), 'featuring ', song_url);
        // trim whitespace and add to list of artists
        artists.push(elem.text().trim());
    });
    return artists;
}


window.browserHelpers.getProducers = function (song_url) {

    //TODO: handle case where need to click to show `x more producers`

    //TODO: combine 'additional producers' into this sectio

    var artists = [];
    let elem = $('[class*=metadata_unit]')
        .filter(function() {
            return $(this).children('.metadata_unit-label').text().trim() === 'Produced by';
        });

    window.browserHelpers.logDataNotFound(elem, 'producers section ', song_url);

    // add each prod one at a time
    elem.find('a').each(function() {
        let elem = $(this);
        window.browserHelpers.logDataNotFound(elem && elem.text(), 'producer ', song_url);
        // trim whitespace and add to list of artists
        artists.push(elem.text().trim());
    });
    return artists;
}


window.browserHelpers.getAlbum = function (song_url) {
    let elem = $('song-primary-album a');
    window.browserHelpers.logDataNotFound(elem && elem.text(), 'album title ', song_url);
    return elem.text();
}


window.browserHelpers.getAudioLink = function (song_url) {
    let elem = $('.song_media_controls-selector-icon').find('a');

    window.browserHelpers.logDataNotFound(elem && elem.attr('href'), 'song link ', song_url);
    return elem.attr('href');
}


window.browserHelpers.getTags = function (song_url) {
    var tags = [];
    $('.metadata_unit-tags').find('a').each(function() {
        var tag = $(this).text();
        // trim whitespace and add to list of tags
        tags.push($.trim(tag));
    });
    return tags;
}

