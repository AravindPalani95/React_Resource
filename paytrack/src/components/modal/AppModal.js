import { Box, Modal } from '@mui/material';
import React from 'react'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

class AppModal extends React.Component {

    constructor(props){
        super(props)
    }

    handleClose(){
        return !this.props.open
    }

    render() {
        return (
            <div>
                <Modal
                    open={this.props.open}
                    onClose={this.props.handler}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                       {
                        this.props.children
                       }
                    </Box>
                </Modal>
            </div>
        )
    }
}

export default AppModal