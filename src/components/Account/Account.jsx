import React from 'react'
import './Account.css';
import { useNavigate } from 'react-router-dom';

const Account = ({ session }) => {
    const navigate = useNavigate();

    const userLoggedIn = session && session.loginSuccess;
    if (!userLoggedIn) navigate('/');

    return (
        <div className="account-page">
            <div className="account-title">Account Settings</div>
            <div className="account-content">[ Account Page Content Here ]</div>
        </div>
    )
}

export default Account;