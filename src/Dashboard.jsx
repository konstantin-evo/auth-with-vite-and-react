import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [tokenInfo, setTokenInfo] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        const fetchToken = async () => {
            try {
                const response = await axios.post('https://example.com/oauth/token', {
                    grant_type: 'authorization_code',
                    code: authorizationCode,
                    redirect_uri: 'http://localhost:3000/dashboard',
                    client_id: 'your-client-id',
                    client_secret: 'your-client-secret',
                });

                setTokenInfo(response.data);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        if (authorizationCode) {
            fetchToken();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://example.com/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokenInfo.access_token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Dashboard</h1>
            {tokenInfo ? (
                <div>
                    <h2>Token Info</h2>
                    <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
                    <button className="btn btn-primary mt-3" onClick={fetchUserData}>
                        Fetch User Data
                    </button>
                    {userData && (
                        <div className="mt-3">
                            <h2>User Data</h2>
                            <pre>{JSON.stringify(userData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading token info...</p>
            )}
        </div>
    );
};

export default Dashboard;
