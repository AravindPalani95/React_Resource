import React, { Component } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Box,
  Typography,
  Alert,
} from '@mui/material';

class CreateBucket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bucketName: '',
      bucketDescription: '',
      tagInput: '',
      tags: [],
      severity: '',
      bucketType: '',
      validationErrors: [],
      saveStatus: '',
    };
  }

  handleTagChange = (event) => {
    this.setState({ tagInput: event.target.value });
  };

  handleTagKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  };

  addTag = () => {
    const { tagInput, tags } = this.state;

    if (tagInput.trim() !== '') {
      const trimmedTag = tagInput.trim();

      if (!tags.includes(trimmedTag)) {
        this.setState({
          tagInput: '',
          tags: [...tags, trimmedTag],
        });
      }
    }
  };

  handleDeleteTag = (tag) => {
    const { tags } = this.state;
    const updatedTags = tags.filter((t) => t !== tag);
    this.setState({ tags: updatedTags });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { bucketName, bucketDescription, tags, severity, bucketType } = this.state;

    const validationErrors = [];

    if (!bucketName) {
      validationErrors.push('Bucket Name is required.');
    }

    if (!bucketDescription) {
      validationErrors.push('Bucket Description is required.');
    }

    if (tags.length === 0) {
      validationErrors.push('At least one tag is required.');
    }

    if (!severity) {
      validationErrors.push('Severity is required.');
    }

    if (!bucketType) {
      validationErrors.push('Bucket Type is required.');
    }

    if (validationErrors.length > 0) {
      this.setState({ validationErrors });
      return;
    }

    try {
      // Perform API call to save data
      // Example API call using fetch:
      const response = await fetch('your-api-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketName,
          bucketDescription,
          tags,
          severity,
          bucketType,
        }),
      });

      if (response.ok) {
        // Data saved successfully
        this.setState({ saveStatus: 'success' });
      } else {
        // Error occurred while saving data
        this.setState({ saveStatus: 'error' });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      this.setState({ saveStatus: 'error' });
    }
  };

  clearForm = () => {
    this.setState({
      bucketName: '',
      bucketDescription: '',
      tagInput: '',
      tags: [],
      severity: '',
      bucketType: '',
      validationErrors: [],
      saveStatus: '',
    });
  };

  render() {
    const {
      bucketName,
      bucketDescription,
      tagInput,
      tags,
      severity,
      bucketType,
      validationErrors,
      saveStatus,
    } = this.state;

    return (
      <Grid container justify="center" spacing={2} style={{ marginLeft: '10px' }}>
        <Grid item xs={12} sm={6}>
          <Box mt={5} mb={2} p={3} border={1} borderRadius={4}>
            <Typography variant="h6" component="h2" align="left" gutterBottom>
              CREATE BUCKET
            </Typography>
            <form onSubmit={this.handleSubmit}>
              <TextField
                label="Bucket Name"
                value={bucketName}
                onChange={(e) => this.setState({ bucketName: e.target.value })}
                required
                fullWidth
                style={{ marginBottom: '20px' }}
              />
              <TextField
                label="Bucket Description"
                value={bucketDescription}
                onChange={(e) => this.setState({ bucketDescription: e.target.value })}
                required
                fullWidth
                multiline
                rows={4}
                style={{ marginBottom: '20px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <TextField
                  label="Tags"
                  value={tagInput}
                  onChange={this.handleTagChange}
                  onKeyPress={this.handleTagKeyPress}
                  fullWidth
                  variant="outlined"
                  style={{ flexGrow: 1, marginRight: '10px' }}
                />
                <Button variant="outlined" color="primary" onClick={this.addTag}>
                  Add
                </Button>
              </div>
              <div>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => this.handleDeleteTag(tag)}
                    style={{ marginRight: '5px', marginBottom: '5px' }}
                  />
                ))}
              </div>
              <FormControl fullWidth required style={{ marginBottom: '20px' }}>
                <InputLabel>Severity</InputLabel>
                <Select value={severity} onChange={(e) => this.setState({ severity: e.target.value })}>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth required style={{ marginBottom: '20px' }}>
                <InputLabel>Bucket Type</InputLabel>
                <Select value={bucketType} onChange={(e) => this.setState({ bucketType: e.target.value })}>
                  <MenuItem value="FAILURE">Failure</MenuItem>
                  <MenuItem value="SUCCESS">Success</MenuItem>
                </Select>
              </FormControl>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button type="submit" color="primary" variant="contained" style={{ marginRight: '10px' }}>
                  Save
                </Button>
                <Button type="button" onClick={this.clearForm} color="primary" variant="contained">
                  Clear
                </Button>
              </Box>
              {validationErrors.map((error) => (
                <Alert key={error} severity="error" style={{ marginTop: '10px' }}>
                  {error}
                </Alert>
              ))}
              {saveStatus === 'success' && (
                <Alert severity="success" style={{ marginTop: '10px' }}>
                  Data saved successfully!
                </Alert>
              )}
              {saveStatus === 'error' && (
                <Alert severity="error" style={{ marginTop: '10px' }}>
                  Error occurred while saving data. Please try again.
                </Alert>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default CreateBucket;
