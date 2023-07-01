import React, { Component } from 'react';
import { Radio, RadioGroup, FormControlLabel, Divider } from '@mui/material';

class ListBuckets extends Component {
  
  handleBucketSelect = (event) => {
    const selectedBucketName = event.target.value;
    const { buckets } = this.props;
    const selectedBucket = buckets.find((bucket) => bucket.bucketName === selectedBucketName);
    this.props.onSelect(selectedBucket);
  };

  render() {
    const { buckets, selectedBucket } = this.props;
    const selectedBucketName = selectedBucket ? selectedBucket.bucketName : null;
    return (
      <div>
        {buckets.length === 0 ? (
          <p>NO REPORTS CREATED</p>
        ) : (
          <RadioGroup value={selectedBucketName} onChange={this.handleBucketSelect}>
            {buckets.map((bucket, index) => (
              <div key={bucket.bucketName}>
                <FormControlLabel
                  value={bucket.bucketName}
                  control={<Radio />}
                  label={bucket.bucketName}
                />
                {index !== buckets.length - 1 && <Divider />}
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    );
  }
}

export default ListBuckets;
