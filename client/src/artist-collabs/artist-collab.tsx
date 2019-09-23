import React from 'react';

interface ArtistCollabProps {
    artist: any;
    collabs: any[];
};

// List songs that an Artist produced
const ArtistCollab = (props: ArtistCollabProps) => {
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
