import "./MainHeader.css";

function MainHeader({ onChooseBackground }) {
  return (
    <header className="main-header">
      <nav className="main-header-menu">
        <button onClick={onChooseBackground}>Escolher Background</button>
      </nav>
      <div className="logo">Routine Planner</div>
    </header>
  );
}

export default MainHeader;
