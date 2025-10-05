import React, { useState } from "react";
import { authAPI } from "../../api/api";
import validateForm from "../../utils/validateForm";

const Login = ({ setUser, setCurrentView }) => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Validate form
    const errors = validateForm(formData, "login");
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      setLoading(true);
      setFormErrors({});
      setError(null);
      // Call backend login API
      const res = await authAPI.login({
        email: formData.get("email"),
        password: formData.get("password"),
      });
      console.log("Login response:", res.data);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      
      // Redirect based on user role
      const userRole = res.data.user.role;
      switch (userRole) {
        case 'admin':
          setCurrentView("dashboard"); // Goes to Admin Dashboard
          break;
        case 'doctor':
          setCurrentView("dashboard"); // Goes to Doctor Dashboard
          break;
        case 'pet owner':
        default:
          setCurrentView("dashboard"); // Goes to Pet Owner Dashboard
          break;
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setFormErrors({ email: err.response.data.message });
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">VetCare</h1>
          <p className="text-gray-600">Book your pet's appointment</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setCurrentView('register')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;