import React, { Component } from 'react';
import { Radio, RadioGroup, FormControlLabel, Divider } from '@mui/material';

class ReportList extends Component {
  constructor(props) {
    super(props);
  }

  handleReportSelect = (event) => {
    const selectedReportId = parseInt(event.target.value);
    const { reports } = this.props;
    const selectedReport = reports.find((report) => report.id === selectedReportId);
    this.props.onSelect(selectedReport);
  };

  render() {
    const { reports, selectedReport } = this.props;
    const selectedReportId = selectedReport ? selectedReport.id : null;
    return (
      <div>
        <RadioGroup value={selectedReportId} onChange={this.handleReportSelect}>
          {reports.map((report, index) => (
            <div key={report.id}>
              <FormControlLabel
                value={report.id.toString()}
                control={<Radio />}
                label={report.name}
              />
              {index !== reports.length - 1 && <Divider />}
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
}

export default ReportList;
