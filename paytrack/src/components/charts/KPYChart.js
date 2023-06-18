import React from 'react'
import { Typography } from '@mui/material';

class KPYChart extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Typography variant='h2'>
                    <strong>{this.props.bucketCount}</strong>
                </Typography>
                <Typography variant='h6'>{this.props.bucketName}</Typography>
            </div>
        )
    }
}

export default KPYChart