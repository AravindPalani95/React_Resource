import React from 'react'
import { Pie } from 'react-chartjs-2'
import { chartDataTemplate } from './ChartConfig'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

class PieChart extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let data = this.props.data;
        let pieChartData = chartDataTemplate
        let chartLabels = data.map(d => d.category)
        let chartData = data.map(d => d.value)
        let chartTitle = 'Payment Failures'
        pieChartData.datasets[0].data = chartData
        pieChartData.labels = chartLabels
        pieChartData.datasets[0].label = chartTitle

        return (
            <div id={chartTitle} style={{display:"flex", alignItems:""}}>
                <Pie data={pieChartData} redraw={true}></Pie>
            </div>
        )
    }
}

export default PieChart