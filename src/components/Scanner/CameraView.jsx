import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Camera, Type } from 'lucide-react';
import { analyzeProduct } from '../../lib/allergenLogic';
import { getUser, addToHistory } from '../../lib/storage';
import { fetchProductByBarcode, searchProductByName } from '../../lib/openFoodFacts';
// Import the AI Service and the new Component
import { analyzeImage } from '../../services/aiService';
import SafeSwap from './SafeSwap';
import WarningPopup from '../Results/WarningPopup';
import Webcam from 'react-webcam';
import ScannerOverlay from './ScannerOverlay';

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
        // Simple HTTPS check (except for localhost)
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
        // Logic handled by Webcam component mounting
    };

    const stopBarcodeScanner = () => {
        // Logic handled by Webcam component unmounting
    };

    // --- 1. BARCODE LOGIC (OpenFoodFacts) ---
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

    // --- 2. MANUAL SEARCH LOGIC ---
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

    // --- 3. AI / OCR LOGIC (The New Brain) ---
    const handleOCR = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanning(true);
        setStatusMessage("🤖 AI is analyzing ingredients...");

        try {
            // Get user's allergies to check against
            const user = getUser();

            // Send to Gemini (Brain)
            const aiAnalysis = await analyzeImage(file, user.allergens);

            console.log("AI Result:", aiAnalysis);

            // Format result for the Popup
            const finalResult = {
                status: aiAnalysis.status, // 'danger' or 'safe'
                product: { name: "Scanned Label" },
                matches: aiAnalysis.detected || [],
                safeAlternatives: aiAnalysis.alternatives || [] // Pass the suggestions
            };

            setResult(finalResult);
            addToHistory(finalResult);
            setScanning(false);
            setStatusMessage("");

            if (finalResult.status === 'danger' && navigator.vibrate) {
                navigator.vibrate([500, 200, 500]);
            }

        } catch (error) {
            console.error("AI Error:", error);
            setStatusMessage("AI Analysis failed. Try again.");
            setTimeout(() => {
                setScanning(false);
                setStatusMessage("");
            }, 3000);
        }
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
            startBarcodeScanner();
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
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {mode === 'barcode' ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={scannerRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: 'environment' }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* If you created ScannerOverlay earlier, this is where it works */}
                        <ScannerOverlay status={scanning ? 'analyzing' : (result ? result.status : 'scanning')} />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <Type size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>Take a photo of the ingredients list.</p>
                        <button
                            className="btn-primary"
                            onClick={() => fileInputRef.current.click()}
                            style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '1rem auto', padding: '12px 24px', borderRadius: '30px' }}
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

            {/* RESULT POPUP + SAFE SWAP SUGGESTIONS */}
            {result && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50 }}>
                    {/* Render the standard popup */}
                    <WarningPopup result={result} onClose={closePopup} />

                    {/* Render Safe Swap ON TOP if alternatives exist */}
                    {result.safeAlternatives && result.safeAlternatives.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            zIndex: 60
                        }}>
                            <SafeSwap alternatives={result.safeAlternatives} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CameraView;