import React from 'react';
import { Button, Modal, Typography, Box, Paper, Grid } from '@mui/material';
import Face from './Face';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '640px',
    bgcolor: 'black',
    borderRadius: 5,
    p: 2,
};

function WebcamModal(props) {

    const { webcamModal, setEmotion, closeWebcamModal } = props;

    const handleClose = () => {

        closeWebcamModal();
    }

    return (
        <>
            <Modal
                open={webcamModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                        <Face cameraOpen={webcamModal} />
                    </div>
                </Box>
            </Modal>

        </>
    )
}

export default WebcamModal;