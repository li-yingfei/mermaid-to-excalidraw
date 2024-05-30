// import { MermaidDiagram } from "./MermaidDiagram.tsx";
// import type { ActiveTestCaseIndex, MermaidData } from "./index.tsx";

// interface CustomTestProps {
//   onChange: (
//     definition: MermaidData["definition"],
//     activeTestCaseIndex: ActiveTestCaseIndex
//   ) => void;
//   mermaidData: MermaidData;
//   activeTestCaseIndex: ActiveTestCaseIndex;
// }

// const CustomTest = ({
//   onChange,
//   mermaidData,
//   activeTestCaseIndex,
// }: CustomTestProps) => {
//   const isActive = activeTestCaseIndex === "custom";
//   return (
//     // 定义一个表单，onSubmit 事件处理函数阻止默认提交行为，提取输入的 Mermaid 代码，并调用 onChange 方法。
//     <>                  
//       <form  
//         onSubmit={(e) => {
//           e.preventDefault();

//           const formData = new FormData(e.target as HTMLFormElement);

//           onChange(formData.get("mermaid-input")?.toString() || "", "custom");
//         }}
//       >
//         {/* 定义一个文本区域用于输入 Mermaid 代码，onChange 事件处理函数实时调用 onChange 方法（仅当 isActive 为 true 时）。 */}

//         <textarea
//           id="mermaid-input"
//           rows={10}
//           cols={50}
//           name="mermaid-input"
//           onChange={(e) => {
//             if (!isActive) {
//               return;
//             }

//             onChange(e.target.value, "custom");
//           }}
//           style={{ marginTop: "1rem" }}
//           placeholder="Input Mermaid Syntax"
//         />
//         {/* 定义一个提交按钮，提交表单时调用 onSubmit 事件处理函数。 */}
//         <br />
//         <button type="submit" id="render-excalidraw-btn">
//           {"Render to Excalidraw"}
//         </button>
//       </form>

//       {isActive && (
//         <>
//           <MermaidDiagram
//             definition={mermaidData.definition}
//             id="custom-diagram"
//           />

//           <details id="parsed-data-details">
//             <summary>{"Parsed data from parseMermaid"}</summary>
//             <pre id="custom-parsed-data">
//               {JSON.stringify(mermaidData.output, null, 2)}
//             </pre>
//             {mermaidData.error && <div id="error">{mermaidData.error}</div>}
//           </details>
//         </>
//       )}
//     </>
//   );
// };

// export default CustomTest;


// // CustomTest 组件的作用
// // 项目背景
// // 这个项目的目标是将 Mermaid 代码转换为 Excalidraw 图形。CustomTest 组件在这个流程中扮演了一个重要的角色，允许用户输入 Mermaid 代码并查看其解析结果和在 Excalidraw 中的显示效果。

// // 具体功能
// // 用户输入:

// // 提供一个文本区域让用户输入 Mermaid 代码。
// // 实时更新:

// // 当用户在文本区域中输入代码时，onChange 事件处理函数会实时调用父组件传入的 onChange 回调函数，将新的 Mermaid 代码传递给父组件进行解析。
// // 提交处理:

// // 当用户提交表单时，onSubmit 事件处理函数阻止默认表单提交行为，获取用户输入的 Mermaid 代码，并调用 onChange 方法。
// // 条件渲染:

// // 仅当当前测试用例索引为 "custom" 时，渲染 MermaidDiagram 组件，显示 Mermaid 图表以及解析后的数据和可能的错误信息。
// // 组件在项目中的角色
// // CustomTest 组件作为用户输入 Mermaid 代码的入口，负责收集和传递用户输入的数据，并将解析结果展示给用户。
// // 通过这个组件，用户可以实时看到输入的 Mermaid 代码是如何被解析和转换为 Excalidraw 元素的。
// // 组件结构
// // Props 定义:

// // onChange: 回调函数，处理 Mermaid 输入的变化。
// // mermaidData: 包含当前的 Mermaid 代码、解析结果和错误信息。
// // activeTestCaseIndex: 当前激活的测试用例索引。
// // 状态判断:

// // isActive: 判断当前测试用例是否为 "custom"。
// // 表单与文本区域:

// // 提供用户输入和提交 Mermaid 代码的界面。
// // 条件渲染解析结果:

// // 当 isActive 为 true 时，渲染解析后的 Mermaid 图表和数据。
// // 代码流程示例
// // 用户在文本区域输入 Mermaid 代码。
// // onChange 事件触发，调用 onChange 回调函数。
// // 父组件接收新的 Mermaid 代码，进行解析。
// // CustomTest 组件接收解析结果，渲染 Mermaid 图表和解析数据。
// // 通过 CustomTest 组件，用户可以方便地输入和查看 Mermaid 代码的解析和转换结果，从而实现将 Mermaid 代码转换为 Excalidraw 图形的目标。


import { useState, useEffect } from "react";
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
      const response = await fetch("http://127.0.0.1:8000/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const args = JSON.parse(data.reply[0].tool_calls[0].function.arguments);
      const content = args.content;

      setMermaidCode(content);
      onChange(content, "custom");
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
        <button type="submit" id="render-excalidraw-btn">
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
