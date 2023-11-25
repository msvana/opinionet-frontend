import { Link, NavLink, Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark text-bg-dark shadow-sm sticky-top">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <strong>OpinioNet</strong>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#main-menu"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="main-menu">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/topics" className="nav-link">
                                    Topics
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4 py-3">
                <Outlet />
            </div>
        </>
    );
}

export default App;
