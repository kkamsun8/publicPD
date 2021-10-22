import React from 'react'
import { Link } from 'react-router-dom';
import "css/Navigation.css";

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/" className="link">
                        <img src="Main.png" alt="Main" />
                        <p>Main</p>
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="link">
                        <img src="Trend.png" alt="Trend" />
                        <p>Trend</p>
                    </Link>
                </li>
                <li>
                    <Link to="/trendlog" className="link">
                        <img src="Log.png" alt="Alarm" />
                        <p>Trend Log</p>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation
