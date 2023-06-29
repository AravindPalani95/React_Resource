import React from 'react'
import { Line } from 'react-chartjs-2'
import { chartDataTemplate } from './ChartConfig'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);


class LineChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartTitle: this.props.chartTitle,
            lineChartData: [],
            options: {},
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lineData !== this.props.lineData) {
            this.parseChartData()
        }
    }

    parseChartData() {
        let options = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: this.props.chartTitle,
                },
            },
        };

        if (this.props.lineData.length !== 0) {
            let data = this.props.lineData;
            let lineChartData = chartDataTemplate()
            let chartLabels = data.map(d => d.week+ ' - ' + d.month)
            let chartData = data.map(d => d.count)
            let chartTitle = this.props.chartTitle
            lineChartData.datasets[0].data = chartData
            lineChartData.datasets[0]["fill"] = false
            lineChartData.labels = chartLabels
            lineChartData.datasets[0].label = chartTitle

            this.setState({
                lineChartData: lineChartData,
                chartTitle: chartTitle,
                options: options
            })
        }
        else{
            this.setState({
                lineChartData: [],
                chartTitle: this.props.chartTitle,
                options: options
            })
        }
    }

    render() {
        if(this.state.lineChartData.length !== 0){
            return (
                <div id={this.state.chartTitle} style={{height: 300, widht:"100%"}}>
                    <Line options={this.state.options} data={this.state.lineChartData}></Line>
                </div>
            )
        }
        else {
            return (<div>Loading....</div>)
        }
    }
}

export default LineChart