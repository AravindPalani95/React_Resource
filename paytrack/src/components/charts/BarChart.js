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
    }
    render() {
        let data = this.props.data;
        let barChartData = chartDataTemplate
        let chartLabels = data.map(d => d.category)
        let chartData = data.map(d => d.value)
        let chartTitle = 'Payment Failures'
        barChartData.datasets[0].data = chartData
        barChartData.labels = chartLabels
        barChartData.datasets[0].label = chartTitle

        return (
            <div id={chartTitle}>
                <Bar data={barChartData} redraw={true}></Bar>
            </div>
        )
    }
}

export default BarChart