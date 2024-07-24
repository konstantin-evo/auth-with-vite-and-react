import { useState, useEffect } from 'react';
import axios from 'axios';
import { generateRandomState } from './utils/authUtils';
import './App.css';  // Импортируем CSS файл

const App = () => {
    const [openidConfig, setOpenidConfig] = useState(null);
    const [error, setError] = useState(null);
    const [configVisible, setConfigVisible] = useState(false);
    const [configHiding, setConfigHiding] = useState(false);

    const fetchOpenidConfig = async () => {
        try {
            const openidConfigurationUrl = import.meta.env.VITE_OPENID_CONFIGURATION_URL;
            const response = await axios.get(openidConfigurationUrl);
            setOpenidConfig(response.data);
            setError(null);
            return true;
        } catch (error) {
            console.error('Error fetching OpenID configuration:', error);
            setError('Failed to fetch OpenID configuration');
            return false;
        }
    };

    const handleLogin = () => {
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_REDIRECT_URI;
        const authorizationEndpoint = import.meta.env.VITE_AUTH_URL;
        const scope = import.meta.env.VITE_CLIENT_SCOPE;
        const responseType = 'code';
        const state = generateRandomState();

        if (authorizationEndpoint) {
            window.location.href = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}`;
        }
    };

    const toggleConfig = async () => {
        if (!configVisible) {
            const success = await fetchOpenidConfig();
            if (success) {
                setConfigVisible(true);
            }
        } else {
            setConfigHiding(true);
            setTimeout(() => {
                setConfigVisible(false);
                setConfigHiding(false);
            }, 500);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (errorParam) {
            setError(`Error: ${errorParam}. ${decodeURIComponent(errorDescription || '')}`);
        }
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="btn btn-secondary me-2" onClick={handleLogin}>
                                Login
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-secondary me-2" onClick={toggleConfig}>
                                {configVisible && !configHiding ? 'Hide Configuration' : 'Get Configuration'}
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="jumbotron text-center p-5" style={{ backgroundColor: '#eaecef' }}>
                <img className="p-3" src="/lock-closed.svg"
                     alt="Closed Lock Icon" style={{width: '18%'}}/>
                <h1 className="display-4">Welcome to the Auth App</h1>
                <p className="lead">Explore the Vite + React authentication app for educational purposes.</p>
                <div className="d-flex justify-content-center mt-3">
                    <img src="/vite.svg" alt="Vite Logo" height="80" className="me-2"/>
                    <img src="/react.svg" alt="React Logo" height="80"/>
                </div>
                {configVisible && (
                    <div className={`config-container ${configHiding ? 'hide' : ''}`}>
                        <pre>{JSON.stringify(openidConfig, null, 2)}</pre>
                    </div>
                )}
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <div id="configResults">
                            {error && <div className="alert alert-danger">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
