import "./index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  return (
    <div className="app">
      <Header />
      <Search />
    </div>
  );
}

function Header() {
  return (
    <div className="logo">
      <h1>PokeGuess</h1>
      <p>By Aiden and Wilson</p>
    </div>
  );
}

function Search() {
  const [name, setName] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=600").then((res) => {
      setName(res.data.results);
    });
  }, []);
  return (
    <div className="add-form">
      <h3>Search for Pokemon</h3>
      <input
        type="text"
        placeholder="Pokemon..."
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      <div>
        {name
          .filter((item) => {
            if (search === "") {
              return !item;
            } else if (item.name.toLowerCase().includes(search.toLowerCase())) {
              return item;
            }
          })
          .map((item) => {
            return <h2>{item.name}</h2>;
          })}
      </div>
    </div>
  );
}

export default App;
// Test
