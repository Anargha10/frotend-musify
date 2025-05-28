import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "../pages/ForgotPassword";
import { data } from "react-router-dom";

const server = "https://api.imanargha.shop/user";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  btnLoading: boolean;
  playlist: string[];
  loginUser: (
    email: string,
    password: string,
    navigate: (path: string) => void,
    recaptchaToken:string
  ) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void,
    recaptchaToken:string
  ) => Promise<void>;
  verifyEmail:(code: string)=> Promise<boolean>;
  forgotPassword:(email:string)=>Promise<void>;
  resetPassword:(token:string, password:string)=> Promise<void>
  logoutUser: () => Promise<void>;
  addToPlaylist: (id: string) => void;
 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // 🔐 LOGIN
  async function loginUser(
    email: string,
    password: string,
    navigate: (path: string) => void,
    recaptchaToken: string
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        email,
        password,
        recaptchaToken
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnLoading(false);
    }
  }

  // 📝 REGISTER
  async function registerUser(
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void,
    recaptchaToken: string
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, {
        name,
        email,
        password,
        recaptchaToken
      });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/verify-email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyEmail(
    code: string,
) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/verify-email`, {
        code,
      });
  
      
  
      
      setUser(data.user);
      setIsAuth(true);
      return true;
    
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
      return false
    } finally {
      setBtnLoading(false);
    }
  }
  

  // 🔄 FETCH USER ON LOAD
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
        withCredentials: true,
      });
      console.log("Fetched user:", data);

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("mil gya bahinchod");
    } finally {
      setLoading(false);
    }
  }

 async function forgotPassword(email:string) {
   setBtnLoading(true)
   try {
    const {data}= await axios.post(`${server}/api/v1/forgot-password`,{email})
    toast.success(data.message);
    setBtnLoading(false);

   } catch (error:any) {
    setBtnLoading(false)
    toast.error(error?.response?.data?.message || 'forgot-password failed')
   }
 } 

 async function resetPassword(token:string, password: string) {
  setBtnLoading(true);
  try {
    const {data}= await axios.post(`${server}/api/v1/reset-password/${token}`,{password})
    toast.success(data.message);
    setBtnLoading(false)
  } catch (error:any) {
    setBtnLoading(false)
    toast.error(error?.response?.data?.message || 'reset-password failed' )
  }
 }

  async function logoutUser() {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);

    toast.success("user logged out successfully");
  }

  async function addToPlaylist(id: string) {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
        
      );
      console.log("addToPlaylist response:", data);

      toast.success(data.message);
      fetchUser(); // refresh playlist
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }

 

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuth,
        btnLoading,
        loginUser,
        registerUser,
        logoutUser,
        addToPlaylist,
       forgotPassword,
       resetPassword,
        verifyEmail,
        playlist: user?.playlist || [],
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
