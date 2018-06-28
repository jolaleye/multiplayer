import React from 'react';

import './Controls.css';

const Controls = ({ handleChange, ghost, interpolation }) => (
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
  </div>
);

export default Controls;
