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
    }
    render() {
        let data = this.props.data;
        let areaChartData = chartDataTemplate
        let chartLabels = data.map(d => d.category)
        let chartData = data.map(d => d.value)
        let chartTitle = 'Payment Failures'
        areaChartData.datasets[0].data = chartData
        areaChartData.datasets[0]["fill"]=true
        areaChartData.labels = chartLabels
        areaChartData.datasets[0].label = chartTitle

        return (
            <div id={chartTitle+ 16198}>
                <Line data={areaChartData} redraw={true}></Line>
            </div>
        )
    }
}

export default AreaChart