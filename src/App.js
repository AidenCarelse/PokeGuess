import "./index.css";

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
  return (
    <div className="menu">
      <div className="labels">
        <h3 className="guessLabelLeft">NAME</h3>
        <h3 className="guessLabelMid">GEN</h3>
        <h3 className="guessLabelMid">EVO. NUM</h3>
        <h3 className="guessLabelRight">TYPE(S)</h3>
      </div>
      <div className="guesses">
        <h3 className="guessLeft">NAME</h3>
        <h3 className="guessMid">GEN</h3>
        <h3 className="guessMid">EVO. NUM</h3>
        <h3 className="guessRight">TYPE(S)</h3>
      </div>
    </div>
  )
}

export default App;