import React from 'react'
import { Typography } from '@mui/material';

class KPYChart extends React.Component {
    render() {
        return (
            <div>
                <Typography variant='h2'>
                    <strong>{this.props.bucketCount}</strong>
                </Typography>
                <Typography variant='h6' sx={{whiteSpace: 'nowrap'}}>{this.props.bucketName}</Typography>
            </div>
        )
    }
}

export default KPYChart