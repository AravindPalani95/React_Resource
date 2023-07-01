import React from 'react'
import { Bar } from 'react-chartjs-2'
import { chartDataTemplate } from './ChartConfig'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


class BarChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartTitle: this.props.chartTitle,
            options: {},
            barChartData: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.barData !== this.props.barData) {
            this.parseChartData()
        }
    }

    parseChartData() {

        let options = {
            indexAxis:'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: this.props.chartTitle,
                }
            },
        };


        if (this.props.barData.length !== 0) {
            let data = this.props.barData;
            let barChartData = chartDataTemplate()
            let chartLabels = data.map(d => d.groupBy)
            let chartData = data.map(d => d.count)
            let chartTitle = this.props.chartTitle
            barChartData.datasets[0].data = chartData
            barChartData.labels = chartLabels
            barChartData.datasets[0].label = chartTitle

            this.setState({
                barChartData: barChartData,
                chartTitle: chartTitle,
                options: options
            })

        }
        else {
            this.setState({
                barChartData: [],
                options: options,
                chartTitle: this.props.chartTitle,
            })
        }
    }

    render() {

        if (this.state.barChartData.length !== 0) {
            return (
                <div id={this.state.chartTitle} style={{maxHeight: 400}}>
                    <Bar options={this.state.options} data={this.state.barChartData}></Bar>
                </div>
            )
        }
        else {
            return (<div>Loading....</div>)
        }
    }
}

export default BarChart