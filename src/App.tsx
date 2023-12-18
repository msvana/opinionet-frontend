import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import CityContext from "./resources/CityContext";

function App() {
    const [city, setCity] = useState("brno");
    const location = useLocation();
    const navigate = useNavigate();

    function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCity(e.target.value);

        if (location.pathname.startsWith("/topic/")) {
            navigate("/topics");
        }
    }

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
                        <form className="d-flex">
                            <select
                                className="form-select"
                                value={city}
                                onChange={handleCityChange}
                            >
                                <option value="brno">Brno</option>
                                <option value="ostrava">Ostrava</option>
                            </select>
                        </form>
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
                <CityContext.Provider value={city}>
                    <Outlet />
                </CityContext.Provider>
            </div>
        </>
    );
}

export default App;
