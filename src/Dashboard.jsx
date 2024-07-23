import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [tokenInfo, setTokenInfo] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (errorParam) {
            navigate(`/?error=${errorParam}&error_description=${errorDescription}`);
            return;
        }

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
                navigate(`/?error=token_fetch_failed&error_description=Failed to fetch token`);
            }
        };

        if (authorizationCode) {
            fetchToken();
        }
    }, [navigate]);

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
            navigate(`/?error=user_data_fetch_failed&error_description=Failed to fetch user data`);
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
