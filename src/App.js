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

  // Call submit guess button when user presses enter
  const onKeyPress = async (event) => {
    if(event.key == 'Enter') {
      submitGuess();
    }
  };

  // Submit a guess
  async function submitGuess() {
    const input =  document.getElementById("searchBar");
    let value = input.value;
    input.value = "";
    setSearch("");

    CURR_GUESS++;
    document.getElementById("counter").textContent = CURR_GUESS +" of "+NUM_GUESSES;

    input.disabled = true;
    await populateGuess(value, ANSWER_POKEMON, 0);
    await populateGuess(value, ANSWER_GENERATION, 1);
    await populateGuess(value, ANSWER_EVOLUTION_STAGE, 2);
    await populateGuess(value, ANSWER_TYPE, 3);
    input.disabled = false;
  }

  // Fill a guess' value
  async function populateGuess(value, expected, index) {
    const curr_label = document.getElementsByClassName("guess").item((CURR_GUESS-1)*4+index);
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

  // Handle the selection of a drop down menu item
  const menuItemSelected = (event) => {
    const input = document.getElementById("searchBar");
    input.value = event.target.textContent;
    setSearch(event.target.textContent);
  }

  // Return menu form
  return (
    <div className="add-form">
      <h2 className="menuItem">Guess today's mystery Pokemon!</h2>
      <div className="searchDiv">
        <input type="text" placeholder="Guess Pokemon..." onChange={(e) => setSearch(e.target.value)}
          className="inputForm" onKeyUp={onKeyPress} id="searchBar" spellCheck="false">
        </input>
        <h2 className="counter" id="counter">0 of 10</h2>
        <button className="guessButton" onClick={() => submitGuess()}>GUESS</button>
      </div>
      <div className="dropDown" >
        {name.filter((item) => {
            if (search === "") {
              return !item;
            } else if (item.name.toLowerCase().includes(search.toLowerCase()) && item.name.toLowerCase() != search.toLowerCase()) {
              return item;
            }
          })
          .map((item) => {
            return (
              <h2 className="menuItem" onClick={menuItemSelected}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </h2>);
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