import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const ReportPreviewModal = ({ open, onClose, reportData }) => {
    return (
        <Modal open={open} onClose={onClose} centered>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#FFF',
                    padding: '16px',
                    outline: 'none',
                    borderRadius: '4px',
                }}
            >
                <h2 id="report-preview-modal-title">Report Preview</h2>
                <IconButton
                    color="inherit"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <div style={{ height: 400, width: '100%', marginTop: '48px', maxWidth: '800px' }}>
                    {reportData ? (
                        <DataGrid
                            columns={reportData.columns}
                            rows={reportData.rows}
                            pageSizeOptions={[5]}
                            autoHeight
                            disableColumnMenu
                            disableSelectionOnClick
                        />
                    ) : (
                        <div>No report data available.</div>
                    )}
                </div>
            </Box>
        </Modal>
    );
};

export default ReportPreviewModal;
