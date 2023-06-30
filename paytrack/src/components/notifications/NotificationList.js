import React from 'react';
import { List, FormControlLabel, Radio, Divider, Tooltip } from '@mui/material';

const NotificationList = ({
  notifications,
  selectedNotification,
  onNotificationClick,
}) => {
  return (
    <div>
      <List component="div">
        {notifications.map((notification) => (
          <React.Fragment key={notification.bucketEmailTemplateID}>
            <Divider />
            <Tooltip
              title={
                <>
                  <div>
                    <strong>Bucket Name:</strong> {' ' + notification.bucketName}
                  </div>
                  {notification.emailTemplateName ? (
                    <div>
                      <strong>Notification Name:</strong>{' ' + notification.emailTemplateName}
                    </div>) : <></>
                  }
                </>
              }
            >
              <FormControlLabel
                value={notification.bucketEmailTemplateID}
                control={<Radio />}
                label={
                  notification.emailTemplateName ? (notification.bucketName + ' - ' + notification.emailTemplateName) : notification.bucketName
                }
                checked={selectedNotification && selectedNotification.bucketEmailTemplateID === notification.bucketEmailTemplateID}
                onClick={() => onNotificationClick(notification)}
              />
            </Tooltip>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default NotificationList;
