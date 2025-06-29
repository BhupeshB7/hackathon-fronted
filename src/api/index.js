import axios from "axios"; 
const API_URL = "https://hackathon-backend-chi-two.vercel.app/api";
// const API_URL = "https://hackathon-backend-cvbj.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
});

export const createUser = async ({ name, email, password }) => {
  return await api.post(
    "/user/register",
    { name, email, password },
    { withCredentials: true }
  );
};

export const loginUser = async ({ email, password }) => {
  return await api.post(
    "/user/login",
    { email, password },
    {
      withCredentials: true,
    }
  );
};
export const getUserProfile = async () => {
  return await api.get("/user/profile", {
    withCredentials: true,
  });
};

export const logoutUser = async () => {
  return await api.post(
    "/user/logOut",
    {},
    {
      withCredentials: true,
    }
  );
};

export const logoutAllDevices = async () => {
  return await api.post(
    "/user/logoutAll-device",
    {},
    {
      withCredentials: true,
    }
  );
};

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await api.post(
      "/user/google-auth",
      {
        idToken,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const loginWithGitHub = async (code) => {
  const response = await api.post(
    "/user/github-auth",
    {
      code,
    },
    {
      withCredentials: true,
    }
  ); 
  return response.data;
};

export const sendOTP = async (email) => {
  return await api.post("/user/send-otp", {
    email,
  });
};

export const verifyOTP = async (email, otp) => {
  return await api.post("/user/verify-otp", {
    email,
    otp,
  });
};
