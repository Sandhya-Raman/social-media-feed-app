
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuth } from "./context/AuthContext";

// PROTECTED ROUTE
function ProtectedRoute({ children }) {
    const { token } = useAuth();

    return token ? children : <Navigate to="/login" />;
}

// MAIN APPLICATION
function App() {
    const { token } = useAuth();

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate to={token ? "/home" : "/login"} />
                    }
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
