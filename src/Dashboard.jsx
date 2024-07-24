import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [tokenInfo, setTokenInfo] = useState(null);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
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
                const params = new URLSearchParams();
                params.append('grant_type', 'authorization_code');
                params.append('code', authorizationCode);
                params.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI);
                params.append('client_id', import.meta.env.VITE_CLIENT_ID);

                const response = await axios.post(import.meta.env.VITE_TOKEN_URL, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
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
            const response = await axios.get(import.meta.env.VITE_USERINFO_URL, {
                headers: {
                    Authorization: `Bearer ${tokenInfo.access_token}`,
                },
            });
            setUserData(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to fetch user data');
        }
    };

    // TODO: Implement logout with Ory Hydra - Ory Kratos Solution
    const handleLogout = () => {
        try {
            document.cookie.split(";").forEach(cookie => {
                const cookieName = cookie.split("=")[0].trim();
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
            });

            window.location.href = '/';

            setTokenInfo(null);
            setUserData(null);
            setError(null);
        } catch (error) {
            console.error('Error during logout:', error);
            setError('Failed to logout');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="btn btn-secondary me-2" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-secondary me-2" onClick={fetchUserData}>
                                Get User Data
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="container mt-5">
                {tokenInfo ? (
                    <div className="row">
                        <div className="col-12">
                            <div className="card mb-3">
                                <div className="card-header">
                                    <h2>Token Info</h2>
                                </div>
                                <div className="card-body">
                                    <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
                                    {error && (
                                        <div className="alert alert-danger mt-3">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {userData && (
                            <div className="col-12">
                                <div className="card mt-3">
                                    <div className="card-header">
                                        <h2>User Data</h2>
                                    </div>
                                    <div className="card-body">
                                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading token info...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
