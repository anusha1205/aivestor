import React, { useState } from "react";
import { FaCalculator, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../css/globeconvert.css"; // Import the CSS file

const GlobeConvert = () => {
  // State variables for user inputs
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [contributions, setContributions] = useState("");
  const [compoundFrequency, setCompoundFrequency] = useState("");
  const [inflationRate, setInflationRate] = useState(4); // Default inflation rate
  const [results, setResults] = useState(null);

  // Investment calculation function
  const calculateInvestment = () => {
    const interestRate = rate / 100;
    const inflationDecimal = inflationRate / 100;
    const n = parseInt(compoundFrequency); // Compounding frequency
    const t = parseInt(years); // Number of years

    // Calculate the future value of the principal
    const futureValuePrincipal = principal * (1 + interestRate / n) ** (n * t);

    // Calculate the future value of periodic contributions
    const futureValueContributions =
      contributions *
      (((1 + interestRate / n) ** (n * t) - 1) / (interestRate / n));

    // Total future value before inflation adjustment
    const futureValue = futureValuePrincipal + futureValueContributions;

    // Adjust for inflation to get the real value
    const realValue = futureValue / (1 + inflationDecimal) ** t;

    // Update the results
    setResults({
      futureValue: futureValue.toFixed(2),
      realValue: realValue.toFixed(2),
      inflationRate,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateInvestment(); // Calculate investment directly
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>AIvestor</h1>
        <h1 className="title">Global Investment Calculator</h1>
        <p className="subtitle">
          Plan your financial future with insights powered by AIML.
        </p>
      </header>

      {/* Calculator Form */}
      <div className="calculator">
        <form onSubmit={handleSubmit} className="form">
          <div className="inputGroup">
            <label className="label" htmlFor="principal">
              Enter Initial Investment (₹):
            </label>
            <input
              type="number"
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Enter amount"
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="rate">
              Enter Annual Interest Rate (%):
            </label>
            <input
              type="number"
              id="rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter interest rate"
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="years">
              Enter Number of Years:
            </label>
            <input
              type="number"
              id="years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="Enter number of years"
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="contributions">
              Enter Monthly Contributions (₹):
            </label>
            <input
              type="number"
              id="contributions"
              value={contributions}
              onChange={(e) => setContributions(e.target.value)}
              placeholder="Enter monthly contributions"
              className="input"
              required
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="compound-frequency">
              Enter Compounding Frequency (1 for annually, 12 for monthly):
            </label>
            <input
              type="number"
              id="compound-frequency"
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value)}
              placeholder="Compounding frequency"
              className="input"
              required
            />
          </div>
          <button type="submit" className="button">
            <FaCalculator style={{ marginRight: "8px" }} />
            Calculate Investment
          </button>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="results">
          <h2 className="resultsTitle">Results</h2>
          <p className="resultText">
            Future Value (Nominal): ₹{results.futureValue}
          </p>
          <p className="resultText">
            Future Value (Real, adjusted for inflation): ₹{results.realValue}
          </p>
          <p className="resultText">
            Current Inflation Rate: {results.inflationRate}%
          </p>
          <p className="note">
            <FaArrowUp style={{ color: "green", marginRight: "4px" }} /> Positive
            change indicates growth.
          </p>
          <p className="note">
            <FaArrowDown style={{ color: "red", marginRight: "4px" }} /> Negative
            change indicates a decline.
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobeConvert;