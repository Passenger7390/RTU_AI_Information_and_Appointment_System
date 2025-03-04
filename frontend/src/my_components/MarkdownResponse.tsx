// MarkdownResponse.tsx
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownResponseProps {
  response: string;
}

const MarkdownResponse: React.FC<MarkdownResponseProps> = ({ response }) => {
  // Clean up the response by replacing tabs with two spaces
  const cleanedResponse = response.replace(/\t/g, "  ");

  const components: Components = {
    // Custom code block renderer with syntax highlighting for blocks with a language specified.
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula as any}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-900 px-1 py-0.5 rounded text-white" {...props}>
          {children}
        </code>
      );
    },
    // Custom pre tag renderer for code blocks
    pre: ({ children, ...props }) => (
      <pre
        className="overflow-x-auto my-2 p-2 bg-gray-900 rounded text-white"
        {...props}
      >
        {children}
      </pre>
    ),
    // Anchor tag renderer
    a: ({ ...props }) => <a className="text-blue-200 underline" {...props} />,
    // Unordered list renderer
    ul: ({ ...props }) => (
      <ul
        className="list-disc pl-4 my-2 text-white marker:text-white text-justify"
        {...props}
      />
    ),
    // Ordered list renderer
    ol: ({ ...props }) => (
      <ol
        className="list-decimal pl-8 my-2 text-white marker:text-white text-justify"
        style={{ listStylePosition: "outside" }}
        {...props}
      />
    ),
    // List item renderer
    li: ({ children, ...props }) => (
      <li
        className="my-1 px-1 text-white leading-normal text-justify"
        style={{ display: "list-item", paddingLeft: "1.5rem" }}
        {...props}
      >
        <span className="align-baseline">{children}</span>
      </li>
    ),
    // Table renderer
    table: ({ ...props }) => (
      <table className="border-collapse border border-black my-4" {...props} />
    ),
    // Table header cell renderer
    th: ({ ...props }) => (
      <th className="border border-gray-700 p-2 bg-gray-800" {...props} />
    ),
    // Table data cell renderer
    td: ({ ...props }) => (
      <td className="border border-gray-700 p-2" {...props} />
    ),
    // Blockquote renderer
    blockquote: ({ ...props }) => (
      <blockquote
        className="border-l-4 border-gray-700 pl-4 italic text-gray-400 my-4"
        {...props}
      />
    ),
  };

  return (
    <div className="p-4 prose max-w-none whitespace-pre-wrap break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {cleanedResponse}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownResponse;
