
// playground/CustomTest.tsx
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

      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-reply`, {
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
          cols={95}
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
          {/* 这里可以添加你希望保留的其他组件或内容 */}
        </>
      )}
    </>
  );
};

export default CustomTest;
// import { useState } from "react";
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
// import type { ActiveTestCaseIndex, MermaidData } from "./index";
// import { MermaidDiagram } from "./MermaidDiagram";
// import 'pdfjs-dist/build/pdf.worker.entry';

// interface CustomTestProps {
//   onChange: (
//     definition: MermaidData["definition"],
//     activeTestCaseIndex: ActiveTestCaseIndex
//   ) => void;
//   mermaidData: MermaidData;
//   activeTestCaseIndex: ActiveTestCaseIndex;
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
//   const [fileContent, setFileContent] = useState("");
//   const [mermaidCode, setMermaidCode] = useState("");
//   const [diagramId, setDiagramId] = useState("");
//   const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
//   const isActive = activeTestCaseIndex === "custom";

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
//         const pdf = await getDocument({ data: typedArray }).promise;
//         let textContent = '';
        
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContentPage = await page.getTextContent();
//           textContentPage.items.forEach((item: any) => {
//             textContent += item.str + ' ';
//           });
//         }

//         setFileContent(textContent);
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const combinedInput = `${userInput}\n\n${fileContent}`;
//       const updatedChatHistory = [...chatHistory, { role: "user", content: combinedInput }];
//       setChatHistory(updatedChatHistory);

//       const response = await fetch("http://127.0.0.1:8000/generate-reply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ messages: updatedChatHistory }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       const messages: Message[] = data.messages;
//       const toolCalls: ToolCall[] = messages.flatMap((msg) => msg.tool_calls || []);
//       const filteredToolCalls = toolCalls.filter(
//         (toolCall) => toolCall.function.name === "create_diagram" || toolCall.function.name === "update_diagram"
//       );

//       if (filteredToolCalls.length > 0) {
//         const functionCall = filteredToolCalls[0].function;
//         if (functionCall && functionCall.arguments) {
//           const args = functionCall.arguments;
//           const argumentsDict = JSON.parse(args);
//           const mermaidContent = argumentsDict?.code;
//           const newDiagramId = argumentsDict?.diagram_id;

//           if (mermaidContent && newDiagramId) {
//             setMermaidCode(mermaidContent);
//             setDiagramId(newDiagramId);
//             onChange(mermaidContent, "custom");

//             const updatedChatHistoryWithReply = [...updatedChatHistory, { role: "assistant", content: JSON.stringify(data) }];
//             setChatHistory(updatedChatHistoryWithReply);
//           }
//         }
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
//           placeholder="Input your context and request to generate diagram"
//         />
//         <br />
//         <input type="file" onChange={handleFileChange} />
//         <br />
//         <button type="submit" id="generate-mermaid-btn">
//           Generate Diagram
//         </button>
//       </form>
//       {isActive && mermaidCode && (
//         <>
//           {/* 这里可以添加你希望保留的其他组件或内容 */}
//         </>
//       )}
//     </>
//   );
// };

// export default CustomTest;
