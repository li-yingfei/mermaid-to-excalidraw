import { useState } from "react";
import { MermaidDiagram } from "./MermaidDiagram.tsx";
import type { ActiveTestCaseIndex, MermaidData } from "./index.tsx";

interface CustomTestProps {
  onChange: (
    definition: MermaidData["definition"],
    activeTestCaseIndex: ActiveTestCaseIndex
  ) => void;
  mermaidData: MermaidData;
  activeTestCaseIndex: ActiveTestCaseIndex;
}

const CustomTest = ({
  onChange,
  mermaidData,
  activeTestCaseIndex,
}: CustomTestProps) => {
  const [userInput, setUserInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const isActive = activeTestCaseIndex === "custom";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("Sending request to server with input:", userInput);
  
      const response = await fetch("http://127.0.0.1:8000/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
      });
  
      console.log("Received response:", response);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Received data from server:", data);
  
      // Debugging: check the entire data structure
      console.log("Reply structure:", data.reply);
  
      // 提取 Mermaid 内容
      const toolCalls = data.reply[0]?.tool_calls;
      console.log("Tool calls:", toolCalls);
  
      if (toolCalls && toolCalls.length > 0) {
        const functionCall = toolCalls[0].function;
        console.log("Function call:", functionCall);
  
        if (functionCall && functionCall.arguments) {
          const args = functionCall.arguments;
          console.log("Arguments string:", args);
  
          const argumentsDict = JSON.parse(args);
          console.log("Parsed arguments:", argumentsDict);
  
          const mermaidContent = argumentsDict?.content;
  
          if (mermaidContent) {
            console.log("Extracted Mermaid content:", mermaidContent);
  
            setMermaidCode(mermaidContent);
            console.log("Set Mermaid code state:", mermaidContent);
            onChange(mermaidContent, "custom");
          } else {
            console.error("No valid Mermaid content found in tool call");
          }
        } else {
          console.error("Arguments not found in tool call");
        }
      } else {
        console.error("No tool calls found in reply");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          id="mermaid-input"
          rows={10}
          cols={50}
          name="mermaid-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ marginTop: "1rem" }}
          placeholder="Input natural language request"
        />
        <br />
        <button type="submit" id="generate-mermaid-btn">
          {"Generate and Render Diagram"}
        </button>
      </form>

      {isActive && mermaidCode && (
        <>
          <MermaidDiagram definition={mermaidCode} id="custom-diagram" />
          <details id="parsed-data-details">
            <summary>{"Parsed data from parseMermaid"}</summary>
            <pre id="custom-parsed-data">
              {JSON.stringify(mermaidData.output, null, 2)}
            </pre>
            {mermaidData.error && <div id="error">{mermaidData.error}</div>}
          </details>
        </>
      )}
    </>
  );
};

export default CustomTest;
