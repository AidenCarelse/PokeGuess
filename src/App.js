import "./index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

/* VARIABLES */

const NUM_GUESSES = 10;
var CURR_GUESS = 0;

// The correct answer (temp values)
var ANSWER_POKEMON = "Pikachu";
var ANSWER_GENERATION = "I";
var ANSWER_EVOLUTION_STAGE = "II";
var ANSWER_TYPE = "Electric";



/* FUNCTIONS */

function App() {
  return (
    <div className="app">
      <Header/>
      <Search/>
      <Menu/>
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

  // Sumbit a guess when the user presses enter
  const onKeyPress = async (event) => {
    if(event.key == 'Enter') {
      const curr_label = event.target;
      let value =curr_label.value;
      curr_label.value = "";

      curr_label.disabled = true;
      await populateGuess(value, ANSWER_POKEMON);
      await populateGuess(value, ANSWER_GENERATION);
      await populateGuess(value, ANSWER_EVOLUTION_STAGE);
      await populateGuess(value, ANSWER_TYPE);
      curr_label.disabled = false;
    }
  };

  // Fill a guess' value
  async function populateGuess(value, expected) {
    const curr_label = document.getElementsByClassName("guess").item(CURR_GUESS);
    const width = curr_label.offsetWidth;
    const height = curr_label.offsetHeight;
    curr_label.textContent = value;

    const animationDuration = 0.4;
    curr_label.style.transition = "transform "+animationDuration+"s";
    curr_label.style.transform = "rotateX(360deg)";

    curr_label.style.padding = "10px 5px 10px 5px";
    curr_label.style.width = width + "px";
    curr_label.style.height = height + "px";

    setLabelColour(curr_label, value, expected);

    CURR_GUESS++;
    await new Promise(r => setTimeout(() => r(), animationDuration*1000));
  }

  // Set a label's colour based on the guess' correctness
  function setLabelColour(curr_label, value, expected) {
    if(expected.toLowerCase() == value.toLowerCase()) {
      curr_label.style.backgroundColor = "#5be38b"; //yellow: #ffc700
      curr_label.style.color = "black";
    }
    else {
      curr_label.style.color = "white";
    }
  }

  // Return menu form
  return (
    <div className="add-form">
      <h3>Search for Pokemon</h3>
      <input
        type="text"
        placeholder="Pokemon..."
        onChange={(e) => setSearch(e.target.value)}
        className="inputForm"
        onKeyUp={onKeyPress}
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

function Menu() {
  const guesses = Array.from({ length: NUM_GUESSES}, (_, index) => (
    <div className="guessMenu">
      <div className="guess labelLeft">NAME</div>
      <div className="guess labelMid">GEN</div>
      <div className="guess labelMid">EVO. STAGE</div>
      <div className="guess labelRight">TYPE(S)</div>
   </div>
  ));

  return (
    <div className="menu">
      <div className="labelMenu">
        <div className="guessLabel labelLeft">NAME</div>
        <div className="guessLabel labelMid">GEN</div>
        <div className="guessLabel labelMid">EVO. STAGE</div>
        <div className="guessLabel labelRight">TYPE(S)</div>
      </div>
      {guesses}
    </div>
  );
}

export default App;