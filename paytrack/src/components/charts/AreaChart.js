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


class AreaChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartTitle: this.props.chartTitle,
            areaChartData: [],
            options: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.areaData !== this.props.areaData) {
            this.parseChartData()
        }
    }

    parseChartData() {
        let options = {
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
            maintainAspectRatio: false
        };

        if (this.props.areaData.length !== 0) {
            let data = this.props.areaData;
            let areaChartData = chartDataTemplate()
            let chartLabels = data.map(d => d.date)
            let chartData = data.map(d => d.count)
            let chartTitle = this.props.chartTitle
            areaChartData.datasets[0].data = chartData
            areaChartData.datasets[0]["fill"] = true
            areaChartData.labels = chartLabels
            areaChartData.datasets[0].label = chartTitle

            this.setState({
                areaChartData: areaChartData,
                chartTitle: chartTitle,
                options: options
            })
        }
        else{
            this.setState({
                areaChartData: [],
                chartTitle: this.props.chartTitle,
                options: options
            })
        }
    }


    render() {
        if(this.state.areaChartData.length !== 0){
            return (
                <div id={this.state.chartTitle} style={{height: 300, width: "100%"}}>
                    <Line options={this.state.options} data={this.state.areaChartData}></Line>
                </div>
            )
        }
        else {
            return (<div>Loading....</div>)
        }
    }
}

export default AreaChart