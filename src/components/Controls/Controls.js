import React from 'react';

import './Controls.css';

const Controls = ({ handleChange, ghost, interpolation, prediction, reconciliation }) => (
  <div className="controls">
    <span className="header">Controls</span>
    <label className="checkbox">
      <input type="checkbox" name="ghost" checked={ghost}
        onChange={handleChange} /> Ghost
    </label>
    <label className="checkbox">
      <input type="checkbox" name="interpolation" checked={interpolation}
        onChange={handleChange} /> Interpolation
    </label>
    <label className="checkbox">
      <input type="checkbox" name="prediction" checked={prediction}
          onChange={handleChange} /> Prediction
    </label>
    <label className="checkbox">
      <input type="checkbox" name="reconciliation" checked={reconciliation}
          onChange={handleChange} /> Reconciliation
    </label>
  </div>
);

export default Controls;
