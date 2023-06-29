import React from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import KPYChart from '../charts/KPYChart';
import BarChart from '../charts/BarChart'
import PieChart from '../charts/PieChart';
import AreaChart from '../charts/AreaChart';
import LineChart from '../charts/LineChart';
import DoughnutChart from '../charts/DoughnutChart';
import axios from 'axios'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Dropdown from './Dropdown';
import { Breadcrumbs, Divider, Typography } from '@mui/material';

const BucketItem = styled(Paper)(({ theme, selected }) => ({
    position: 'relative',
    backgroundColor: '#FFBB00',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    border: selected ? '3px solid green' : 'none',
    cursor: 'pointer',
}));

const TickIcon = styled(Box)(({ theme, selected }) => ({
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: selected ? 'green' : 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const TickIconContent = styled(CheckCircleIcon)(({ theme }) => ({
    color: 'white',
    '& path': {
        fill: 'white',
    },
}));

const ChartItem = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#000',
}));

const ScrollableBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    mt: 2,
    ml: 2,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
        height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '3px',
    }
}));


class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            buckets: [],
            chartData: [],
            bucketErrorData: [],
            bucketWeeklyData: [],
            bucketDateData: [],
            selectedBucket: null,
            selectedDuration: 1
        }
    }

    getDurationLabel() {
        if (this.state.selectedDuration === 1)
            return "Last One Month"
        else if (this.state.selectedDuration === 3)
            return "Last Three Months"
        else if (this.state.selectedDuration === 6)
            return "Last Six Months"
        else if (this.state.selectedDuration === 12)
            return "Last One Year"
    }

    componentDidMount() {
        this.getAllBucketList()
    }

    getAllBucketList() {
        axios.get(`/paymentFailuresData/countByAllBucketsFromNMonths/${this.state.selectedDuration}`)
            .then(response => {
                this.setState({
                    buckets: response.data,
                    selectedBucket: response.data.length > 0 ? response.data[0].groupBy : null
                }, () => {
                    this.getBucketAllFailureReasonList()
                    this.getWeeklyFailureData()
                    this.getDateFailureData()
                })
            })
            .catch(err => {
                console.error(err)
            })
    }

    getBucketAllFailureReasonList() {
        axios.get(`/paymentFailuresData/countByAllFailureReasonsByBucketFromNMonths/${this.state.selectedBucket}/${this.state.selectedDuration}`)
            .then(response => {
                this.setState({ bucketErrorData: response.data })
            })
            .catch(err => {
                console.err(err)
            })
    }

    getWeeklyFailureData() {
        axios.get(`/paymentFailuresData/weekWiseCountByBucketFromLastNMonths/${this.state.selectedBucket}/${this.state.selectedDuration}`)
            .then(response => {
                this.setState({ bucketWeeklyData: response.data })
            })
            .catch(err => {
                console.err(err)
            })
    }

    getDateFailureData() {
        axios.get(`/paymentFailuresData/dateWiseCountByBucketFromLastNMonths/${this.state.selectedBucket}/${this.state.selectedDuration}`)
            .then(response => {
                this.setState({ bucketDateData: response.data })
            })
            .catch(err => {
                console.err(err)
            })
    }

    handleBucketItemClick = bucketKey => {
        this.setState({ selectedBucket: bucketKey }, () => {
            this.getBucketAllFailureReasonList()
            this.getWeeklyFailureData()
            this.getDateFailureData()
        });
    };

    handleDurationChange = (selectedValue) => {
        this.setState({ selectedDuration: selectedValue }, () => {
            this.getAllBucketList()
        });
    };

    render() {
        return (
            <>
                <Box sx={{ flexGrow: 1, mt: 2, ml: 2, mr: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box display="flex" alignItems="center" sx={{height:"100%"}}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Typography>MENU</Typography>
                                    <Typography color="textPrimary">DASHBOARD</Typography>
                                </Breadcrumbs>
                            </Box>
                        </Grid>
                        <Grid item xs={6} justifyContent="center">
                            <Dropdown
                                selectedValue={this.state.selectedDuration}
                                onChange={this.handleDurationChange}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                <ScrollableBox sx={{ flexGrow: 1, mt: 2, ml: 2, overflowX: 'auto' }}>
                    <Grid
                        container
                        spacing={2}
                        style={{ display: 'flex', flexWrap: 'nowrap', marginBottom: "10px" }}
                    >
                        {this.state.buckets.map((bucket) => {
                            const isSelected = bucket.groupBy === this.state.selectedBucket;
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={bucket.groupBy}>
                                    <Box
                                        onClick={() => this.handleBucketItemClick(bucket.groupBy)}
                                    >
                                        <BucketItem selected={isSelected}>
                                            <TickIcon selected={isSelected}>
                                                {isSelected && <TickIconContent />}
                                            </TickIcon>
                                            <KPYChart
                                                bucketName={bucket.groupBy}
                                                bucketCount={bucket.count}
                                            />
                                        </BucketItem>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </ScrollableBox>
                <Box sx={{ flexGrow: 1, mt: 2, ml: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ChartItem>
                                <AreaChart areaData={this.state.bucketDateData} chartTitle={`${this.getDurationLabel()} Date Wise Failures - ${this.state.selectedBucket}`} />
                            </ChartItem>
                        </Grid>
                        <Grid item xs={12}>
                            <ChartItem>
                                <LineChart lineData={this.state.bucketWeeklyData} chartTitle={`${this.getDurationLabel()} Week Wise Failures - ${this.state.selectedBucket}`} />
                            </ChartItem>
                        </Grid>
                        <Grid item xs={6}>
                            <ChartItem>
                                <BarChart barData={this.state.bucketErrorData} chartTitle={`${this.getDurationLabel()} Total Failure Reasons - ${this.state.selectedBucket}`} />
                            </ChartItem>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }
}

export default Dashboard