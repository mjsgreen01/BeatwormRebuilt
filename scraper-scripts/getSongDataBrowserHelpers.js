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
    let elem = $('[class*=primary_info-title]');
    window.browserHelpers.logDataNotFound(elem && elem.text(), 'song title ', song_url);
    return elem.text();
}


window.browserHelpers.isNumeric = function (num) {
    return !isNaN(num)
}


/**
 * If a section has `plus x more`, click to expand the additional info.
 * @param links: Array<elem> - array of anchor elements
 * @return boolean: true if expanded section, false if not
 */
window.browserHelpers.expandSection = function (links) {
    let more_link = links.filter('.metadata_unit-show_more');

    if (more_link && more_link.length) {
        // Stop propogation because it causes problems from some genius script
        more_link.click(function( event ) {
            event.stopPropagation();
        });
        more_link.click();
        return true;
    }
}


window.browserHelpers.getFeatured = function (song_url) {

    var artists = [];
    let elem = $('[class*=metadata_unit]')
        .filter(function() {
        return $(this).children('.metadata_unit-label').text().trim() === 'Featuring';
    });
    // console.log('elem ', elem.html());
    window.browserHelpers.logDataNotFound(elem, 'featuring section ', song_url);

    //  if last link has `x more`, click to expand,
    //      then re-scrape list
    let links = elem.find('a');
    if (window.browserHelpers.expandSection(links)) {
        links = elem.find('a');
    };

    // add each featured artist one at a time
    links.each(function() {
        let elem = $(this);
        window.browserHelpers.logDataNotFound(elem && elem.text(), 'featuring ', song_url);
        // trim whitespace and add to list of artists
        artists.push(elem.text().trim());
    });
    return artists;
}


window.browserHelpers.getProducers = function (song_url) {
    var artists = [];
    // Find the producers section
    let elem = $('[class*=metadata_unit]')
        .filter(function() {
            return $(this).children('.metadata_unit-label').text().trim() === 'Produced by';
        });

    window.browserHelpers.logDataNotFound(elem, 'producers section ', song_url);

    //  if last link has `x more`, click to expand,
    //      then re-scrape list
    let links = elem.find('a');
    if (window.browserHelpers.expandSection(links)) {
        links = elem.find('a');
    };

    // add each prod one at a time
    links.each(function() {
        let elem = $(this);
        window.browserHelpers.logDataNotFound(elem && elem.text(), 'producer ', song_url);
        // trim whitespace and add to list of artists
        artists.push(elem.text().trim());
    });
    return artists;
}


window.browserHelpers.getAlbum = function (song_url) {
    let elem = $('[class*=metadata_unit]')
        .filter(function() {
            return $(this).children('.metadata_unit-label').text().trim() === 'Album';
        });
    elem = elem.find('a');
    window.browserHelpers.logDataNotFound(elem && elem.text(), 'album title ', song_url);
    return elem.text();
}


window.browserHelpers.getAudioLink = function (song_url) {
    let elem = $('.song_media_controls-provider')
        .find('a');
    window.browserHelpers.logDataNotFound(elem && elem.attr('href'), 'song link ', song_url);
    return elem.attr('href');
}
