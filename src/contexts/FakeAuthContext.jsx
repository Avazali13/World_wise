/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

const FAKE_USER = {
    name: "Avazali",
    email: "avazali@example.com",
    password: "0131",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error('UNKNOWN ACTION')
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email,password) {
if(email===FAKE_USER.email && password===FAKE_USER.password){
    dispatch({type:'login',payload:FAKE_USER})
}
  }

  function logout() {
    dispatch({type:'logout'})
  }

  return <AuthContext.Provider value={{login,logout,user,isAuthenticated}}>  {children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Autcontds errir da brat ne deyime");
  return context;
}

export {AuthProvider,useAuth} 