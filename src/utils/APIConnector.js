import axios from "axios";
import toast from "react-hot-toast";
import { frontend } from "./APIRoutes";

const getUserToken  = () => localStorage.getItem("logindataen");
const getAdminToken = () =>
  localStorage.getItem("logindataen_admin") || localStorage.getItem("token");

const handleInvalidToken = (response) => {
  if (response?.data?.message === "Invalid Token") {
    toast("Logged in on another device", { id: "invalid-token" });
    localStorage.clear();
    window.location.href = frontend;
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
    if (handleNoPermission(response))  return response;
    return response;
  } catch (e) {
    return { msg: e?.message };
  }
};

export const apiConnectorPostAdmin = async (endpoint, reqBody) => {
  try {
    const response = await axios.post(endpoint, reqBody, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    if (handleInvalidToken(response)) return;
    if (handleNoPermission(response))  return response;
    return response;
  } catch (e) {
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

export const apiConnectorPostWithdouToken = async (endpoint, reqBody, token) => {
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