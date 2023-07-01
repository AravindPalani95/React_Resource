import React, { Component } from 'react';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import { TextField, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid, Breadcrumbs, Alert, Backdrop, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-querybuilder/dist/query-builder.css';
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
            reports: [],
            alertOpen: false,
            alertMsg: '',
            isSuccess: false,
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadReportColumns()
        this.loadAllReports()
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
            return 'SELECT * FROM <<table>>';
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
        let requestBody = {}
        requestBody['queryWhereClause'] = 'where ' + formatQuery(this.state.query, 'sql')
        requestBody['limit'] = 50
        axios.post('/reports/previewReportByQuery', requestBody).then(res => {
            if (res.data.length > 0) {
                let tableData = {}
                tableData['rows'] = res.data
                let rowData = res.data[0]
                tableData['cols'] = Object.keys(rowData).map(r => { return { "field": r, "headerName": r.toUpperCase() } })

                this.setState({ isPreviewOpen: true, previewReportData: tableData });
            }
            else {
                let tableData = {}
                tableData['rows'] = []
                tableData['cols'] = []
                this.setState({ isPreviewOpen: true, previewReportData: tableData });
            }
        })
    };

    handleCreate = () => {
        const { reportName, query, selectedReport, isUpdateMode } = this.state;

        if (reportName.trim() === '') {
            this.setState({ error: 'Report Name cannot be empty' });
            return;
        }

        const reportData = {
            reportName: reportName,
            queryJson: JSON.stringify(query),
            chartType: 'table',
            reportType: 'user'
        };

        if (isUpdateMode) {
            // Update the existing report with the updated reportData
            console.log('Updating report:', reportData);
            this.updateReport(reportData, selectedReport.reportID)
        } else {
            // Create a new report using the reportData
            console.log('Creating report:', reportData);
            this.createReport(reportData, () => {
                // Callback function to handle report creation
                this.loadAllReports(() => {
                    // Callback function to handle loading all reports
                    const createdReport = this.state.reports.find(report => report.reportName === reportName);
                    if (createdReport) {
                        this.handleReportSelect(createdReport);
                    }
                });
            });
        }
    };

    handleDelete = () => {
        const { selectedReport } = this.state;
        this.deleteReport(selectedReport.reportID)
    }

    deleteReport(reportId) {
        axios.delete(`/reports/${reportId}`)
            .then(response => {
                this.loadAllReports()
                this.showAlert('Report Deleted Successfully.', true)
                this.handleClear()
            })
            .catch(err => {
                console.error(err)
                this.showAlert('Report Delete Failed.', false)
            })
    }

    createReport(reportData, callback) {
        axios.post('/reports', reportData)
            .then(response => {
                this.showAlert('Report Created Successfully.', true)
                callback()
            })
            .catch(err => {
                console.error(err)
                this.showAlert('Report Creation Failed.', false)
            })
    }

    updateReport(reportData, reportId) {
        axios.put(`/reports/${reportId}`, reportData)
            .then(response => {
                this.loadAllReports()
                this.showAlert('Report Updated Successfully.', true)
            })
            .catch(err => {
                console.error(err)
                this.showAlert('Report Update Failed.', false)
            })
    }

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

    handleReportSelect = (report) => {
        this.setState({
            selectedReport: report,
            reportName: report.reportName,
            query: JSON.parse(report.queryJson),
            isUpdateMode: true
        });
    };

    handleClosePreview = () => {
        this.setState({
            isPreviewOpen: false,
            previewReportData: null
        });
    };

    loadReportColumns = () => {
        axios.get('/reports/getAllColumnNames')
            .then((response) => {
                let data = response.data
                if (data.length > 0) {
                    let cols = data.map(d => { return { "name": d, "label": d } })
                    this.setState({ reportColumns: cols })
                }
            })
            .catch(err => {
                console.err(err)
            })
    }

    loadAllReports(callback) {
        axios.get('/reports')
            .then(response => {
                let data = response.data
                let reports = data['_embedded']['reports']
                this.setState({ reports: reports }, () => {
                    if (callback) {
                        callback(); // Call the callback function after loading all reports
                    }
                });

            }).catch(err => console.error(err))
    }

    handleDownload = () => {
        const { reportName } = this.state;

        // Validate the reportName field
        if (reportName.trim() === '') {
            this.setState({ error: 'Report Name is required' });
            return;
        }
        // Set loading state
        this.setState({ isLoading: true });

        let requestBody = {};
        requestBody['queryWhereClause'] = 'where ' + formatQuery(this.state.query, 'sql');
        requestBody['reportName'] = reportName;
        axios
            .post('/reports/exportReportByQuery', requestBody, {
                responseType: 'blob', // Set the response type to 'blob'
            })
            .then((res) => {
                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(new Blob([res.data]));

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', reportName + '.xlsx'); // Set the file name

                // Simulate a click on the link to trigger the download
                document.body.appendChild(link);
                link.click();

                // Clean up the temporary URL and link element
                URL.revokeObjectURL(url);
                link.parentNode.removeChild(link);
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.error('Error downloading report:', error);
                this.setState({ isLoading: false })
            });
    };


    render() {
        const { reportName, query, selectedReport, isUpdateMode, error, isPreviewOpen, previewReportData, reports, alertOpen, alertMsg, isSuccess, isLoading } = this.state;

        return (
            <div>
                <Box sx={{ flexGrow: 1, mt: 2, ml: 2, mr: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" sx={{ height: "100%" }}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Typography>MENU</Typography>
                                    <Typography color="textPrimary">REPORTS</Typography>
                                </Breadcrumbs>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box border={1} sx={{ outline: '1px solid #1565c0', padding: '16px', flex: '1 1 60%', marginRight: '16px', marginBottom: '16px', ml: 2, mt: 2 }}>
                        <Typography color="primary" variant="h6" sx={{ textTransform: 'uppercase', marginBottom: '16px' }}>
                            {isUpdateMode ? 'UPDATE REPORT' : 'CREATE REPORT'}
                        </Typography>
                        {
                            alertOpen ?
                                (<Grid item xs={12} sx={{ mb: 2 }}>
                                    <Alert variant="filled" severity={isSuccess ? 'success' : 'error'}>
                                        {alertMsg}
                                    </Alert>
                                </Grid>) : <></>
                        }
                        <TextField
                            label="Report Name"
                            value={reportName}
                            onChange={this.handleReportNameChange}
                            sx={{ marginBottom: '16px', width: '100%' }}
                            error={error && reportName.trim() === ''}
                            helperText={error && reportName.trim() === '' ? 'Report Name cannot be empty' : ''}
                        />
                        <Box sx={{
                            height: 230, background: 'rgba(0, 75, 183, 0.2)', overflowY: 'auto',
                            '&::-webkit-scrollbar': { width: '8px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#F5F5F5' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888888', borderRadius: '4px' },
                            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555555' }
                        }}>
                            <QueryBuilder fields={this.state.reportColumns} query={query} onQueryChange={this.handleQueryChange} />
                        </Box>
                        <Accordion sx={{ marginTop: '16px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Query
                            </AccordionSummary>
                            <AccordionDetails sx={{
                                maxHeight: '80px', overflowY: 'auto',
                                '&::-webkit-scrollbar': { width: '8px' },
                                '&::-webkit-scrollbar-track': { backgroundColor: '#F5F5F5' },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#888888', borderRadius: '4px' },
                                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555555' }
                            }}>
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

                            <Button variant="contained" color="primary" onClick={this.handleDownload} sx={{ marginRight: '8px' }}>
                                Download Report
                            </Button>
                            {isUpdateMode ? (
                                <>
                                    <Button variant="contained" color="primary" onClick={this.handleCreate} sx={{ marginRight: '8px' }}>
                                        Update Report
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={this.handleDelete}>
                                        Delete Report
                                    </Button>
                                </>
                            ) : (
                                <Button variant="contained" color="primary" onClick={this.handleCreate}>
                                    Create Report
                                </Button>
                            )}
                            <ReportPreviewModal open={isPreviewOpen} onClose={this.handleClosePreview} reportData={previewReportData} />
                        </Box>
                    </Box>

                    <Box border={1} sx={{
                        outline: '1px solid #1565c0', padding: '16px', flex: '1 1 40%', marginBottom: '16px',
                        mr: 2,
                        mt: 2,
                        maxHeight: '600px', overflowY: 'auto',
                        '&::-webkit-scrollbar': { width: '8px' },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#F5F5F5' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#888888', borderRadius: '4px' },
                        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555555' }
                    }}>
                        <Typography color="primary" variant="h6" sx={{ textTransform: 'uppercase', marginBottom: '16px' }}>
                            LIST REPORTS
                        </Typography>
                        <ReportList reports={reports} onSelect={this.handleReportSelect} selectedReport={selectedReport} />
                    </Box>
                    {isLoading && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.5)' }}>
                            <Backdrop open={isLoading}>
                                <CircularProgress color="primary" />
                            </Backdrop>
                        </div>
                    )}
                </Box>
            </div>
        );
    }
}

export default ReportPageV1;
