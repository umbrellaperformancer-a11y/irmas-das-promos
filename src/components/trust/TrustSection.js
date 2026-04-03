import React from "react";
import { Typography } from "antd";
import CodeCard from "../ui/CodeCard";

import "../../styles/sections.css";

const { Title } = Typography;

export default function TrustSection({ content }) {
  return (
    <section className="section">
      <Title level={2} className="sectionTitle">
        {content.title}
      </Title>

      <div style={{ marginTop: 12 }}>
        <CodeCard label="código" lines={content.bullets} />
      </div>
    </section>
  );
}
