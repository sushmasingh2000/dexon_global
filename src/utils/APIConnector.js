import axios from "axios";
import toast from "react-hot-toast";
import { frontend } from "./APIRoutes";
import { deCryptData } from "./Secret";
import { clearPermissions } from "./permissions";

const getUserToken = () => deCryptData(localStorage.getItem("logindataen"));
const getAdminToken = () =>
  localStorage.getItem("logindataen_admin") || localStorage.getItem("token");

const handleInvalidToken = (response) => {
  if (response?.data?.message === "Invalid Token") {
    toast("Logged in on another device", { id: "invalid-token" });
    clearPermissions();
    localStorage.clear();
    window.location.href = frontend;
    return true;
  }
  return false;
};

const handleUnauthorized = (error) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) {
    toast.error("Session expired. Please log in again.", { id: "unauthorized" });
    const isSubAdmin = localStorage.getItem("user_type") === "SubAdmin";
    clearPermissions();
    localStorage.clear();
    window.location.href = isSubAdmin ? "/subadminlogin" : "/adminlogin";
    return true;
  }
  return false;
};

const handleNoPermission = (response) => {
  const msg = response?.data?.message || "";
  if (
    !response?.data?.success &&
    (msg.toLowerCase().includes("don't have permission") ||
      msg.toLowerCase().includes("contact your admin"))
  ) {
    toast.error(msg, { id: "no-permission", duration: 5000 });
    return true;
  }
  return false;
};

// ─── User connectors ──────────────────────────────────────────────────────────
export const apiConnectorGet = async (endpoint, params) => {
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${getUserToken()}` },
      params,
    });
    if (handleInvalidToken(response)) return;
    return response;
  } catch (e) {
    return { msg: e?.message };
  }
};

export const apiConnectorPost = async (endpoint, reqBody) => {
  try {
    const response = await axios.post(endpoint, reqBody, {
      headers: { Authorization: `Bearer ${getUserToken()}` },
    });
    if (handleInvalidToken(response)) return;
    return response;
  } catch (e) {
    return { msg: e?.message };
  }
};

export const apiConnectorGetAdmin = async (endpoint, params) => {
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
      params,
    });
    if (handleInvalidToken(response)) return;
    if (handleNoPermission(response)) return response;
    return response;
  } catch (e) {
    if (handleUnauthorized(e)) return;
    return { msg: e?.message };
  }
};

export const apiConnectorPostAdmin = async (endpoint, reqBody) => {
  try {
    const response = await axios.post(endpoint, reqBody, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    if (handleInvalidToken(response)) return;
    if (handleNoPermission(response)) return response;
    return response;
  } catch (e) {
    if (handleUnauthorized(e)) return;
    return { msg: e?.message };
  }
};
export const apiConnectorGetWithoutToken = async (endpoint, params, token) => {
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    if (handleInvalidToken(response)) return;
    return response;
  } catch (e) {
    return { msg: e?.message };
  }
};

export const apiConnectorPostWithdouToken = async (
  endpoint,
  reqBody,
  token,
) => {
  try {
    const response = await axios.post(endpoint, reqBody, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (handleInvalidToken(response)) return;
    return response;
  } catch (e) {
    return { msg: e?.message };
  }
};
