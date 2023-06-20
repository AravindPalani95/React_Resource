import { Box } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

class TableGrid extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            rows: [],
            columns: [],
            pageSize: 1
        }
    }

    setTableData(data) {
        this.setState({
            rows: data.rows,
            columns: data.cols,
            pageSize: data.pagination
        })
    }

    componentDidMount() {
        let reportId = this.props.reportId
        axios.get("http://localhost:8084/" + reportId).then(response => {
            let data = response.data
            this.setTableData(data)
        })
    }

    render() {
        return (
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={this.state.rows}
                    columns={this.state.columns}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5,
                          },
                        },
                      }}
                    pageSizeOptions={[5,10,15]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        )
    }
}

export default TableGrid