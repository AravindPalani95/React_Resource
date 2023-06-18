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
    }
    render() {
        let data = this.props.data;
        let lineChartData = chartDataTemplate
        let chartLabels = data.map(d => d.category)
        let chartData = data.map(d => d.value)
        let chartTitle = 'Payment Failures'
        lineChartData.datasets[0].data = chartData
        lineChartData.datasets[0]["fill"]=false
        lineChartData.labels = chartLabels
        lineChartData.datasets[0].label = chartTitle

        return (
            <div id={chartTitle+'123'}>
                <Line data={lineChartData} redraw={true}></Line>
            </div>
        )
    }
}

export default LineChart