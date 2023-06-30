import React, { Component } from 'react';
import { Radio, RadioGroup, FormControlLabel, Divider } from '@mui/material';

class ReportList extends Component {
  
  handleReportSelect = (event) => {
    const selectedReportId = parseInt(event.target.value);
    const { reports } = this.props;
    const selectedReport = reports.find((report) => report.reportID === selectedReportId);
    this.props.onSelect(selectedReport);
  };

  render() {
    const { reports, selectedReport } = this.props;
    const selectedReportId = selectedReport ? selectedReport.reportID : null;
    return (
      <div>
        {reports.length === 0 ? (
          <p>NO REPORTS CREATED</p>
        ) : (
          <RadioGroup value={selectedReportId} onChange={this.handleReportSelect}>
            {reports.map((report, index) => (
              <div key={report.reportID}>
                <FormControlLabel
                  value={report.reportID.toString()}
                  control={<Radio />}
                  label={report.reportName}
                />
                {index !== reports.length - 1 && <Divider />}
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    );
  }
}

export default ReportList;
