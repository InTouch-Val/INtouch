import React from "react";

export default function FilterDropDown() {
  const [filterType, setFilterType] = React.useState("all");

  const [filterLanguage, setFilterLanguage] = React.useState("all");
  const [sortMethod, setSortMethod] = React.useState("date_asc");

  const handleSortMethodChange = (e) => {
    setSortMethod(e.target.value);
  };

  return (
    <div className="filter-dropdowns">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="lesson">Lesson</option>
        <option value="exercise">Exercise</option>
        <option value="metaphor">Essay</option>
        <option value="study">Study</option>
        <option value="quiz">Quiz</option>
        <option value="methology">Methodology</option>
        <option value="metaphor">Metaphors</option>
      </select>

      <select
        value={filterLanguage}
        onChange={(e) => setFilterLanguage(e.target.value)}
      >
        <option value="all">All Languages</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="ge">German</option>
        <option value="it">Italian</option>
      </select>
      <select value={sortMethod} onChange={(e) => handleSortMethodChange(e)}>
        <option value="date_asc">Date Created ↑</option>
        <option value="date_desc">Date Created ↓</option>
        <option value="popularity_asc">Popularity ↑</option>
        <option value="popularity_desc">Popularity ↓</option>
      </select>
    </div>
  );
}
