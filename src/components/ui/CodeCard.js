import React from "react";
import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export default function CodeCard({ label = "código", title, lines = [] }) {
  const textToCopy = [title, ...(lines || []).map((l) => `• ${l}`)]
    .filter(Boolean)
    .join("\n");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (e) {}
  };

  return (
    <div className="codeCard">
      <div className="codeCardTop">
        <div className="codeLabel">{label}</div>
        <Button
          size="small"
          icon={<CopyOutlined />}
          className="copyBtn"
          onClick={onCopy}
        >
          Copiar
        </Button>
      </div>

      <div className="codeBody">
        {title ? <div className="codeTitle">{title}</div> : null}

        {lines?.length ? (
          <ul className="codeList">
            {lines.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
