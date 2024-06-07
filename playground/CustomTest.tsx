// import { useState } from "react";
// import { MermaidDiagram } from "./MermaidDiagram";
// import type { ActiveTestCaseIndex, MermaidData } from "./index";

// interface CustomTestProps {
//   onChange: (
//     definition: MermaidData["definition"],
//     activeTestCaseIndex: ActiveTestCaseIndex
//   ) => void;
//   mermaidData: MermaidData;
//   activeTestCaseIndex: ActiveTestCaseIndex;
// }

// interface Diagram {
//   id: string;
//   code: string;
// }

// interface ToolCall {
//   id: string;
//   function: {
//     arguments: string;
//     name: string;
//   };
//   type: string;
// }

// interface Message {
//   role: string;
//   content: string;
//   tool_calls?: ToolCall[];
// }

// const CustomTest = ({
//   onChange,
//   mermaidData,
//   activeTestCaseIndex,
// }: CustomTestProps) => {
//   const [userInput, setUserInput] = useState("");
//   const [diagrams, setDiagrams] = useState<Diagram[]>([]); // 存储多个图表
//   const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
//   const isActive = activeTestCaseIndex === "custom";

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const updatedChatHistory = [...chatHistory, { role: "user", content: userInput }];
//       setChatHistory(updatedChatHistory);

//       console.log("Sending request to server with input:", updatedChatHistory);

//       const response = await fetch("http://127.0.0.1:8000/generate-reply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ messages: updatedChatHistory }),
//       });

//       console.log("Received response:", response);

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       console.log("Received data from server:", data);

//       // 显式声明消息的类型
//       const messages: Message[] = data.messages;

//       // 提取 Mermaid 内容和 diagram_id
//       const toolCalls: ToolCall[] = messages.flatMap((msg) => msg.tool_calls || []);
//       console.log("Tool calls:", toolCalls);

//       // 过滤只包含 create_diagram 和 update_diagram 的调用
//       const filteredToolCalls = toolCalls.filter(
//         (toolCall) => toolCall.function.name === "create_diagram" || toolCall.function.name === "update_diagram"
//       );

//       if (filteredToolCalls.length > 0) {
//         const newDiagrams = filteredToolCalls.map((toolCall) => {
//           const functionCall = toolCall.function;
//           console.log("Function call:", functionCall);

//           if (functionCall && functionCall.arguments) {
//             const args = functionCall.arguments;
//             console.log("Arguments string:", args);

//             const argumentsDict = JSON.parse(args);
//             console.log("Parsed arguments:", argumentsDict);

//             const mermaidContent = argumentsDict?.code; // 提取 Mermaid 代码内容
//             const newDiagramId = argumentsDict?.diagram_id; // 提取 diagram_id

//             if (mermaidContent && newDiagramId) {
//               return { id: newDiagramId, code: mermaidContent };
//             } else {
//               console.error("No valid Mermaid content or diagram_id found in tool call");
//               return null;
//             }
//           } else {
//             console.error("Arguments not found in tool call or function name is not create_diagram/update_diagram");
//             return null;
//           }
//         }).filter((diagram): diagram is Diagram => diagram !== null);

//         setDiagrams((prevDiagrams) => [...prevDiagrams, ...newDiagrams]);
//         console.log("Set Diagrams state:", newDiagrams);

//         // 更新聊天记录以包括代理的回复
//         const updatedChatHistoryWithReply = [...updatedChatHistory, { role: "assistant", content: JSON.stringify(data) }];
//         setChatHistory(updatedChatHistoryWithReply);
//       } else {
//         console.error("No valid tool calls found in reply");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           id="mermaid-input"
//           rows={10}
//           cols={50}
//           name="mermaid-input"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           style={{ marginTop: "1rem" }}
//           placeholder="Input natural language request"
//         />
//         <br />
//         <button type="submit" id="generate-mermaid-btn">
//           {"Generate and Render Diagram"}
//         </button>
//       </form>

//       {isActive && diagrams.length > 0 && (
//         <>
//           {diagrams.map((diagram) => (
//             <div key={diagram.id}>
//               <MermaidDiagram definition={diagram.code} id={`diagram-${diagram.id}`} />
//               <details id={`parsed-data-details-${diagram.id}`}>
//                 <summary>{"Parsed data from parseMermaid"}</summary>
//                 <pre id={`custom-parsed-data-${diagram.id}`}>
//                   {JSON.stringify(mermaidData.output, null, 2)}
//                 </pre>
//                 {mermaidData.error && <div id="error">{mermaidData.error}</div>}
//               </details>
//             </div>
//           ))}
//         </>
//       )}
//     </>
//   );
// };

// export default CustomTest;



import { useState } from "react";
import { MermaidDiagram } from "./MermaidDiagram";
import type { ActiveTestCaseIndex, MermaidData } from "./index";

interface CustomTestProps {
  onChange: (
    definition: MermaidData["definition"],
    activeTestCaseIndex: ActiveTestCaseIndex
  ) => void;
  mermaidData: MermaidData;
  activeTestCaseIndex: ActiveTestCaseIndex;
}

interface ToolCall {
  id: string;
  function: {
    arguments: string;
    name: string;
  };
  type: string;
}

interface Message {
  role: string;
  content: string;
  tool_calls?: ToolCall[];
}

const CustomTest = ({
  onChange,
  mermaidData,
  activeTestCaseIndex,
}: CustomTestProps) => {
  const [userInput, setUserInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [diagramId, setDiagramId] = useState(""); // 新增状态用于记录 diagram_id
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const isActive = activeTestCaseIndex === "custom";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedChatHistory = [...chatHistory, { role: "user", content: userInput }];
      setChatHistory(updatedChatHistory);

      console.log("Sending request to server with input:", updatedChatHistory);

      const response = await fetch("http://127.0.0.1:8000/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedChatHistory }),
      });

      console.log("Received response:", response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Received data from server:", data);

      // 显式声明消息的类型
      const messages: Message[] = data.messages;

      // 提取 Mermaid 内容和 diagram_id
      const toolCalls: ToolCall[] = messages.flatMap((msg) => msg.tool_calls || []);
      console.log("Tool calls:", toolCalls);

      // 过滤只包含 create_diagram 和 update_diagram 的调用
      const filteredToolCalls = toolCalls.filter(
        (toolCall) => toolCall.function.name === "create_diagram" || toolCall.function.name === "update_diagram"
      );

      if (filteredToolCalls.length > 0) {
        const functionCall = filteredToolCalls[0].function;
        console.log("Function call:", functionCall);

        if (functionCall && functionCall.arguments) {
          const args = functionCall.arguments;
          console.log("Arguments string:", args);

          const argumentsDict = JSON.parse(args);
          console.log("Parsed arguments:", argumentsDict);

          const mermaidContent = argumentsDict?.code; // 提取 Mermaid 代码内容
          const newDiagramId = argumentsDict?.diagram_id; // 提取 diagram_id

          if (mermaidContent && newDiagramId) {
            setMermaidCode(mermaidContent);
            setDiagramId(newDiagramId); // 设置新的 diagram_id
            console.log("Set Mermaid code state:", mermaidContent);
            console.log("Set Diagram ID state:", newDiagramId);
            onChange(mermaidContent, "custom");

            // 更新聊天记录以包括代理的回复
            const updatedChatHistoryWithReply = [...updatedChatHistory, { role: "assistant", content: JSON.stringify(data) }];
            setChatHistory(updatedChatHistoryWithReply);
          } else {
            console.error("No valid Mermaid content or diagram_id found in tool call");
          }
        } else {
          console.error("Arguments not found in tool call or function name is not create_diagram/update_diagram");
        }
      } else {
        console.error("No valid tool calls found in reply");
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
          rows={30}
          cols={55}
          name="mermaid-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ marginTop: "1rem" }}
          placeholder="Input your context and request to generate diagram"
        />
        <br />
        <button type="submit" id="generate-mermaid-btn">
          {"Generate Diagram"}
        </button>
      </form>

      {isActive && mermaidCode && (
        <>
          <MermaidDiagram definition={mermaidCode} id={`diagram-${diagramId}`} />
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

