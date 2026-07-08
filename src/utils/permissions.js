const STORAGE_KEY = "admin_permissions";

export const storePermissions = (permissions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions || []));
};

export const getPermissions = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const hasPermission = (key) => {
  if (localStorage.getItem("user_type") === "Admin") return true;
  return getPermissions().includes(key);
};

export const clearPermissions = () => {
  localStorage.removeItem(STORAGE_KEY);
};
