// playground/MermaidDiagram.tsx
import { useState, useTransition, useEffect } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  id: string;
  definition: string;
}

export const MermaidDiagram = ({ definition, id }: MermaidProps) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const render = async (id: string, definition: string) => {
      try {
        setError(null);
        console.log("Rendering Mermaid diagram with definition:", definition);

        const { svg } = await mermaid.render(
          `mermaid-diagram-${id}`,
          definition
        );
        console.log("Rendered SVG:", svg);

        startTransition(() => {
          setSvg(svg);
        });
      } catch (err) {
        // setError(String(err));
        console.error("Error rendering Mermaid diagram:", err);
      }
    };

    render(id, definition);
  }, [definition, id]);

  return (
    <>
      <div
        style={{ width: "50%" }}
        className="mermaid"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {error && <div id="error">{error}</div>}
    </>
  );
};
