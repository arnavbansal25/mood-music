import React from 'react';
import { shazamIcon, appleIcon } from '../assets/index';

function SongCard(props) {

    const { song } = props;

    const min = Math.floor((song.duration_ms / 1000) / 60);
    const sec = Math.floor((song.duration_ms / 1000) % 60);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', backgroundColor: 'black', borderRadius: '10px', paddingTop: '10px', height: '400px' }}>
            <div>
                <img src={song.track.share.image} width="90%" style={{ borderRadius: '10px' }} />
            </div>
            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                {song.track.share.subject}
            </div>

            <div>
                <audio controls style={{ width: '90%', height: '30px' }}>
                    <source src={song.track.hub.actions[1].uri} />
                </audio>
            </div>

            <div>
                <a href={song.track.share.href} target="_black" style={{marginRight: '20px'}}>
                    <img src={shazamIcon} width='30px' height='30px' />
                </a>
                <a href={song.track.hub.options[0].actions[0].uri} target="_black">
                    <img src={appleIcon} width='30px' height='30px' />
                </a>
            </div>
        </div>
    )
}

export default SongCard;