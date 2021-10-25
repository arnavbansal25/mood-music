import React from 'react';

function SongCard(props) {

    const { song } = props;

    return (
        <div>
            acd{song.uri}
        </div>
    )
}

export default SongCard;