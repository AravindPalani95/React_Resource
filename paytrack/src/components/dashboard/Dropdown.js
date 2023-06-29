import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Grid, Box } from '@mui/material';

class Dropdown extends React.Component {
    handleChange = (event) => {
        const selectedValue = event.target.value;
        this.props.onChange(selectedValue)
    };

    render() {
        return (
            <Box display="flex" justifyContent="flex-end" alignItems="center">
                <Box>
                    <InputLabel
                        id="duration-label"
                        sx={{
                            fontWeight: 'bold',
                            mr:2
                        }}
                    >
                        SELECT DURATION
                    </InputLabel>
                </Box>
                <FormControl sx={{ minWidth: 150 }}>
                    <Select
                        labelId="duration-label"
                        value={this.props.selectedValue}
                        onChange={this.handleChange}
                    >
                        <MenuItem value={1}>Last 1 Month</MenuItem>
                        <MenuItem value={3}>Last 3 Months</MenuItem>
                        <MenuItem value={6}>Last 6 Months</MenuItem>
                        <MenuItem value={12}>Last 1 Year</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        );
    }
}

export default Dropdown;
