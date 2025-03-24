import "./App.css";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
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
function App() {
  return (
    <StompSessionProvider url="ws://27e0-125-18-187-66.ngrok-free.app/ws">
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

        <Route path="/user" element={<Trading />} />
        <Route path="/user/watchlist" element={<Watchlist />} />
        <Route path="/user/balance" element={<Balance />} />
        <Route path="/user/holding" element={<Holding />} />

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
  );
}

export default App;
