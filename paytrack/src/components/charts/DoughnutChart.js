import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { chartDataTemplate } from './ChartConfig'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

class DoughnutChart extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let data = this.props.data;
        let doughnutChartData = chartDataTemplate
        let chartLabels = data.map(d => d.category)
        let chartData = data.map(d => d.value)
        let chartTitle = 'Payment Failures'
        doughnutChartData.datasets[0].data = chartData
        doughnutChartData.labels = chartLabels
        doughnutChartData.datasets[0].label = chartTitle

        return (
            <div id={chartTitle}>
                <Doughnut data={doughnutChartData} redraw={true}></Doughnut>
            </div>
        )
    }
}

export default DoughnutChart