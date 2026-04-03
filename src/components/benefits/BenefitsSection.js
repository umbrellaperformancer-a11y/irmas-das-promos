import React from "react";
import { Card, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

import CTAButton from "../ui/CTAButton";
import Reveal from "../ui/Reveal"; // ✅

import "../../styles/benefits.css";

const { Title } = Typography;

export default function BenefitsSection({ content, ctaHref }) {
  const { title, items, ctaLabel, noteTop } = content;

  return (
    <section className="section" style={{backgroundColor: 'transparent'}}>
      {/* Título */}
      <Reveal delay={0} y={12}>
        <Title level={2} className="sectionTitle">
          {title}
        </Title>
      </Reveal>

      {/* Card com lista */}
      <Reveal delay={120} y={16}>
        <Card className="glassCard" bordered={false}>
          <ul className="benefitsList">
            {items.map((t, idx) => (
              <Reveal
                key={idx}
                delay={200 + idx * 80} // stagger
                y={10}
                once
              >
                <li className="benefitItem">
                  <CheckCircleFilled style={{ fontSize: 18 }} />
                  <span>{t}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Card>
      </Reveal>

      {/* Nota / reforço */}
      {noteTop ? (
        <Reveal delay={200 + items.length * 80 + 120} y={12}>
          <div className="benefitsCtaWrap">
            <div className="benefitsNote">{noteTop}</div>
          </div>
        </Reveal>
      ) : null}
       <Reveal delay={0} y={10}>
            <div className="brand-cel">
              <img
                src="/celular 2.png"
                alt="Celular"
                className="imgCel"
              />
            </div>
          </Reveal>
    </section>
  );
}
