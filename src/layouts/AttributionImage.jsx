import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Tooltip } from '@mui/material';

const AttributionImage = ({ src, alt, attributionContent, link, width = "100%", height = "auto", maxWidth = "100%", maxHeight = "auto" }) => {
    const handleClick = () => {
        if (link) {
            window.open(link, '_blank');
        }
    };

    return (
        <>
            <Helmet>
                {attributionContent && <meta name="image-attribution" content={attributionContent} />}
            </Helmet>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 13px",
                    cursor: link ? 'pointer' : 'default',
                    position: 'relative',
                    maxWidth: maxWidth,
                    maxHeight: maxHeight,
                }}
                onClick={handleClick}
            >
                {link ? (
                    <Tooltip title={`Click to visit link`} arrow>
                        <img
                            src={src}
                            alt={alt}
                            style={{
                                width: width,
                                height: height,
                                objectFit: 'contain',
                                display: 'block',
                                maxWidth: '100%',
                                maxHeight: '100%',
                            }}
                        />
                    </Tooltip>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            width: width,
                            height: height,
                            objectFit: 'contain',
                            display: 'block',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                    />
                )}
            </Box>
        </>
    );
};

export default AttributionImage;
