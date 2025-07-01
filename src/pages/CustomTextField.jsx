// CustomTextField.jsx
import React, { useState } from 'react';
import { TextField } from '@mui/material';

// A helper function that computes the dynamic color based on the input's value, focus, and touched state.
const getDynamicColor = (value, focused, touched) => {
  if (!touched) return "white"; // not interacted with yet → white
  if (focused) {
    return value && value.length > 0 ? "green" : "blue"; // focused: nonempty → green, empty → blue
  }
  return value && value.length > 0 ? "green" : "red"; // unfocused: nonempty → green, empty → red
};

export default function CustomTextField({ label, name, value, onChange, ...rest }) {
  // Local state to track whether this field is focused and/or has been touched.
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  // When the field is focused, mark it as touched (if not already) and set focused state.
  const handleFocus = () => {
    if (!touched) {
      setTouched(true);
    }
    setFocused(true);
  };

  // On blur, simply unset the focused state.
  const handleBlur = () => {
    setFocused(false);
  };

  // Calculate the dynamic color for the label and the border.
  const dynamicColor = getDynamicColor(value, focused, touched);

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      fullWidth
      required
      {...rest}
      sx={{
        backgroundColor: "transparent",
        borderRadius: "8px",
        // Style the label: color is dynamic; remove any unwanted text decoration.
        "& .MuiInputLabel-root": {
          color: dynamicColor,
          textDecoration: "none !important",
        },
        // Style the outlined input border.
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: dynamicColor,
          },
          "&:hover fieldset": {
            borderColor: "#007bff",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#007bff",
          },
        },
        // Ensure input text is white.
        "& .MuiInputBase-input": {
          color: "#fff",
        },
        // Ensure the placeholder text remains white with full opacity.
        "& .MuiInputBase-input::placeholder": {
          color: "#fff",
          opacity: 1,
        },
      }}
    />
  );
}
