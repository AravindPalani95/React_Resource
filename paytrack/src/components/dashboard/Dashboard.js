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

const BucketItem = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ff9800',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
}));

const ChartItem = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#000',
}));


class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            buckets: [],
            chartData: []
        }
    }

    componentDidMount() {
        this.getBucketList()
    }

    getBucketList() {
        axios.get('http://localhost:8080/buckets')
            .then(response => {
                this.setState({ buckets: response.data })
            })
            .catch(err => {
                console.error(err)
            })

        axios.get('http://localhost:8082/data')
            .then(response => {
                this.setState({ chartData: response.data })
            }).catch(err => console.error(err))
    }

    render() {
        return (
            <>
                <Box sx={{ flexGrow: 1, mt: 2, ml: 2 }}>
                    <Grid container spacing={2}>
                        {
                            this.state.buckets.map(bucket => {
                                return (
                                    <Grid item xs={3} key={bucket.name}>
                                        <BucketItem>
                                            <KPYChart bucketName={bucket.name} bucketId={bucket.bId} bucketCount={bucket.count} />
                                        </BucketItem>
                                    </Grid>)
                            })
                        }
                    </Grid>
                </Box>
                <Box sx={{ flexGrow: 1, mt: 2, ml: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <ChartItem>
                                <BarChart data={this.state.chartData} />
                            </ChartItem>
                        </Grid>
                        <Grid item xs={4}>
                            <ChartItem>
                                <PieChart data={this.state.chartData} />
                            </ChartItem>
                        </Grid>
                        <Grid item xs={4}>
                            <ChartItem>
                                <AreaChart data={this.state.chartData}/>
                            </ChartItem>
                        </Grid>
                        <Grid item xs={4}>
                            <ChartItem>
                                <LineChart data={this.state.chartData}/>
                            </ChartItem>
                        </Grid>
                        <Grid item xs={4}>
                            <ChartItem>
                                <DoughnutChart data={this.state.chartData}/>
                            </ChartItem>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }
}

export default Dashboard