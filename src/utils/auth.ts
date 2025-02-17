// utils/auth.ts
export const isAuthorized = (): boolean => {
  const token = localStorage.getItem("authToken");
  return !!token; // Return true if token exists
};
