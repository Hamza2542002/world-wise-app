import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  isAuth: false,
  user: null,
  users: [],
  errorMessage: "",
  waiting: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "users/loaded":
      return {
        ...state,
        users: action.payload,
      };
    case "error":
      return {
        ...state,
        errorMessage: action.payload,
        isAuth: false,
      };
    case "user/logedin":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
      };
    case "user/created":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
      };
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuth: false,
      };
    case "waiting":
      return {
        ...state,
        waiting: action.payload,
      };
    default:
      break;
  }
}
function AuthProvider({ children }) {
  const [{ isAuth, user, errorMessage, waiting }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        const res = await fetch("http://localhost:8088/api/users/login");
        const data = await res.json();
        dispatch({ type: "users/loaded", payload: data });
      } catch {}
    }
    fetchCities();
  }, []);

  async function signup(user) {
    dispatch({ type: "error", payload: "" });
    dispatch({ type: "waiting", payload: true });

    try {
      const res = await fetch("http://localhost:8088/api/users/register", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.message === "User has registered successfully!") {
        const res2 = await fetch(`http://localhost:8088/api/users/${data.id}`);
        const user = await res2.json();
        dispatch({
          type: "user/created",
          payload: user,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    } finally {
      dispatch({ type: "waiting", payload: false });
    }
  }

  async function login(user) {
    dispatch({ type: "error", payload: "" });
    dispatch({ type: "waiting", payload: true });
    try {
      const res = await fetch("http://localhost:8088/api/users/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.message === "User logged in successfully!") {
        const res2 = await fetch(`http://localhost:8088/api/users/${data.id}`);
        const user = await res2.json();
        dispatch({
          type: "user/logedin",
          payload: user,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    } finally {
      dispatch({ type: "waiting", payload: false });
    }
  }

  function logout() {
    if (isAuth) dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        waiting,
        user,
        isAuth,
        errorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) return;
  return context;
}

export { AuthProvider, useAuth };
