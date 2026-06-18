import React from "react";

export function InputControl({ label, value, field, min, max, step = 1, suffix, dispatchChange }) {
  return (
    <label className="control">
      <span>
        {label}
        <strong>
          {value}
          {suffix}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => dispatchChange(field, Number(event.target.value))}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => dispatchChange(field, Number(event.target.value))}
      />
    </label>
  );
}
