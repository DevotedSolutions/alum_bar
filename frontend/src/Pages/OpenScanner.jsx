import React, { useState } from 'react';
import {Typography } from '@mui/material';
import QrReader from 'react-qr-scanner';
import { DecrementProduct } from '../services/products/DecrementProduct';

const OpenScanner = () => {
    const [result, setResult] = useState("");
    const delay = 100;

    const handleScan = async (data) => {
        if (data) {
            let resp = await DecrementProduct(data);
            if (resp.status === 200) {
                console.log(resp);
            } else {
                console.log(resp.data.message);
            }
            setResult(data);
        }
    };

    const handleError = (err) => {
        console.error(err);
    };



    const webcamStyle = {
        width: '200px',
        height: '200px',
        objectFit: 'cover',
    };

    return (
        <div style={{ padding: "0 10px" }}>
            <Typography>QR Code scanner</Typography>
            <div style={{ border: "1px solid black" }}>
                <QrReader
                    delay={delay}
                    style={webcamStyle}
                    onError={handleError}
                    onScan={handleScan}
                />
                <p>{result}</p>
            </div>

        </div>
    );
};

export default OpenScanner;
