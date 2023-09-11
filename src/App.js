import "./index.css";

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
  return (
    <div className="add-form">
      <h3>Search for Pokemon</h3>
      <input type="text" placeholder="Pokemon..."></input>
    </div>
  );
}

export default App;
// Test
