import "./App.css";
import Home from "./pages/Home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Home/Login";
import Register from "./pages/Home/Register";
import ForgotPassword from "./pages/Home/ForgotPassword";
import ChangePassword from "./pages/Home/ChangePassword";
import AdminLogin from "./pages/Home/AdminLogin";
import AboutUs from "./pages/Home/AboutUs";
import Services from "./pages/Home/Services";
import AddShares from "./pages/Admin/AddShares";
import ViewShares from "./pages/Admin/ViewShares";
import UpdateShares from "./pages/Admin/UpdateShares";
import DeleteShare from "./pages/Admin/DeleteShare";
import Holding from "./pages/User/Holding";
import Balance from "./pages/User/Balance";
import Watchlist from "./pages/User/Watchlist";
import BuyShares from "./pages/User/BuyShares";
import SelllShares from "./pages/User/SelllShares";
import Trading from "./pages/User/Trading";
import { Provider } from "react-redux";
import store from "./reduxContainer/store";
import UserProfile from "./pages/User/UserProfile";
import { StompSessionProvider } from "react-stomp-hooks";
import AuthProvider from "./security/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";
function App() {
  const navigate = useNavigate();

  function AuthenticatedRoute({ children }) {
    const authContext = useAuth();
    if (authContext.isAuthenticated) {
      return children;
    }
    return <Navigate to="/login" />;
  }
  return (
    <AuthProvider>
      <StompSessionProvider url="ws://24da-14-142-39-150.ngrok-free.app/ws">
        <Provider store={store}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/user"
              element={
                <AuthenticatedRoute>
                  <Trading />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/user/watchlist"
              element={
                <AuthenticatedRoute>
                  <Watchlist />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/user/balance"
              element={
                <AuthenticatedRoute>
                  <Balance />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/user/holding"
              element={
                <AuthenticatedRoute>
                  <Holding />
                </AuthenticatedRoute>
              }
            />
            <Route path="/user/buystock/:id" element={<BuyShares />} />
            <Route path="/user/sell stock/:id" element={<SelllShares />} />
            <Route path="/user/my-account" element={<UserProfile />} />

            <Route path="/admin" element={<ViewShares />} />
            <Route path="/admin/view-shares" element={<ViewShares />} />
            <Route path="/admin/add-shares" element={<AddShares />} />
            <Route path="/admin/update-shares" element={<UpdateShares />} />
            <Route path="/admin/delete-shares" element={<DeleteShare />} />
          </Routes>
          <Footer />
        </Provider>
      </StompSessionProvider>
    </AuthProvider>
  );
}

export default App;
