// MarkdownResponse.tsx
import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownResponseProps {
  response: string;
}

const MarkdownResponse: React.FC<MarkdownResponseProps> = ({ response }) => {
  // Optionally, clean up or modify the text here (e.g., remove tabs)
  const cleanedResponse = response.replace(/\t/g, "  ");

  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
      <ReactMarkdown
        components={{
          pre: ({ node, ...props }) => (
            <pre
              className="overflow-x-auto my-2 p-2 bg-gray-900 rounded text-white"
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-gray-900 px-1 py-0.5 rounded text-white"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-200 underline" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-6 my-2 text-white marker:text-white"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 my-2 text-white marker:text-white"
              style={{ listStylePosition: "outside" }}
              {...props}
            />
          ),
          li: ({ node, children, ...props }) => (
            <li
              className="my-1.5 text-white leading-normal"
              style={{ display: "list-item", paddingLeft: "0.5rem" }}
              {...props}
            >
              <span className="align-baseline">{children}</span>
            </li>
          ),
        }}
      >
        {cleanedResponse}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownResponse;
