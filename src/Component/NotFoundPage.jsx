import React from 'react';
import { Box } from '@mui/material';
import NOTFOUND from "../Asset/404NotFound.jpeg";

const NotFoundPage = () => {
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
                        src={NOTFOUND}
                        alt="404 Page Not Found"
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
            </Box>
        </div>
    );
};

export default NotFoundPage;