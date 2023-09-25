import "./index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

/* VARIABLES */

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

  // Show the instructions
  function showInstructions() {
    document.getElementById("instructions").style.visibility = 'visible';
  }

  // Hide the instructions
  function hideInstructions() {
    document.getElementById("instructions").style.visibility = 'hidden';
  }

  // Correct instructions example
  const greenExample = (
    <div className="guessMenu">
      <div className="guess labelLeft">NAME</div>
      <div className="guess labelMid correct">GEN</div>
      <div className="guess labelMid correct">EVO. STAGE</div>
      <div className="guess labelRight">TYPE(S)</div>
    </div>
  );

  // Partial instructions example
  const yellowExample = (
    <div className="guessMenu">
      <div className="guess labelLeft">NAME</div>
      <div className="guess labelMid">GEN</div>
      <div className="guess labelMid">EVO. STAGE</div>
      <div className="guess labelRight partial">TYPE(S)</div>
    </div>
  );

  // Instructions popup
  const instructions = (
    <div className="shadowBackground" id="instructions">
    <div className="instructions">
      <p className="closeButton" onClick={() => hideInstructions()}>✖</p>
      <h5 className="title">HOW TO PLAY</h5>
      <p className="instructionText">• Guess the mystery pokemon in 10 guesses!</p>
      {greenExample}
      <p className="instructionText">• Green means a correct match.</p>
      {yellowExample}
      <p className="instructionText">
        • Yellow in the 'types' column means you have at least one type correct (Eg: guess has ice/water, answer is water/rock).<br></br><br></br>
        • You can change which generations the mystery pokemon is chosen from.</p>
      <button className="instructionsButton" onClick={() => hideInstructions()}>PLAY!</button>
    </div>
  </div>
  );

  // Return header & instructions form
  return (
    <div className="logo">
      <div className="horizontalDiv">
        <img src="images/pokeball.png" className="headerImageLeft"/>
        <h1 className="redText">Poké</h1>
        <h1>Guess</h1>
        <img src="images/questionmark.png" className="headerImageRight" onClick={() => showInstructions()}/>
        {instructions}
      </div>
      <p className="authors">BY AIDEN AND WILSON</p>
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
    document.getElementById("counter").textContent = CURR_GUESS +" of 10";

    input.disabled = true;
    await populateGuess(value, ANSWER_POKEMON, 0);
    await populateGuess(value, ANSWER_GENERATION, 1);
    await populateGuess(value, ANSWER_EVOLUTION_STAGE, 2);
    await populateGuess(value, ANSWER_TYPE, 3);
    input.disabled = false;
  }

  // Fill a guess' value
  async function populateGuess(value, expected, index) {
    const curr_label = document.getElementsByClassName("guess real").item((CURR_GUESS-1)*4+index);
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
      <h2 className="menuItem">Guess the mystery Pokemon!</h2>
      <div className="horizontalDiv">
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
  const guesses = Array.from({ length: 10}, (_, index) => (
    <div className="guessMenu">
      <div className="guess labelLeft real">NAME</div>
      <div className="guess labelMid real">GEN</div>
      <div className="guess labelMid real">EVO. STAGE</div>
      <div className="guess labelRight real">TYPE(S)</div>
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