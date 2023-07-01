import React from 'react';
import { Modal, Box, IconButton, Alert } from '@mui/material';
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
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <h3 id="report-preview-modal-title" style={{
                    marginBottom: '16px', color: '#1976d2'
                }}>REPORT PREVIEW</h3>
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
                <div style={{ height: 450, width: '800px', overflowX: 'auto' }}>
                    {reportData && reportData.cols.length > 0 ? (
                        <>
                            <Alert severity="info">
                                Preview Show Only First <strong>50 Records.</strong> Please Use <strong>Download Report.</strong>
                            </Alert>
                            <DataGrid
                                columns={reportData.cols}
                                rows={reportData.rows}
                                autoHeight
                                getRowId={(row) => row.paymentFailuresDataID}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 5, page: 0 },
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <DataGrid
                          columns={[]}
                          rows={[]}
                          autoHeight
                          getRowId={() => ''}
                        />
                      )}
                </div>
            </Box>
        </Modal>
    );
};

export default ReportPreviewModal;
