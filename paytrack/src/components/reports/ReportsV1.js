import React, { Component } from 'react';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import { TextField, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ReportList from './ReportList';
import ReportPreviewModal from './ReportPreviewModal';
import axios from 'axios';

class ReportPageV1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportName: '',
            reportColumns: [],
            query: {
                combinator: 'and',
                rules: []
            },
            selectedReport: null,
            isUpdateMode: false,
            error: '',
            isPreviewOpen: false,
            reports: [
                { id: 1, name: 'Report 1', query: { combinator: 'and', rules: [] } },
                { id: 2, name: 'Report 2', query: { combinator: 'and', rules: [] } },
                { id: 3, name: 'Report 3', query: { combinator: 'and', rules: [] } }
              ]
        };
    }

    componentDidMount(){
        this.loadReportColumns()
    }

    handleReportNameChange = (event) => {
        this.setState({ reportName: event.target.value });
    };

    handleQueryChange = (query) => {
        this.setState({ query });
    };

    generateQuery = () => {
        const { query } = this.state;
        if (query.rules.length === 0) {
            return '';
        }
        const queryPrefix = 'SELECT * FROM <<table>> WHERE ';
        return queryPrefix + formatQuery(query, 'sql');
    };

    handleClear = () => {
        this.setState({
            reportName: '',
            query: {
                combinator: 'and',
                rules: []
            },
            selectedReport: null,
            isUpdateMode: false,
            error: ''
        });
    };

    handlePreview = () => {
        // Handle preview logic, e.g., fetch the report data
        const { selectedReport } = this.state;

        // Fetch report data using the selectedReport ID or other identifier
        // Replace the sample data with the actual fetched report data
        /*const reportData = {
            columns: [
                { field: 'id', headerName: 'ID', width: 100 },
                { field: 'name', headerName: 'Name', width: 150 },
                { field: 'age', headerName: 'Age', width: 100 },
                { field: 'email', headerName: 'Email', width: 200 },
            ],
            rows: [
                { id: 1, name: 'John Doe', age: 25, email: 'john.doe@example.com' },
                { id: 2, name: 'Jane Smith', age: 30, email: 'jane.smith@example.com' },
                // Add more rows as needed
            ],
        };*/

        let requestBody = {}
        requestBody['queryWhereClause'] = 'where ' + formatQuery(this.state.query, 'sql')
        requestBody['limit'] = 50
        axios.post('/reports/previewReportByQuery', requestBody).then(res => {
            if(res.data.length > 0){
              let tableData = {}
              tableData['rows'] = res.data
              let rowData = res.data[0]
              tableData['cols'] = Object.keys(rowData).map(r => {return {"field": r.key, "headerName": r.key.toUpperCase()}})

              this.setState({ isPreviewOpen: true, previewReportData: tableData });
            }
        })
    };

    handleClosePreview = () => {
        this.setState({ isPreviewOpen: false });
    };


    handleCreate = () => {
        const { reportName, query, isUpdateMode } = this.state;

        if (reportName.trim() === '') {
            this.setState({ error: 'Report Name cannot be empty' });
            return;
        }

        if (query.rules.length === 0) {
            this.setState({ error: 'Query cannot be empty' });
            return;
        }

        const reportData = {
            id: Date.now(),
            name: reportName,
            query: query
        };

        if (isUpdateMode) {
            // Handle update report logic
            // Update the existing report with the updated reportData
            console.log('Updating report:', reportData);
        } else {
            // Handle create report logic
            // Create a new report using the reportData
            console.log('Creating report:', reportData);
            this.addReportToList(reportData);
        }
    };

    addReportToList = (reportData) => {
        // Add the report to the list of reports in the state
        this.setState((prevState) => ({
          reports: [...prevState.reports, reportData]
        }));
      };

    handleReportSelect = (report) => {
        this.setState({
            selectedReport: report,
            reportName: report.name,
            query: report.query,
            isUpdateMode: true
        });
    };

    handleClosePreview = () => {
        this.setState({
          isPreviewOpen: false,
          previewReportData: null
        });
      };

    loadReportColumns = () =>{
        axios.get('/reports/getAllColumnNames')
        .then((response) => {
            let data = response.data
            if(data.length > 0){
                let cols = data.map(d => {return {"name": d, "label": d}})
                this.setState({reportColumns: cols})
            }
        })
        .catch(err => {
            console.err(err)
        })
    }

    render() {
        const { reportName, query, selectedReport, isUpdateMode, error, isPreviewOpen, previewReportData, reports } = this.state;

        return (
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ outline: '1px solid #000', padding: '16px', flex: '1 1 50%', marginRight: '16px', marginBottom: '16px', marginTop: '2rem', marginLeft: '2rem' }}>
                        <Typography variant="h6" sx={{ textTransform: 'uppercase', marginBottom: '16px' }}>
                            CREATE REPORT
                        </Typography>

                        <TextField
                            label="Report Name"
                            value={reportName}
                            onChange={this.handleReportNameChange}
                            sx={{ marginBottom: '16px', width: '100%' }}
                            error={error && reportName.trim() === ''}
                            helperText={error && reportName.trim() === '' ? 'Report Name cannot be empty' : ''}
                        />

                        <QueryBuilder fields={this.state.reportColumns} query={query} onQueryChange={this.handleQueryChange} />

                        <Accordion sx={{ marginTop: '16px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Query Details
                            </AccordionSummary>
                            <AccordionDetails>
                                {this.generateQuery()}
                            </AccordionDetails>
                        </Accordion>

                        <Box sx={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={this.handleClear} sx={{ marginRight: '8px' }}>
                                Clear
                            </Button>

                            <Button variant="contained" color="primary" onClick={this.handlePreview} sx={{ marginRight: '8px' }}>
                                Preview Report
                            </Button>

                            {isUpdateMode ? (
                                <Button variant="contained" color="primary" onClick={this.handleCreate}>
                                    Update Report
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={this.handleCreate}>
                                    Create Report
                                </Button>
                            )}
                            <ReportPreviewModal open={isPreviewOpen} onClose={this.handleClosePreview} reportData={previewReportData} />
                        </Box>
                    </Box>

                    <Box sx={{ outline: '1px solid #000', padding: '16px', flex: '1 1 50%', marginBottom: '16px', marginRight: '2rem', marginTop: '2rem' }}>
                        <Typography variant="h6" sx={{ textTransform: 'uppercase', marginBottom: '16px' }}>
                            REPORT LIST
                        </Typography>
                        <ReportList reports={reports} onSelect={this.handleReportSelect} selectedReport={selectedReport} />
                    </Box>
                </Box>
            </div>
        );
    }
}

export default ReportPageV1;
