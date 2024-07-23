import { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [openidConfig, setOpenidConfig] = useState(null);

    const fetchOpenidConfig = async () => {
        try {
            const openidConfigurationUrl = import.meta.env.VITE_OPENID_CONFIGURATION_URL;
            const response = await axios.get(openidConfigurationUrl);
            setOpenidConfig(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching OpenID configuration:', error);
        }
    };

    const handleLogin = async () => {
        await fetchOpenidConfig();
        if (openidConfig) {
            const clientId = import.meta.env.VITE_CLIENT_ID;
            const redirectUri = import.meta.env.VITE_REDIRECT_URI;
            const authorizationEndpoint = openidConfig.authorization_endpoint;
            const responseType = 'code';
            const scope = 'openid profile email';

            window.location.href = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
        }
    };

    return (
        <div className="container mt-5">
            <h1>Login</h1>
            <button className="btn btn-primary" onClick={handleLogin}>
                Start Login
            </button>
        </div>
    );
};

export default App;
