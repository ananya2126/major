API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token && !config.url.includes("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
