import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { CopyButtonProps } from "@/interface";

const CopyButton = ({
  text,
  className = "",
  onCopy,
  size,
  variant,
}: CopyButtonProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  size = "icon";
  variant = "ghost";
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      toast.success("Text copied to clipboard");

      if (onCopy) {
        onCopy();
      }

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("There's an error copying the text");
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      {hasCopied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
    </Button>
  );
};

export default CopyButton;
