/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { createContext } from "react";

const CityContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,isLoading:false,
        currentCity: action.payload,
      };

    case "cityCreated":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity:action.payload
      };

    case "cityDeleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
  }
}

function CityProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const URL = "http://localhost:8000/cities";

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(URL);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error with fecthing data",
        });
      }
    }
    fetchCities();
  }, []);

 const getCity=useCallback( async function getCity(id) {
if(id===currentCity.id) return
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${URL}/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error with fecthing data",
      });
    }
  },[currentCity.id]
 )
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${URL}/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cityCreated", payload: data });
    } catch {
      dispatch({
        type: "rejetced",
        payload: "There was an error with fecthing data",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${URL}/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cityDeleted", payload: id });
    } catch {
      dispatch({
        type: "rejetced",
        payload: "There was an error with deleting data",
      });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        // setCities,
        isLoading,
        // setIsLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCity() {
  const context = useContext(CityContext);
  return context;
}

export { useCity, CityProvider };



