
// import { useState, useCallback, useDeferredValue } from "react";
// import CustomTest from "./CustomTest.tsx";
// import ExcalidrawWrapper from "./ExcalidrawWrapper.tsx";
// import Testcases from "./Testcases.tsx";
// import { parseMermaid } from "../src/parseMermaid.ts";
// import GitHubCorner from "./GitHubCorner.tsx";

// export interface MermaidData {
//   definition: string;
//   output: Awaited<ReturnType<typeof parseMermaid>> | null;
//   error: string | null;
// }

// export type ActiveTestCaseIndex = number | "custom" | null;

// const App = () => {
//   const [mermaidData, setMermaidData] = useState<MermaidData>({
//     definition: "",
//     error: null,
//     output: null,
//   });

//   const [activeTestCaseIndex, setActiveTestCaseIndex] = useState<ActiveTestCaseIndex>(null);
//   const deferredMermaidData = useDeferredValue(mermaidData);

//   const handleOnChange = useCallback(
//     async (
//       definition: MermaidData["definition"],
//       activeTestCaseIndex: ActiveTestCaseIndex
//     ) => {
//       try {
//         setActiveTestCaseIndex(activeTestCaseIndex);

//         const mermaid = await parseMermaid(definition);

//         setMermaidData({
//           definition,
//           output: mermaid,
//           error: null,
//         });
//       } catch (error) {
//         setMermaidData({
//           definition,
//           output: null,
//           error: String(error),
//         });
//       }
//     },
//     []
//   );

//   return (
//     <>
//       <div style={{ width: "50%", display: "flex" }}>
//         <section id="custom-test">
//           <h1>{"Custom Test"}</h1>
//           {"Supports only "}
//           <a
//             target="_blank"
//             href="https://mermaid.js.org/syntax/flowchart.html"
//           >
//             {"Flowchart"}
//           </a>
//           {", "}
//           <a
//             target="_blank"
//             href="https://mermaid.js.org/syntax/sequenceDiagram.html"
//           >
//             {"Sequence "}
//           </a>
//           {"and "}
//           <a
//             target="_blank"
//             href="https://mermaid.js.org/syntax/classDiagram.html"
//           >
//             {"Class "}
//           </a>
//           {"diagrams."}
//           <br />
//           <CustomTest
//             activeTestCaseIndex={activeTestCaseIndex}
//             mermaidData={deferredMermaidData}
//             onChange={handleOnChange}
//           />
//         </section>
//         <GitHubCorner />
//       </div>

//       <Testcases
//         activeTestCaseIndex={activeTestCaseIndex}
//         onChange={handleOnChange}
//       />

//       <div id="excalidraw">
//         <ExcalidrawWrapper
//           mermaidDefinition={deferredMermaidData.definition}
//           mermaidOutput={deferredMermaidData.output}
//         />
//       </div>
//     </>
//   );
// };

// export default App;

import { useState, useCallback, useDeferredValue } from "react";
import CustomTest from "./CustomTest.tsx";
import ExcalidrawWrapper from "./ExcalidrawWrapper.tsx";
import Testcases from "./Testcases.tsx";
import { parseMermaid } from "../src/parseMermaid.ts";
// import GitHubCorner from "./GitHubCorner.tsx";

export interface MermaidData {
  definition: string;
  output: Awaited<ReturnType<typeof parseMermaid>> | null;
  error: string | null;
}

export type ActiveTestCaseIndex = number | "custom" | null;

const App = () => {
  const [mermaidData, setMermaidData] = useState<MermaidData>({
    definition: "",
    error: null,
    output: null,
  });

  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState<ActiveTestCaseIndex>(null);
  const deferredMermaidData = useDeferredValue(mermaidData);

  const handleOnChange = useCallback(
    async (
      definition: MermaidData["definition"],
      activeTestCaseIndex: ActiveTestCaseIndex
    ) => {
      try {
        setActiveTestCaseIndex(activeTestCaseIndex);

        const mermaid = await parseMermaid(definition);

        setMermaidData({
          definition,
          output: mermaid,
          error: null,
        });
      } catch (error) {
        setMermaidData({
          definition,
          output: null,
          error: String(error),
        });
      }
    },
    []
  );

  return (
    <>
      <h1>DiagramAI</h1>
      <div style={{ width: "44%", margin: "10px 0", padding: "10px", backgroundColor: "#ffffff", border: "1px solid #ddd", textAlign: "justify" }}>
        <p>
          DiagramAI allows users to input long text into the input box and specify their requirements to generate a diagram.
          If unsatisfied, users can input additional changes into the chat box or directly modify the diagram on the canvas to adjust colors, fonts, sizes, etc.
          Once complete, the diagram can be exported.
        </p>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <section id="custom-test" style={{ flex: 1 }}>
          <CustomTest
            activeTestCaseIndex={activeTestCaseIndex}
            mermaidData={deferredMermaidData}
            onChange={handleOnChange}
          />
        </section>
        <section id="excalidraw" style={{ flex: 1 }}>
          <ExcalidrawWrapper
            mermaidDefinition={deferredMermaidData.definition}
            mermaidOutput={deferredMermaidData.output}
          />
        </section>
      </div>
    </>
  );
};

export default App;
