import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useAuth } from "./FakeAuthContext";

const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
        currentCity: {},
      };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: action.payload,
        currentCity: {},
        isLoading: false,
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      break;
  }
}
const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};
function CitiesProvider({ children }) {
  const { user } = useAuth() ?? {};

  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(
            `http://localhost:8088/api/users/${user?.id}/cities`
          );
          const data = await res.json();
          dispatch({ type: "cities/loaded", payload: data });
        } catch {
          dispatch({ type: "rejeted", payload: "Cannot Fetch data" });
        }
      }
      if (!user || user.id === undefined) return;
      fetchCities();
    },
    [user]
  );

  const getCurrentCity = useCallback(
    async function getCurrentCity(name) {
      if (name === currentCity.cityName) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(
          `http://localhost:8088/api/users/${user?.id}/cities/${name}`
        );
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: `Error Fetching City ${name}`,
        });
      }
    },
    [currentCity.cityName, user]
  );

  async function postCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(
        `http://localhost:8088/api/users/${user?.id}/cities`,
        {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await res.json();
      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({ type: "rejected", payload: "Error Adding City" });
    }
  }

  async function deleteCity(name) {
    dispatch({ type: "loading" });
    try {
      user.cities.filter((city) => city.id !== name);
      await fetch(
        `http://localhost:8088/api/users/${user?.id}/cities/${name}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await fetch(
        `http://localhost:8088/api/users/${user?.id}/cities`
      );
      const data = await res.json();
      dispatch({ type: "city/deleted", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: `Error Deleting City ${name}` });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCurrentCity,
        postCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) return;
  return context;
}

export { useCities, CitiesProvider };
