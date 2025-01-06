import { useEffect, useReducer, useState } from "react";

const FETCH_INIT = " FETCH_INIT";
const FETCH_SUCCESS = "FETCH_SUCCESS";
const FETCH_FAILURE = "FETCH_SUCCESS";
const FILTERED_DATA = "FILTERED_DATA";

const initialState = {
  data: null,
  filteredData: null,
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_INIT:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        filteredData: action.payload,
      };
    case FETCH_FAILURE:
      return { ...state, loading: false, error: action.error };
    case FILTERED_DATA:
      return {
        ...state,
        filteredData: state.data.filter((item) =>
          item.title.toLowerCase().includes(action.payload.toLowerCase())
        ),
      };
    default:
      throw new Error(`Unkoun action type: ${action.type}`);
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    dispatch({ type: FETCH_INIT });

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      dispatch({ type: FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_FAILURE, error: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value)
    dispatch({type: FILTERED_DATA, payload: value})
  }

  return (
    <div className="App">
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      <input
      type='text'
      placeholder="search"
      value={search}
      onChange={handleSearch}
      />
      {state.filteredData && (
        <ul>
          {state.filteredData.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
      <button onClick={fetchData} disabled={state.loading}>
        Fetch
      </button>
    </div>
  );
}

export default App;
