import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { QrReader } from 'react-qr-reader';

const OpenScanner = () => {
    const [result, setResult] = useState("");

    const handleScan = (data) => {
        console.log(data);
        if (data) {
            setResult(data);
        }
    };



    return (
        <div style={{ padding: "0 10px" }}>
            <Typography>Open scanner</Typography>


            <Button variant='outlined'>
                Open Webcam Scanner
            </Button>


            <Box>
                <QrReader onScan={handleScan}
                    style={{ width: "100%" }}
                    facingMode={'user'}

                />

                <p>{result}</p>
            </Box>
        </div>
    );
};

export default OpenScanner;