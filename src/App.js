import "./index.css";

const NUM_GUESSES = 10;

function App() {
  return (
    <div className="app">
      <Header />
      <Search />
      <Menu />
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
  return (
    <div className="add-form">
      <h3>Search for Pokemon</h3>
      <input type="text" placeholder="Pokemon..."></input>
    </div>
  );
}

function Menu() {
  const guesses = Array.from({ length: NUM_GUESSES}, (_, index) => (
    <div className="guessMenu">
      <h3 className="guess labelLeft">NAME</h3>
      <h3 className="guess labelMid">GEN</h3>
      <h3 className="guess labelMid">EVO. NUM</h3>
      <h3 className="guess labelRight">TYPE(S)</h3>
   </div>
  ));

  return (
    <div className="menu">
      <div className="labelMenu">
        <h3 className="guessLabel labelLeft" id="12345">NAME</h3>
        <h3 className="guessLabel labelMid">GEN</h3>
        <h3 className="guessLabel labelMid">EVO. NUM</h3>
        <h3 className="guessLabel labelRight">TYPE(S)</h3>
      </div>
      {guesses}
    </div>
  );
}

export default App;