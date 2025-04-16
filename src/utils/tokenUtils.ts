
export const saveToken = (token: string, expiresIn: number) => {
  const now = Date.now();
  const expiryTime = now + expiresIn * 1000;

  localStorage.setItem("access_token", token);
  localStorage.setItem("expires_in", expiryTime.toString());
};

export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const clearToken = () => {
  localStorage.removeItem("access_token");
};