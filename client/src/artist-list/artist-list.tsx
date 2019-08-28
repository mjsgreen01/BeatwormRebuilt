import React from 'react';

// List artist names with links to individual artist pages
//TODO: add link to artist page
const ArtistList = (props) => {
    const {
        artists,
    } = props;

    return (
        <div className="artist-list">
            {artists.map(artist => (
                <div className="artist-list__artist">
                    {artist.name}
                </div>
            ))}
        </div>
    );
};

export { ArtistList };
