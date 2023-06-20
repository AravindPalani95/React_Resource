import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React from 'react'
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppModal from '../modal/AppModal';
import TableGrid from '../charts/TableGrid';

class Reports extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            query: {
                combinator: 'and',
                rules: []
            },
            queryPanelExpanded: false,
            isPreview: false,
            previewReportId: 0
        }
    }

    generateQuery() {
        let queryData = this.state.query
        let columns = queryData.rules.map(rule => rule.field)
        let queryPrefix = 'SELECT ' + columns.join() + ' FROM <<REPORT_TABLE>> WHERE '
        return queryPrefix + formatQuery(this.state.query, 'sql')
    }

    updateQuery(q) {
        this.setState({
            query: q
        })
    }

    clearReport() {
        this.setState({
            query: {
                combinator: 'and',
                rules: []
            }
        })
    }

    handleReportSelect(event) {

    }

    previewReport() {
        this.setState({
            isPreview: true
        })
    }

    closePreview(){
        this.setState({
            isPreview: false
        })
    }

    createReport(){
        
    }

    render() {
        const fields = [
            { name: 'firstName', label: 'First Name' },
            { name: 'lastName', label: 'Last Name' },
        ];
        return (
            <>
                <Box sx={{ flexGrow: 1, mt: 2, ml: 2, mr: 2 }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography sx={{ mb: 2 }}><b>CREATE REPORT</b></Typography>
                            <TextField id="outlined-basic" label="Report Name" variant="outlined" sx={{mb:2, width:"50%"}}/>
                            <QueryBuilder fields={fields} query={this.state.query} onQueryChange={q => this.updateQuery(q)} />
                            <Accordion sx={{ mt: 2 }} expanded={this.state.queryPanelExpanded} onChange={() => this.setState({ queryPanelExpanded: !this.state.queryPanelExpanded })}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography><b>Report Query</b></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {
                                            this.state.query.rules.length > 0 ?
                                                this.generateQuery() : ''
                                        }
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <ButtonGroup variant="contained" aria-label="primary button group" sx={{ mt: 2 }}>
                                <Button variant="contained" disableElevation sx={{ mr: 1 }} onClick={() => this.clearReport()}>
                                    Clear
                                </Button>
                                <Button variant="contained" disableElevation sx={{ mr: 1 }} onClick={() => this.previewReport()}>
                                    Preview Report
                                </Button>
                                <Button variant="contained" disableElevation onClick={() => this.createReport()}>
                                    Create Report
                                </Button>
                            </ButtonGroup>
                            <AppModal open={this.state.isPreview} handler={() => this.closePreview()}>
                                <TableGrid preview={this.state.isPreview} query={this.generateQuery()} reportId={1230}/>
                            </AppModal>
                        </Grid>

                        <Grid item sx={{ ml: 10 }}>
                            <Typography sx={{ mb: 1 }}><b>ALL REPORTS</b></Typography>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    onChange={(e) => this.handleReportSelect(e)}
                                >
                                    <FormControlLabel value="1230" control={<Radio />} label="Payment Failure Report" />
                                    <Divider />
                                    <FormControlLabel value="1231" control={<Radio />} label="System Failure Report" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }
}

export default Reports