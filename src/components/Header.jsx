import React from "react";
import "./Header.css";

export const WeekDays = ({ onSelectDay }) => {
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  return (
    <nav className="nav-container">
      {days.map((day) => (
        <a key={day} onClick={() => onSelectDay(day)}>
          {day}
        </a>
      ))}
    </nav>
  );
};
