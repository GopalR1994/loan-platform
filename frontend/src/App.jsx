import { useState } from "react";
import "./App.css";

import Home from "./home/pages/Home";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Customers from "./admin/pages/Customers";
import Kyc from "./admin/pages/Kyc";

import CustomerLogin from "./customer/pages/CustomerLogin";
import CustomerRegister from "./customer/pages/CustomerRegister";
import CustomerProfile from "./customer/pages/CustomerProfile";
import CustomerDashboard from "./customer/pages/CustomerDashboard";
import CustomerKyc from "./customer/pages/CustomerKyc";

const API_BASE_URL = "http://172.16.5.227:8081";

function getPageFromUrl() {
  const path = window.location.pathname;

  switch (path) {
    case "/admin/login":
      return "admin-login";

    case "/admin/dashboard":
      return "dashboard";

    case "/admin/customers":
      return "customers";

    case "/admin/kyc":
      return "kyc";

    case "/customer/login":
      return "customer-login";

    case "/customer/register":
      return "customer-register";

    case "/customer/profile":
      return "customer-profile";

    case "/customer/dashboard":
      return "customer-dashboard";

    case "/customer/kyc":
      return "customer-kyc";

    default:
      return "home";
  }
}

function App() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminAccessToken")
  );

  const [customerToken, setCustomerToken] = useState(
    localStorage.getItem("customerAccessToken")
  );

  const [customerMobile, setCustomerMobile] = useState(
    localStorage.getItem("customerMobileNumber")
  );

  const [customerId, setCustomerId] = useState(
    localStorage.getItem("customerId")
  );

  const [page, setPage] = useState(() => {
    const urlPage = getPageFromUrl();

    if (adminToken) {
      return urlPage.startsWith("admin") ||
        ["dashboard", "customers", "kyc"].includes(urlPage)
        ? urlPage
        : "dashboard";
    }

    if (customerToken) {
      return urlPage.startsWith("customer")
        ? urlPage
        : "customer-dashboard";
    }

    return urlPage;
  });

  const navigate = (nextPage) => {
    setPage(nextPage);

    const routes = {
      home: "/",

      "admin-login": "/admin/login",
      dashboard: "/admin/dashboard",
      customers: "/admin/customers",
      kyc: "/admin/kyc",

      "customer-login": "/customer/login",
      "customer-register": "/customer/register",
      "customer-profile": "/customer/profile",
      "customer-dashboard": "/customer/dashboard",
      "customer-kyc": "/customer/kyc",
    };

    window.history.pushState({}, "", routes[nextPage] || "/");
  };

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    localStorage.setItem("adminAccessToken", token);
    navigate("dashboard");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminAccessToken");

    setAdminToken(null);
    navigate("home");
  };

  const handleCustomerLogin = async (
    token,
    mobileNumber
  ) => {
    setCustomerToken(token);
    setCustomerMobile(mobileNumber);

    localStorage.setItem(
      "customerAccessToken",
      token
    );

    localStorage.setItem(
      "customerMobileNumber",
      mobileNumber
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/customers/mobile/${mobileNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const customer = await response.json();

        setCustomerId(customer.id);

        localStorage.setItem(
          "customerId",
          customer.id
        );
      } else {
        setCustomerId(null);
        localStorage.removeItem("customerId");
      }
    } catch (error) {
      console.error(
        "Unable to load customer details:",
        error
      );

      setCustomerId(null);
      localStorage.removeItem("customerId");
    }

    navigate("customer-dashboard");
  };

  const handleCustomerRegistration = (
    token,
    mobileNumber
  ) => {
    setCustomerToken(token);
    setCustomerMobile(mobileNumber);
    setCustomerId(null);

    localStorage.setItem(
      "customerAccessToken",
      token
    );

    localStorage.setItem(
      "customerMobileNumber",
      mobileNumber
    );

    localStorage.removeItem("customerId");

    navigate("customer-profile");
  };

  const handleCustomerProfileComplete = (
    customer
  ) => {
    setCustomerId(customer.id);

    localStorage.setItem(
      "customerId",
      customer.id
    );

    navigate("customer-dashboard");
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem("customerAccessToken");
    localStorage.removeItem("customerMobileNumber");
    localStorage.removeItem("customerId");

    setCustomerToken(null);
    setCustomerMobile(null);
    setCustomerId(null);

    navigate("home");
  };

  if (adminToken) {
    if (page === "customers") {
      return (
        <Customers
          token={adminToken}
          onBack={() => navigate("dashboard")}
        />
      );
    }

    if (page === "kyc") {
      return (
        <Kyc
          token={adminToken}
          onBack={() => navigate("dashboard")}
        />
      );
    }

    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleAdminLogout}
        onCustomers={() => navigate("customers")}
        onKyc={() => navigate("kyc")}
      />
    );
  }

  if (customerToken) {
    if (page === "customer-profile") {
      return (
        <CustomerProfile
          token={customerToken}
          mobileNumber={customerMobile}
          onComplete={handleCustomerProfileComplete}
          onBackToHome={handleCustomerLogout}
        />
      );
    }

    if (page === "customer-kyc") {
      return (
        <CustomerKyc
          token={customerToken}
          onBack={() =>
            navigate("customer-dashboard")
          }
        />
      );
    }

    return (
      <CustomerDashboard
        mobileNumber={customerMobile}
        customerId={customerId}
        onKyc={() => navigate("customer-kyc")}
        onLogout={handleCustomerLogout}
      />
    );
  }

  if (page === "admin-login") {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBackToHome={() => navigate("home")}
      />
    );
  }

  if (page === "customer-login") {
    return (
      <CustomerLogin
        onLogin={handleCustomerLogin}
        onBackToHome={() => navigate("home")}
      />
    );
  }

  if (page === "customer-register") {
    return (
      <CustomerRegister
        onRegistered={handleCustomerRegistration}
        onBackToHome={() => navigate("home")}
      />
    );
  }

  return (
    <Home
      onAdminLogin={() => navigate("admin-login")}
      onCustomerLogin={() =>
        navigate("customer-login")
      }
      onCustomerRegister={() =>
        navigate("customer-register")
      }
    />
  );
}

export default App;