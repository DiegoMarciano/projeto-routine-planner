import { useState, useEffect } from "react";
import "./components/Header.jsx";
import { WeekDays } from "./components/Header.jsx";
import TodoComponent from "./components/TodoComponent.jsx";
import MainHeader from "./components/MainHeader.jsx";

function App() {
  const [background, setBackground] = useState(
    localStorage.getItem("background") || null
  );
  const [selectedDay, setSelectedDay] = useState("Segunda");

  useEffect(() => {
    if (background) {
      document.body.style.backgroundImage = `url(${background})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  }, [background]);

  const handleChooseBackground = () => {
    document.querySelector("#backgroundInput").click();
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackground(imageUrl);

      localStorage.setItem("background", imageUrl);

      document.body.style.backgroundImage = `url(${imageUrl})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  };

  return (
    <>
      <MainHeader onChooseBackground={handleChooseBackground} />
      <WeekDays onSelectDay={setSelectedDay} />
      <TodoComponent selectedDay={selectedDay} />
      <input
        id="backgroundInput"
        type="file"
        accept="image/*"
        hidden
        onChange={handleBackgroundChange}
      />
    </>
  );
}

export default App;
