import { KeyboardContextProps } from "@/interface";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const KeyboardContext = createContext<KeyboardContextProps | undefined>(
  undefined
);

export const KeyboardProvider = ({ children }: { children: ReactNode }) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [onChangeCallback, setOnChangeCallback] = useState<
    ((value: string) => void) | null
  >(null);
  const [keyboardType, setKeyboardType] = useState<
    "numeric" | "alphanumeric" | "email"
  >("alphanumeric");
  const [layoutName, setLayoutName] = useState("default");
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Calculate keyboard height - adjust these values based on your keyboard size
  const keyboardHeight = 600; // Approximate height in pixels

  // Store height in state to allow animation
  const [contentPadding, setContentPadding] = useState(0);

  // Update padding when keyboard visibility changes
  useEffect(() => {
    if (isKeyboardVisible) {
      setContentPadding(keyboardHeight);
    } else {
      setContentPadding(0);
    }
  }, [isKeyboardVisible]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!isKeyboardVisible) return;

      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(e.target as Node)
      ) {
        const isKeyboardInput = (e.target as HTMLElement).classList.contains(
          "keyboard-input"
        );

        if (!isKeyboardInput) {
          hideKeyboard();
        }
      }
    };

    if (isKeyboardVisible) {
      document.addEventListener("mousedown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isKeyboardVisible]);

  const getKeyboardLayout = (type: "numeric" | "alphanumeric" | "email") => {
    switch (type) {
      case "numeric":
        return {
          default: ["1 2 3", "4 5 6", "7 8 9", "{clear} 0 {bksp}"],
          shift: [], // Add empty arrays for consistency
          numeric: [],
        };
      case "email":
        return {
          default: [
            "` 1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m",
            "{shift} @ . {bksp}",
          ],
          shift: [
            "` 1 2 3 4 5 6 7 8 9 0",
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "Z X C V B N M",
            "{shift} @ . {bksp}",
          ],
          numeric: [], // Add empty array for consistency
        };
      case "alphanumeric":
        return {
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "q w e r t y u i o p [ ] \\",
            "a s d f g h j k l ; '",
            "{shift} z x c v b n m , . / {shift}",
            ".com @ {space}",
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "Q W E R T Y U I O P { } |",
            'A S D F G H J K L : "',
            "{shift} Z X C V B N M < > ? {shift}",
            ".com @ {space}",
          ],
          numeric: [], // Add empty array for consistency
        };
      default:
        return {
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; '",
            "{shift} z x c v b n m , . / {shift}",
            ".com @ {space}",
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} A S D F G H J K L : "',
            "{shift} Z X C V B N M < > ? {shift}",
            ".com @ {space}",
          ],
          numeric: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {bksp}"],
        };
    }
  };

  const showKeyboard = (
    inputValue: string,
    onChange: (value: string) => void,
    maxLen?: number,
    type: "numeric" | "alphanumeric" | "email" = "alphanumeric"
  ) => {
    setCurrentValue(inputValue);
    setOnChangeCallback(() => onChange);
    setMaxLength(maxLen);
    setKeyboardType(type);
    setIsKeyboardVisible(true);

    // Add a slight delay to ensure the DOM has updated before scrolling
    setTimeout(() => {
      // Find the active element (input that triggered the keyboard)
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.classList.contains("keyboard-input")) {
        // Scroll the element into view with some extra padding at the top
        activeElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  const hideKeyboard = () => {
    setIsKeyboardVisible(false);
    setOnChangeCallback(null);
  };

  const handleKeyPress = (button: string) => {
    if (!onChangeCallback) return;

    // Handle special keys
    if (button === "{shift}") {
      // Toggle between default and shift layouts
      setLayoutName(layoutName === "default" ? "shift" : "default");
      return;
    } else if (button === "{abc}") {
      // Switch to default layout from numeric
      setLayoutName("default");
      return;
    }

    // Handle other keys
    let newValue = currentValue;

    if (button === "{bksp}") {
      newValue = currentValue.slice(0, -1);
    } else if (button === "{clear}") {
      newValue = "";
    } else if (button === "{space}") {
      newValue = currentValue + " ";
    } else if (maxLength === undefined || currentValue.length < maxLength) {
      newValue = currentValue + button;
    }

    setCurrentValue(newValue);
    onChangeCallback(newValue);
  };

  return (
    <KeyboardContext.Provider
      value={{ showKeyboard, hideKeyboard, isKeyboardVisible }}
    >
      {/* Wrap children in a div with dynamic padding */}
      <div
        style={{ paddingBottom: contentPadding, transition: "padding 0.3s" }}
      >
        {children}
      </div>

      {isKeyboardVisible && (
        <div
          ref={keyboardRef}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background p-2 border-t shadow-lg"
          style={{ height: `${keyboardHeight}px` }} // Set explicit height
          onMouseDown={(e) => {
            // Prevent blur events from bubbling up when clicking the keyboard
            e.preventDefault();
          }}
        >
          <div className="flex justify-end mb-1">
            <button
              onClick={() => hideKeyboard()}
              className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded"
            >
              Close Keyboard
            </button>
          </div>
          <Keyboard
            layout={getKeyboardLayout(keyboardType)}
            layoutName={layoutName} // Use the state variable here
            onKeyPress={handleKeyPress}
            theme="hg-theme-default"
            display={{
              "{bksp}": "⌫",
              "{clear}": "Clear",
              "{space}": "␣",
              "{shift}": "⇧",
              "{abc}": "ABC",
              ".com": ".com",
            }}
            // Always use light mode styling
            buttonAttributes={[
              {
                attribute: "style",
                value:
                  "color: black; font-size: 24px; background-color: #f0f0f0; height: 110px; border-color: black;",
                buttons:
                  "a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 {bksp} {clear} {space} {shift} {abc} .com ` ~ ! @ # $ % ^ & * ( ) - = _ + [ ] { } \\ | ; : ' \" , < . > / ?", // Add this line to specify which buttons to apply the style to
              },
            ]}
          />
        </div>
      )}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
};
