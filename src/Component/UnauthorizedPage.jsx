import React from 'react';
import { Box, Typography } from '@mui/material';
import Unauth from "../Asset/400Status.jpeg";
const UnauthorizedPage = () => {
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f2f2f2',
            }}
        >
            <Box
                sx={{
                    padding: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: '700px',
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <img
                        src={Unauth}
                        alt="Access Denied"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '550px',
                            borderRadius: '20px',
                            border: "2px solid rgb(227, 223, 223)",
                            boxShadow: "2px 2px 10px rgb(227, 223, 223)",
                        }}
                    />
                </Box>
                <Typography variant="h4" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" paragraph>
                    You do not have permission to access this page. If you believe this is a mistake, please contact your administrator.
                </Typography>
            </Box>
        </div>
    );
};

export default UnauthorizedPage;