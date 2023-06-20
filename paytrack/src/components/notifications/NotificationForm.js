import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Checkbox,
  ListItemText,
  FormHelperText,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import NotificationList from './NotificationList';

const errorMessagesOptions = [
  'Error 1',
  'Error 2',
  'Error 3',
  'Error 4',
  'Error 5',
];

const NotificationForm = () => {
  const [notificationName, setNotificationName] = useState('');
  const [bucket, setBucket] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, name: 'Notification 1', bucket: 'Bucket 1', message: 'Message 1', errorMessages: ['Error 1', 'Error 2'] },
    { id: 2, name: 'Notification 2', bucket: 'Bucket 2', message: 'Message 2', errorMessages: ['Error 3', 'Error 4'] },
    { id: 3, name: 'Notification 3', bucket: 'Bucket 3', message: 'Message 3', errorMessages: ['Error 1', 'Error 5'] },
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSave = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      if (isUpdateMode) {
        // Update existing notification
        const updatedNotification = {
          id: selectedNotification.id,
          name: notificationName,
          bucket,
          message: notificationMessage,
          errorMessages,
        };

        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === updatedNotification.id
              ? updatedNotification
              : notification
          )
        );

        setSuccessMessage('Notification updated successfully.');
      } else {
        // Save new notification
        const newNotification = {
          id: notifications.length + 1,
          name: notificationName,
          bucket,
          message: notificationMessage,
          errorMessages,
        };

        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);

        setSuccessMessage('Notification saved successfully.');
      }

      // Reset form fields
      setNotificationName('');
      setBucket('');
      setNotificationMessage('');
      setErrorMessages([]);
      setErrors({});
      setSelectedNotification(null);
      setIsUpdateMode(false);

      // Show success message
      setSnackbarOpen(true);
    } else {
      // Form has errors, update the state to display the errors
      setErrors(validationErrors);
    }
  };

  const handleClear = () => {
    // Handle clearing the form data here
    setNotificationName('');
    setBucket('');
    setNotificationMessage('');
    setErrorMessages([]);
    setErrors({});
    setSelectedNotification(null);
    setIsUpdateMode(false);
  };

  const handleNotificationClick = (notification) => {
    setNotificationName(notification.name);
    setBucket(notification.bucket);
    setNotificationMessage(notification.message);
    setErrorMessages(notification.errorMessages);
    setSelectedNotification(notification);
    setIsUpdateMode(true);
    setSuccessMessage('');
  };

  const handleNotificationNameChange = (event) => {
    setNotificationName(event.target.value);
  };

  const handleBucketChange = (event) => {
    setBucket(event.target.value);
  };

  const handleNotificationMessageChange = (event) => {
    setNotificationMessage(event.target.value);
  };

  const handleErrorMessagesChange = (event) => {
    setErrorMessages(event.target.value);
  };

  const validateForm = () => {
    let errors = {};

    if (!notificationName.trim()) {
      errors.notificationName = 'Notification Name is required';
    }

    if (!bucket.trim()) {
      errors.bucket = 'Bucket is required';
    }

    if (!notificationMessage.trim()) {
      errors.notificationMessage = 'Notification Message is required';
    }

    if (errorMessages.length === 0) {
      errors.errorMessages = 'At least one Error Message must be selected';
    }

    return errors;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:'2rem', marginLeft:'2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', outline: '1px solid #ccc', padding: '1rem', width: '500px' }}>
        <Typography variant="h6" gutterBottom>
          CREATE NOTIFICATIONS
        </Typography>
        <Grid container spacing={2}>
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
            <FormControl fullWidth error={!!errors.bucket}>
              <InputLabel id="bucket-label">Buckets</InputLabel>
              <Select
                labelId="bucket-label"
                value={bucket}
                onChange={handleBucketChange}
              >
                <MenuItem value="bucket1">Bucket 1</MenuItem>
                <MenuItem value="bucket2">Bucket 2</MenuItem>
                <MenuItem value="bucket3">Bucket 3</MenuItem>
              </Select>
              {errors.bucket && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>
                  {errors.bucket}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.errorMessages}>
              <InputLabel id="error-messages-label">
                Error Messages
              </InputLabel>
              <Select
                labelId="error-messages-label"
                multiple
                value={errorMessages}
                onChange={handleErrorMessagesChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {errorMessagesOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={errorMessages.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
              {errors.errorMessages && (
                <FormHelperText>{errors.errorMessages}</FormHelperText>
              )}
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
                {isUpdateMode ? 'Update' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', outline: '1px solid #ccc', padding: '1rem', width: '500px', marginLeft:'2rem' }}>
        <Typography variant="h6" gutterBottom>
          NOTIFICATIONS LIST
        </Typography>
        <NotificationList
          notifications={notifications}
          selectedNotification={selectedNotification}
          onNotificationClick={handleNotificationClick}
        />
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationForm;
