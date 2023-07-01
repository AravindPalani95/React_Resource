import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Box,
  Breadcrumbs,
  FormHelperText,
} from '@mui/material';
import NotificationList from './NotificationList';
import axios from 'axios';

const NotificationForm = () => {
  const [notificationName, setNotificationName] = useState('');
  const [bucket, setBucket] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sendEmail, setSendEmail] = useState('');
  const [useMessage, setUseMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Update notification
      const updateNotification = {
        bucketEmailTemplateID: selectedNotification.bucketEmailTemplateID,
        emailTemplateName: notificationName,
        bucketName: bucket,
        emailTemplateReasons: notificationMessage,
        sendEmail: sendEmail,
        useTemplateReasons: useMessage
      };

      axios.put(`/bucketEmailTemplates/${selectedNotification.bucketEmailTemplateID}`, updateNotification)
        .then(response => {
          if (response.status === 200) {
            openAlert('Notification Updated Successfully.', true)
            fetchNotifications()
          }
          else {
            openAlert('Notification Updated Failed.', false)
          }
        })

    } else {
      setErrors(validationErrors);
    }
  };

  const openAlert = (msg, isSuccess) => {
    setAlertOpen(true)
    setAlertMsg(msg);
    setIsSuccess(isSuccess)
    setTimeout(() => {
      setAlertOpen(false)
      setAlertMsg('')
      setIsSuccess(isSuccess)
    }, 3000)
  }

  const handleClear = () => {
    // Handle clearing the form data here
    setNotificationName('');
    setNotificationMessage('');
    setErrors({});
  };

  const handleNotificationClick = (notification) => {
    setNotificationName(notification.emailTemplateName ? notification.emailTemplateName : '');
    setBucket(notification.bucketName);
    setNotificationMessage(notification.emailTemplateReasons ? notification.emailTemplateReasons : '');
    setSendEmail(notification.sendEmail)
    setUseMessage(notification.useTemplateReasons)
    setSelectedNotification(notification);
    setErrors({});
  };

  const handleNotificationNameChange = (event) => {
    setNotificationName(event.target.value);
  };

  const handleNotificationMessageChange = (event) => {
    setNotificationMessage(event.target.value);
  };

  const handleSendEmailChange = (event) => {
    setSendEmail(event.target.value);
  };

  const handleUseMessageChange = (event) => {
    setUseMessage(event.target.value);
  };

  const validateForm = () => {
    let errors = {};

    if (!notificationName.trim()) {
      errors.notificationName = 'Notification Name is required';
    }

    if (!bucket.trim()) {
      errors.bucket = 'Bucket Name is required';
    }

    if (!notificationMessage.trim()) {
      errors.notificationMessage = 'Notification Message is required';
    }

    if (!sendEmail.trim()) {
      errors.notificationMessage = 'Send Email is required';
    }

    if (!useMessage.trim()) {
      errors.notificationMessage = 'Use Message is required';
    }

    return errors;
  };

  // Fetch notifications from the API and update the notifications state
  const fetchNotifications = () => {
    axios.get('/bucketEmailTemplates')
      .then(response => {
        let data = response.data
        setNotifications(data['_embedded']['bucketEmailTemplates'])
        if (data['_embedded']['bucketEmailTemplates'].length > 0) {
          let firstNotification = data['_embedded']['bucketEmailTemplates'][0]
          if (selectedNotification) {
            let sNotification = data['_embedded']['bucketEmailTemplates'].find(e =>
              e.bucketEmailTemplateID === selectedNotification.bucketEmailTemplateID)
            setSelectedNotification(sNotification)
            handleNotificationClick(sNotification)
          }
          else {
            setSelectedNotification(firstNotification)
            handleNotificationClick(firstNotification)
          }
        }
      })
  };

  useEffect(() => {
    // call fetchNotifications()
    fetchNotifications();
  }, []);

  return (
    <div>
      <Box sx={{ flexGrow: 1, mt: 2, ml: 2, mr: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Typography>MENU</Typography>
                <Typography color="textPrimary">NOTIFICATIONS</Typography>
              </Breadcrumbs>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', ml: 2, mt: 2, mr: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box border={1}
              sx={{
                outline: '1px solid #1565c0',
                padding: '16px',
                height: '550px',
                maxHeight: '520px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#F5F5F5' },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555555' },
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                LIST NOTIFICATIONS
              </Typography>
              <NotificationList
                notifications={notifications}
                selectedNotification={selectedNotification}
                onNotificationClick={handleNotificationClick}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box border={1}
              sx={{
                outline: '1px solid #1565c0',
                padding: '16px',
                height: '550px',
                maxHeight: '520px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#F5F5F5' },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555555' },
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                UPDATE NOTIFICATIONS
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {
                  alertOpen ?
                    (<Grid item xs={12}>
                      <Alert variant="filled" severity={isSuccess ? 'success' : 'error'}>
                        {alertMsg}
                      </Alert>
                    </Grid>) : <></>
                }
                <Grid item xs={12}>
                  <TextField
                    label="Notification Name"
                    fullWidth
                    value={notificationName}
                    onChange={handleNotificationNameChange}
                    error={!!errors.notificationName}
                    helperText={errors.notificationName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bucket Name"
                    fullWidth
                    value={bucket}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="send-email-label">Send Email</InputLabel>
                    <Select
                      labelId="send-email-label"
                      value={sendEmail}
                      onChange={handleSendEmailChange}
                      label="sendEmail"
                    >
                      <MenuItem value="Yes">YES</MenuItem>
                      <MenuItem value="No">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="use-message-label">Use Notification Message</InputLabel>
                    <Select
                      labelId="use-message-label"
                      value={useMessage}
                      onChange={handleUseMessageChange}
                      label="useNotificationMessage"
                    >
                      <MenuItem value="Yes">YES</MenuItem>
                      <MenuItem value="No">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Notification Message"
                    fullWidth
                    multiline
                    rows={4}
                    value={notificationMessage}
                    onChange={handleNotificationMessageChange}
                    error={!!errors.notificationMessage}
                    helperText={errors.notificationMessage}
                  />
                  <FormHelperText>
                    <Typography variant="body2" color="secondary" style={{ fontSize: '13px', marginTop: '8px' }}>
                      Please Enter Possible Reasons Separated By Comma in the Notification Message
                    </Typography>
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="flex-end">
                    <Button variant="outlined" color="primary" onClick={handleClear}>
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      style={{ marginLeft: '1rem' }}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default NotificationForm;
