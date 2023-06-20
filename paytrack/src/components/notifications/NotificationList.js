import React from 'react';
import { List, FormControlLabel, Radio, Divider } from '@mui/material';

const NotificationList = ({
  notifications,
  selectedNotification,
  onNotificationClick,
}) => {
  return (
    <List component="div">
      {notifications.map((notification) => (
        <React.Fragment key={notification.id}>
          <Divider />
          <FormControlLabel
            value={notification.id.toString()}
            control={<Radio />}
            label={notification.name}
            checked={selectedNotification && selectedNotification.id === notification.id}
            onClick={() => onNotificationClick(notification)}
          />
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationList;
