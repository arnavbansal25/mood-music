import React from 'react';
import spotify from './spotify.png';
import shazam from './shazam.png'

function SongCard(props) {

    const { song } = props;
    // console.log("epp", song);

    const min = Math.floor((song.duration_ms / 1000) / 60);
    const sec = Math.floor((song.duration_ms / 1000) % 60);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', backgroundColor: 'black', borderRadius: '10px', paddingTop: '10px', height: '400px' }}>
            {/* USNA JSON Object */}
            {/* <div>
                <img src={song.album.images[0].url} width="90%" style={{ borderRadius: '10px' }} />
            </div>
            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {song.album.name}
            </div>
            <div>
                Duration: {min} min {sec} seconds
            </div>
            <div>
                <audio controls style={{ width: '90%', height: '30px' }}>
                    <source src={song.preview_url} />
                </audio>
            </div>
            <div>
                Artist: {song.artists[0].name}
            </div>
            <div>
                <a href={song.external_urls.spotify} target="_black">
                    <img src={spotify} width='30px' height='30px' />
                </a>
            </div> */}

            {/* Shazam JSON Object */}
            <div>
                <img src={song.track.share.image} width="90%" style={{ borderRadius: '10px' }} />
            </div>
            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {song.track.share.subject}
            </div>
            {/* <div>
                Duration: {min} min {sec} seconds
            </div> */}
            <div>
                <audio controls style={{ width: '90%', height: '30px' }}>
                    <source src={song.track.hub.actions[1].uri} />
                </audio>
            </div>
            {/* <div>
                Artist: {song.artists[0].name}
            </div> */}
            <div>
                <a href={song.track.share.href} target="_black">
                    <img src={shazam} width='30px' height='30px' />
                </a>
            </div>
        </div>
    )
}

export default SongCard;