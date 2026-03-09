import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { endpoint } from '../../../utils/APIRoutes';
import axios from 'axios';
import Loader from '../../../Shared/Loader';
import logo from "../../../assets/logo.png"

const LogIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: "",
    password: "",
    otp: "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const reqbody = {
        username: formik.values.username,
        password: formik.values.password,
        otp: formik.values.otp,
      };
      loginFn(reqbody);
    },
  });

  const loginFn = async (reqBody) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint?.admin_login, reqBody, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      // console.log(response?.data);
      toast(response?.data?.message);
      setLoading(false);

      if (response?.data?.message === "Login Successfully") {
        localStorage.setItem("logindataen", response?.data?.result?.[0]?.token);
        localStorage.setItem(
          "login_user",
          response?.data?.result?.[0]?.user_type
        );

        localStorage.setItem("uid", "ADMIN");
        localStorage.setItem("username", "ADMIN");
        if (response?.data?.result?.[0]?.user_type === "Admin") {
          navigate("/admindashboard");
          window.location.reload();
        } else {
          navigate("/home");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during login.");
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      <div className="flex justify-center items-center h-screen overflow-y-scroll bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-full max-w-lg lg:p-6 p-4 border-cyan-400 border rounded-xl shadow-2xl bg-gray-900/80">
          <div className="bg-glassy">
            <div className="flex justify-center my-2">
              <img src={logo} alt="Logo" className="w-24 h-24" />
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-cyan-300 text-sm font-semibold mb-1">Username</label>
                <input
                  placeholder="Enter your username"
                  type="text"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  className="w-full p-3 mt-1 bg-gray-800 text-cyan-100 placeholder:text-cyan-400 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-cyan-300 text-sm font-semibold mb-1">Password</label>
                <input
                  placeholder="Enter your password"
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="w-full p-3 mt-1 bg-gray-800 text-cyan-100 placeholder:text-cyan-400 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="otp" className="block text-cyan-300 text-sm font-semibold mb-1">OTP</label>
                <input
                  placeholder="Enter your OTP (if required)"
                  type="text"
                  id="otp"
                  name="otp"
                  value={formik.values.otp}
                  onChange={formik.handleChange}
                  className="w-full p-3 mt-1 bg-gray-800 text-cyan-100 placeholder:text-cyan-400 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 text-white font-semibold rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition duration-300 ease-in-out hover:scale-105 shadow-lg"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
