import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [openidConfig, setOpenidConfig] = useState(null);
    const [error, setError] = useState(null);

    const fetchOpenidConfig = async () => {
        try {
            const openidConfigurationUrl = import.meta.env.VITE_OPENID_CONFIGURATION_URL;
            const response = await axios.get(openidConfigurationUrl);
            setOpenidConfig(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching OpenID configuration:', error);
            setError('Failed to fetch OpenID configuration');
        }
    };

    const handleLogin = () => {
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_REDIRECT_URI;
        const authorizationEndpoint = import.meta.env.VITE_AUTH_URL;
        const responseType = 'code';
        const scope = 'openid profile email';

        if (authorizationEndpoint) {
            window.location.href = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
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
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <button className="btn btn-secondary" onClick={handleLogin}>
                                Login
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-secondary ml-2" onClick={fetchOpenidConfig}>
                                Get Configuration
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="jumbotron text-center p-5" style={{ backgroundColor: '#eaecef' }}>
                <img className="p-3" src="/lock-closed.svg"
                     alt="Closed Lock Icon" style={{width: '18%'}}/>
                <h1 className="display-4">Welcome to the Auth App</h1>
                <p className="lead">Explore the Keycloak based authentication solution for educational purposes.</p>
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <div id="configResults">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {openidConfig && (
                                <pre>{JSON.stringify(openidConfig, null, 2)}</pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
