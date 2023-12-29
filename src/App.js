import "./index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";
import { Container, Row, Col } from "react-bootstrap";

/* VARIABLES */

var CURR_GUESS = 0;

// The correct answer (temp values)
var ANSWER_POKEMON = "Pikachu";
var ANSWER_GENERATION = "I";
var ANSWER_EVOLUTION_STAGE = "2";
var ANSWER_TYPE = "Electric";

/* FUNCTIONS */

function App() {
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function getEvoStages(data, targetName, current) {
    current++;
    if (data["species"]["name"] == targetName) {
      return JSON.stringify(current);
    }

    for (let i = 0; i < data["evolves_to"].length; i++) {
      var str = getEvoStages(
        JSON.parse(JSON.stringify(data["evolves_to"][i])),
        targetName,
        current
      );

      if (str != null) {
        return str;
      }
    }

    return null;
  }

  const handleSearch = async (query) => {
    var pokemonName;
    setIsLoading(true);

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then((res) => {
        // Use the updated name here
        pokemonName = res.data.name;

        populateGuess(
          pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1),
          ANSWER_POKEMON,
          0
        );

        var type = res.data.types[0].type.name;
        type = type.charAt(0).toUpperCase() + type.slice(1);
        if (res.data.types.length == 2) {
          const type2 = res.data.types[1].type.name;
          type += "/" + type2.charAt(0).toUpperCase() + type2.slice(1);
        }

        populateGuess(type, ANSWER_TYPE, 3);

        return axios.get(`https://pokeapi.co/api/v2/pokemon-species/${query}`);
      })

      .then((speciesRes) => {
        const genName = speciesRes.data.generation.name;
        const sliceName = genName.slice(11).toUpperCase();
        populateGuess(sliceName, ANSWER_GENERATION, 1);

        return axios.get(speciesRes.data.evolution_chain.url);
      })
      .then((evoRes) => {
        const evolutionStage = getEvoStages(
          JSON.parse(JSON.stringify(evoRes.data))["chain"],
          pokemonName,
          0
        );
        populateGuess(evolutionStage, ANSWER_EVOLUTION_STAGE, 2);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            setErrors("Pokemon not found");
            console.log("Pokemon not found");
            setTrigger(true);
          }
        }
        setTrigger(false);

        console.error(err);
        console.log(err.message);

        <p>This pokemon does not exist</p>;
      })
      .finally(() => {
        setIsLoading(false);
      });

    setErrors();

    //setTrigger(false);
  };

  async function setLabelColour(curr_label, value, expected, isTypes) {
    if (expected.toLowerCase() === value.toLowerCase()) {
      curr_label.style.backgroundColor = "#5be38b";
      curr_label.style.color = "black";
      return;
    } else if (isTypes) {
      var valueTypes = value.split("/");
      var expectedTypes = expected.split("/");

      for (var i = 0; i < expectedTypes.length; i++) {
        for (var j = 0; j < valueTypes.length; j++) {
          if (expectedTypes[i].toLowerCase() === valueTypes[j].toLowerCase()) {
            curr_label.style.backgroundColor = "#ffc700";
            curr_label.style.color = "black";
            return;
          }
        }
      }
    }

    curr_label.style.color = "white";
  }

  // Fill a guess' value
  const populateGuess = (value, expected, index, errors) => {
    const curr_label = document
      .getElementsByClassName("guess real")
      .item((CURR_GUESS - 1) * 4 + index);

    if (curr_label) {
      const width = curr_label.offsetWidth;
      const height = curr_label.offsetHeight;
      curr_label.textContent = value;

      const animationDuration = 0.4;
      curr_label.style.transition = "transform " + animationDuration + "s";
      curr_label.style.transform = "rotateX(360deg)";

      curr_label.style.padding = "10px 5px 10px 5px";
      curr_label.style.width = width + "px";
      curr_label.style.height = height + "px";

      setLabelColour(curr_label, value, expected, index == 3);

      new Promise((r) => setTimeout(() => r(), animationDuration * 1000));
    } else {
      console.error("curr_label is null");
      return;
    }
  };

  return (
    <div className="app">
      <Header />
      <Search
        setSearch={setSearch}
        search={search}
        onSearch={handleSearch}
        handleSearch={handleSearch}
        errors={errors}
        trigger={trigger}
        setTrigger={setTrigger}
        setErrors={setErrors}
        isLoading={isLoading}
      />
      <Menu />
    </div>
  );
}

function Header() {
  // Show the instructions
  function showInstructions() {
    document.getElementById("instructions").style.visibility = "visible";
  }

  // Hide the instructions
  function hideInstructions() {
    document.getElementById("instructions").style.visibility = "hidden";
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
        <p className="closeButton" onClick={() => hideInstructions()}>
          ✖
        </p>
        <h5 className="title">HOW TO PLAY</h5>
        <p className="instructionText">
          • Guess the mystery pokemon in 10 guesses!
        </p>
        {greenExample}
        <p className="instructionText">• Green means a correct match.</p>
        {yellowExample}
        <p className="instructionText">
          • Yellow in the 'types' column means you have at least one type
          correct (Eg: guess has ice/water, answer is water/rock).<br></br>
          <br></br>• You can change which generations the mystery pokemon is
          chosen from.
        </p>
        <button
          className="instructionsButton"
          onClick={() => hideInstructions()}
        >
          PLAY!
        </button>
      </div>
    </div>
  );

  // Return header & instructions form
  return (
    <div className="logo">
      <div className="horizontalDiv">
        <img src="images/pokeball.png" className="headerImageLeft" />
        <h1 className="redText">Poké</h1>
        <h1>Guess</h1>
        <img
          src="images/questionmark.png"
          className="headerImageRight"
          onClick={() => showInstructions()}
        />
        {instructions}
      </div>
      <p className="authors">BY AIDEN AND WILSON</p>
    </div>
  );
}

function Search({
  search,
  setSearch,
  submitGuess,
  handleSearch,
  errors,
  setTrigger,
  trigger,
  setErrors,
  isLoading,
}) {
  const [name, setName] = useState([]);
  const [empty, setEmpty] = useState();
  /*const [search, setSearch] = useState("");*/

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000").then((res) => {
      setName(res.data.results);
    });
  }, []);

  // Submit a guess
  async function submitGuess() {
    const input = document.getElementById("searchBar");
    let value = input.value.toLowerCase();
    input.value = "";
    await setSearch(value);
    await handleSearch(value);

    if (search.trim().length === 0) {
      setEmpty("Please enter a pokemon");
    } else {
      setEmpty();

      if (value.trim().length > 0) {
        CURR_GUESS++;
        document.getElementById("counter").textContent = CURR_GUESS + " of 10";
      }
    }
  }

  // Call submit guess button when user presses enter
  const onKeyPress = async (event) => {
    if (event.key === "Enter") {
      await submitGuess();
    }
  };

  // Set a label's colour based on the guess' correctness

  // Handle the selection of a drop down menu item
  const menuItemSelected = (event) => {
    const input = document.getElementById("searchBar");
    input.value = event.target.textContent;
    setSearch(event.target.textContent);
  };

  // Return menu form
  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <div className="add-form">
            <h2 className="menuItem">Guess the mystery Pokemon!</h2>
            <div className="horizontalDiv">
              <input
                type="text"
                placeholder="Guess Pokemon..."
                onChange={(e) => setSearch(e.target.value)}
                className="inputForm"
                onKeyUp={onKeyPress}
                id="searchBar"
                spellCheck="false"
              ></input>

              <h2 className="counter" id="counter">
                0 of 10
              </h2>
              <button
                className="guessButton"
                onClick={submitGuess}
                disabled={isLoading}
              >
                GUESS
              </button>
            </div>

            <div className="dropDown">
              {name
                .filter((item) => {
                  if (search === "") {
                    return !item;
                  } else if (
                    item.name.toLowerCase().includes(search.toLowerCase()) &&
                    item.name.toLowerCase() != search.toLowerCase()
                  ) {
                    return item;
                  }
                })
                .map((item) => {
                  return (
                    <h2 className="menuItem" onClick={menuItemSelected}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </h2>
                  );
                })}
            </div>

            <div className="error">
              {
                //trigger === true && errors
                errors
              }
              {
                //trigger === 1 && errors
                empty
              }
            </div>
            {/* <div className="error">{errors && "This Pokemon does not exist"}</div>}*/}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function Menu() {
  const guesses = Array.from({ length: 10 }, (_, index) => (
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
