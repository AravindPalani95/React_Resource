import React from 'react'
import NotificationForm from './NotificationForm';
import { Grid } from '@mui/material';

class Notifications extends React.Component{
    render(){
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Grid container spacing={2}>
                <NotificationForm/>
              </Grid>
            </div>
          );
          
    }
}

export default Notifications