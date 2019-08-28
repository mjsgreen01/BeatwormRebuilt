import React from 'react';

// List songs that an Artist produced
const ArtistCollab = (props) => {
    const {
        artist,
        collabs,
    } = props;

    return (
        <div className="artist-collab">
            <h2>{artist.name}</h2>
            {collabs.map(collab => (
                <div className="artist-collab__song-title">
                    {collab.songTitle}
                </div>
            ))}
        </div>
    );
};

export { ArtistCollab };
