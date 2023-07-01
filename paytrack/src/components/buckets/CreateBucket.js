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
  Breadcrumbs,
} from '@mui/material';
import ListBuckets from './ListBuckets';
import axios from 'axios';

class CreateBucket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bucketName: '',
      bucketDescription: '',
      tagInput: '',
      tags: [],
      severity: '',
      validationErrors: [],
      saveStatus: '',
      selectedBucket: null,
      buckets: [],
      isUpdateMode: false,
    };
  }

  componentDidMount() {
    this.loadAllBuckets()
  }

  loadAllBuckets(callback) {
    axios.get('/bucketsData').then(response => {
      let data = response.data
      this.setState({
        buckets: data['_embedded']['bucketsData']
      }, () => {
        if (callback) {
          callback(); // Call the callback function after loading all reports
        }
      })
    })
      .catch(err => console.error(err))
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

    const { bucketName, bucketDescription, tags, severity, isUpdateMode } = this.state;

    const validationErrors = [];

    if (!bucketName) {
      validationErrors.push('Bucket Name Is Required.');
    }

    if (!bucketDescription) {
      validationErrors.push('Bucket Description Is Required.');
    }

    if (tags.length === 0) {
      validationErrors.push('Atleast One Tag is Required.');
    }

    if (!severity) {
      validationErrors.push('Severity Is Required.');
    }

    if (validationErrors.length > 0) {
      this.setState({ validationErrors });
      return;
    }

    const bucketData = {
      bucketName: bucketName.trim(),
      bucketDescription: bucketDescription,
      tags: tags.join(),
      severity: severity
    };

    if (isUpdateMode) {
      this.updateReport(bucketData, bucketName)
    }
    else {
      this.createBucket(bucketData, () => {
        // Callback function to handle report creation
        this.loadAllBuckets(() => {
          // Callback function to handle loading all reports
          const createdBucket = this.state.buckets.find(bucket => bucket.bucketName === bucketName);
          if (createdBucket) {
            this.handleBucketSelect(createdBucket);
          }
        });
      })
    }
  };

  createBucket(bucketData, callback) {
    axios.post('/bucketsData/addBucket', bucketData)
      .then(response => {
        this.showAlert('Bucket Created Successfully.', true)
        callback()
      })
      .catch(err => {
        console.error(err)
        this.showAlert('Bucket Creation Failed.', false)
      })
  }

  updateReport(bucketData, bucketName) {
    console.log(JSON.stringify(bucketData))
    axios.put(`/bucketsData/${bucketName}`, bucketData)
      .then(response => {
        this.loadAllBuckets()
        this.showAlert('Bucket Updated Successfully.', true)
      })
      .catch(err => {
        console.error(err)
        this.showAlert('Bucket Update Failed.', false)
      })
  }

  clearForm = () => {
    this.setState({
      bucketName: '',
      bucketDescription: '',
      tagInput: '',
      tags: [],
      severity: '',
      validationErrors: [],
      saveStatus: '',
      selectedBucket: null,
      isUpdateMode: false,
    });
  };

  handleBucketSelect = (bucket) => {
    this.setState({
      bucketName: bucket.bucketName,
      bucketDescription: bucket.bucketDescription ? bucket.bucketDescription : '',
      tags: (bucket.tags && bucket.tags.trim()) !== '' ? bucket.tags.split(',') : [],
      severity: bucket.severity,
      selectedBucket: bucket,
      isUpdateMode: true
    });
  };

  showAlert(msg, successFlag) {
    this.setState({
      alertOpen: true,
      alertMsg: msg,
      isSuccess: successFlag
    })
    setTimeout(() => {
      this.setState({
        alertOpen: false,
        alertMsg: '',
        isSuccess: successFlag
      })
    }, 3000)
  }

  render() {
    const {
      bucketName,
      bucketDescription,
      tagInput,
      tags,
      severity,
      validationErrors,
      saveStatus,
      buckets,
      selectedBucket,
      alertOpen,
      alertMsg,
      isSuccess,
      isUpdateMode
    } = this.state;

    return (
      <div>
        <Box sx={{ flexGrow: 1, mt: 2, ml: 2, mr: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography>MENU</Typography>
                  <Typography color="textPrimary">BUCKET</Typography>
                </Breadcrumbs>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box border={1} padding={3} ml={2} mt={2}
                sx={{
                  outline: '1px solid #1565c0',
                  height: '550px',
                  maxHeight: '550px',
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
                <Typography variant="h6" component="h2" align="left" gutterBottom color="primary">
                  {isUpdateMode ? 'UPDATE BUCKET' : 'CREATE BUCKET'}
                </Typography>
                {
                  alertOpen ?
                    (<Grid item xs={12} sx={{ mb: 2 }}>
                      <Alert variant="filled" severity={isSuccess ? 'success' : 'error'}>
                        {alertMsg}
                      </Alert>
                    </Grid>) : <></>
                }
                <form onSubmit={this.handleSubmit}>
                  <TextField
                    label="Bucket Name"
                    value={bucketName}
                    onChange={(e) => this.setState({ bucketName: e.target.value })}
                    required
                    fullWidth
                    style={{ marginBottom: '20px', marginTop: '20px' }}
                    disabled={isUpdateMode}
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
                    inputProps={{ maxLength: 1000 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <TextField
                      label="Tags *"
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
                  <FormControl fullWidth required style={{ marginBottom: '20px', marginTop: '10px' }}>
                    <InputLabel>Severity</InputLabel>
                    <Select value={severity} onChange={(e) => this.setState({ severity: e.target.value })} label="severity">
                      <MenuItem value="High">HIGH</MenuItem>
                      <MenuItem value="Medium">MEDIUM</MenuItem>
                      <MenuItem value="Low">LOW</MenuItem>
                    </Select>
                  </FormControl>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button type="submit" color="primary" variant="contained" style={{ marginRight: '10px' }}>
                      {isUpdateMode ? 'UPDATE' : 'CREATE'}
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
            <Grid item xs={12} sm={6}>
              <Box border={1} sx={{
                outline: '1px solid #1565c0', padding: '16px', flex: '1 1 50%', marginBottom: '16px',
                mr: 2,
                mt: 2,
                p: 3,
                height: '550px', overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#F5F5F5' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#888888', borderRadius: '4px' },
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555555' }
              }}>
                <Typography variant="h6" component="h2" align="left" gutterBottom color="primary">
                  LIST BUCKETS
                </Typography>
                <ListBuckets buckets={buckets} onSelect={this.handleBucketSelect} selectedBucket={selectedBucket} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }
}

export default CreateBucket;
