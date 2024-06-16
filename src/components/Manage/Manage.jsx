import React from 'react'
import './Manage.css';
import { useNavigate } from 'react-router-dom';

const Manage = ({ session }) => {
    const navigate = useNavigate();

    const userLoggedIn = session && session.loginSuccess;
    if (!userLoggedIn) navigate('/');

    return (
        <div className="manage-page">
            <div className="manage-title">Manage Snippets</div>
            <div className="manage-content">[ Manage Page Content Here ]</div>
        </div>
    )
}

export default Manage;