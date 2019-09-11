import React from 'react';


// List artist names with links to individual artist pages
//TODO: add link to artist page

interface ArtistListProps {
    artists: Array<any>;
    getArtists: ()=>{};
}

class ArtistList extends React.Component<ArtistListProps> {

    componentDidMount() {
        const {
            getArtists,
        } = this.props;

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

const mapStateToProps = function(state) {
    return {

    }
}

export const ArtistListConnected = connect(mapStateToProps)(ArtistList);