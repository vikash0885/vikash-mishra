import React from 'react';
import './Spinner.css';

const Spinner = ({ fullPage = true, text = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="spinner-overlay">
        <div className="spinner-container">
          <div className="pizza-spinner"></div>
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-container inline">
      <div className="pizza-spinner small"></div>
      {text && <span className="spinner-text small">{text}</span>}
    </div>
  );
};

export default Spinner;
