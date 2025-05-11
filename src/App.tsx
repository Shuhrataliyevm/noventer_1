import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import About from './pages/About/about';
import Register from './pages/Register/register';
import Login from './pages/Login/login';
import Error from './pages/Error/error';
import Home from './pages/Home/home';
import Footer from './pages/Footer/footer';
import Header from './pages/Header/header';
import LeftPage from './pages/LeftPage/leftpage';
import Employe from './pages/Employe/employe';
import Clients from './pages/Clients/Clients';
import ShiftList from './pages/ShiftList/ShiftList';
import Staff from './pages/Staff/Staff';
import Employees from './pages/Employees/Employess';
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

const App = () => {

    const content = (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <ProtectedRoute>
                            <About />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leftpage"
                    element={
                        <ProtectedRoute>
                            <LeftPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employe"
                    element={
                        <ProtectedRoute>
                            <Employe />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/shiftlist"
                    element={
                        <ProtectedRoute>
                            <ShiftList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <Clients />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute>
                            <Staff />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <Employees />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/footer"
                    element={
                        <ProtectedRoute>
                            <Footer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/header"
                    element={
                        <ProtectedRoute>
                            <Header />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/error"
                    element={
                        <ProtectedRoute>
                            <Error />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/error" />} />
            </Routes>
        </QueryClientProvider>
    );

    return content;
};

export default App;