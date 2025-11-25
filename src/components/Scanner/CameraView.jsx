import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Camera, Type } from 'lucide-react';
import { analyzeProduct } from '../../lib/allergenLogic';
import { getUser, addToHistory } from '../../lib/storage';
import { fetchProductByBarcode, searchProductByName } from '../../lib/openFoodFacts';
// import { recognizeText } from '../../lib/ocr';
import WarningPopup from '../Results/WarningPopup';
// import { Html5Qrcode } from 'html5-qrcode';

const CameraView = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [mode, setMode] = useState('barcode'); // 'barcode' | 'ocr'
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Refs
    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            setStatusMessage("Camera requires HTTPS. Please use a secure connection.");
            return;
        }

        if (mode === 'barcode') {
            startBarcodeScanner();
        } else {
            stopBarcodeScanner();
        }

        return () => {
            stopBarcodeScanner();
        };
    }, [mode]);

    const startBarcodeScanner = () => {
        if (!window.isSecureContext && window.location.hostname !== 'localhost') return;

        /*
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                handleBarcodeScan(decodedText);
            },
            (errorMessage) => {
                // ignore
            }
        ).catch(err => {
            console.error("Error starting scanner", err);
            setStatusMessage("Camera access failed. Ensure permissions are granted.");
        });
        */
        setStatusMessage("Scanner disabled for debugging.");
    };

    const stopBarcodeScanner = () => {
        /*
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
                scannerRef.current.clear();
            }).catch(err => console.error("Failed to stop scanner", err));
        }
        */
    };

    const handleBarcodeScan = async (barcode) => {
        if (scanning) return;
        setScanning(true);
        stopBarcodeScanner();
        setStatusMessage("Fetching product data...");

        try {
            const productData = await fetchProductByBarcode(barcode);
            processResult(productData);
        } catch (error) {
            setStatusMessage("Error fetching data.");
            setScanning(false);
        }
    };

    const handleManualSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setScanning(true);
        setStatusMessage("Searching...");

        try {
            const productData = await searchProductByName(query);
            processResult(productData);
        } catch (error) {
            setStatusMessage("Search failed. Please try again.");
            setScanning(false);
        }
    };

    const handleOCR = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanning(true);
        setStatusMessage("OCR temporarily disabled for debugging.");
        setTimeout(() => {
            setScanning(false);
            setStatusMessage("");
        }, 2000);

        /*
        setStatusMessage("Analyzing text...");

        try {
            const ocrResult = await recognizeText(file);
            // const ocrResult = { text: "Dummy OCR Text" }; // Dummy for now

            if (!ocrResult.text || ocrResult.text.trim().length < 5) {
                setStatusMessage("No readable text found. Try again with better lighting.");
                setTimeout(() => {
                    setScanning(false);
                    setStatusMessage("");
                }, 3000);
                return;
            }

            const productData = {
                found: true,
                name: "Scanned Label",
                ingredients: ocrResult.text,
                image: URL.createObjectURL(file),
                allergens_tags: []
            };
            processResult(productData);
        } catch (error) {
            setStatusMessage("Analysis failed.");
            setScanning(false);
        }
        */
    };

    const processResult = (productData) => {
        if (!productData || !productData.found) {
            setStatusMessage("Product not found.");
            setTimeout(() => {
                setScanning(false);
                setStatusMessage("");
                if (mode === 'barcode') startBarcodeScanner();
            }, 2000);
            return;
        }

        const user = getUser();
        const analysis = analyzeProduct(productData, user.allergens);

        setResult(analysis);
        addToHistory(analysis);
        setScanning(false);
        setStatusMessage("");

        if (analysis.status === 'danger' && navigator.vibrate) {
            navigator.vibrate([500, 200, 500]);
        }
    };

    const closePopup = () => {
        setResult(null);
        setQuery('');
        if (mode === 'barcode') {
            startBarcodeScanner(); // Resume scanning
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh', backgroundColor: 'black', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ padding: '1rem', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft />
                </button>
                <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '20px', padding: '4px' }}>
                    <button
                        onClick={() => setMode('barcode')}
                        style={{
                            background: mode === 'barcode' ? 'var(--color-primary)' : 'transparent',
                            color: 'white', border: 'none', borderRadius: '16px', padding: '6px 12px', fontSize: '0.8em'
                        }}
                    >
                        Barcode
                    </button>
                    <button
                        onClick={() => setMode('ocr')}
                        style={{
                            background: mode === 'ocr' ? 'var(--color-primary)' : 'transparent',
                            color: 'white', border: 'none', borderRadius: '16px', padding: '6px 12px', fontSize: '0.8em'
                        }}
                    >
                        Scan Text
                    </button>
                </div>
            </div>

            {/* Scanner Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mode === 'barcode' ? (
                    <div id="reader" style={{ width: '100%', height: '100%' }}></div>
                ) : (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <Type size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>Take a photo of the ingredients list.</p>
                        <button
                            className="btn-primary"
                            onClick={() => fileInputRef.current.click()}
                            style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem auto' }}
                        >
                            <Camera size={20} /> Capture Photo
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            onChange={handleOCR}
                            style={{ display: 'none' }}
                        />
                    </div>
                )}

                {statusMessage && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '1rem', borderRadius: '12px', zIndex: 20 }}>
                        {statusMessage}
                    </div>
                )}
            </div>

            {/* Manual Input */}
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.5)' }}>
                <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Search product name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '24px', border: 'none', outline: 'none' }}
                    />
                    <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={24} />
                    </button>
                </form>
            </div>

            {result && (
                <WarningPopup result={result} onClose={closePopup} />
            )}
        </div>
    );
};

export default CameraView;
