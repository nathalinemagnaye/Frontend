import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    gender: "",
    part_time_job: false,
    absence_days: 0,
    extracurricular_activities: false,
    weekly_self_study_hours: 0,
    math_score: 0,
    history_score: 0,
    physics_score: 0,
    chemistry_score: 0,
    biology_score: 0,
    english_score: 0,
    geography_score: 0,
  });

  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the backend.");
    }
  };

  return (
    <div className="App">
      <h1>Career Aspiration Predictor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>

        <label>
          Part-time Job:
          <input
            type="checkbox"
            name="part_time_job"
            checked={formData.part_time_job}
            onChange={handleChange}
          />
        </label>

        <label>
          Extracurricular Activities:
          <input
            type="checkbox"
            name="extracurricular_activities"
            checked={formData.extracurricular_activities}
            onChange={handleChange}
          />
        </label>

        {[
          "absence_days",
          "weekly_self_study_hours",
          "math_score",
          "history_score",
          "physics_score",
          "chemistry_score",
          "biology_score",
          "english_score",
          "geography_score",
        ].map((field) => (
          <label key={field}>
            {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </label>
        ))}

        <button type="submit">Predict</button>
      </form>

      {prediction && <p className="result">Predicted Career: {prediction}</p>}
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}

export default App;
