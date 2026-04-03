import React from "react";
import { Typography } from "antd";
import CodeCard from "../ui/CodeCard";

import "../../styles/sections.css";

const { Title, Text } = Typography;

export default function HowItWorksSection({ content }) {
  return (
    <section className="section">
      <Title level={2} className="sectionTitle">
        {content.title}
      </Title>

      <Text className="sectionLead">{content.lead}</Text>

      <div style={{ marginTop: 12 }}>
        <CodeCard
          label="código"
          title={content.cardTitle}
          lines={content.steps}
        />
      </div>
    </section>
  );
}
