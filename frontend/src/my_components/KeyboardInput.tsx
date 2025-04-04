import { useState, useEffect, useRef } from "react";
import { useKeyboard } from "@/my_components/KeyboardContext";
import { Input } from "@/components/ui/input";
import { KeyboardInputProps } from "@/interface";

export const KeyboardInput = ({
  value,
  onChange,
  maxLength,
  keyboardType = "alphanumeric",
  ...props
}: KeyboardInputProps) => {
  const { showKeyboard, hideKeyboard } = useKeyboard(); // Added hideKeyboard
  const [inputValue, setInputValue] = useState(value?.toString() || "");
  const blurTimeoutRef = useRef<number | null>(null); // Added timeout ref

  const handleFocus = () => {
    // Clear any existing blur timeout
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    showKeyboard(
      inputValue,
      (newValue) => {
        setInputValue(newValue);
        if (onChange) {
          const event = {
            target: { value: newValue },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
      },
      maxLength,
      keyboardType
    );
  };

  const handleBlur = () => {
    // Delay hiding keyboard slightly to detect if another keyboard input was clicked
    blurTimeoutRef.current = window.setTimeout(() => {
      hideKeyboard();
    }, 150);
  };

  // Update local value when prop value changes
  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        window.clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      {...props}
      className={`keyboard-input ${props.className || ""}`}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};
