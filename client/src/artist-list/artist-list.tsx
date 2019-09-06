import React from 'react';


// List artist names with links to individual artist pages
//TODO: add link to artist page

class ArtistList extends React.Component {

    componentDidMount() {
        const {
            getArtists,
        } = props;

        //Load list of artists
        getArtists();
    }

    render() {
        const {
            artists,
        } = this.props;

        return (
            <div className="artist-list">
                {artists.map(artist => (
                    <div className="artist-list__artist">
                        {artist.name}
                    </div>
                ))}
            </div>
        )
    }
}

export { ArtistList };
