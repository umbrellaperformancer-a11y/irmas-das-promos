import React from "react";
import { Typography, Space } from "antd";

import CTAButton from "../ui/CTAButton";
import ProofStrip from "../ui/ProofStrip";
import UrgencyPill from "../ui/UrgencyPill";
import Reveal from "../ui/Reveal";

import "../../styles/hero.css";
import Faixa from "../faixa/faixa";

const { Title, Text } = Typography;

export default function HeroSection({ brand, content, onCTAClick }) {
  const {
    kicker,
    titleParts = [],
    highlightWord,
    highlightIndex,
    subtitle,
    proofText,
    urgencyText,
  } = content || {};

  const norm = (s) => String(s ?? "").trim().toLowerCase();

  // ✅ prioriza highlightIndex; se não tiver, tenta bater por texto (trim/case)
  const hi =
    Number.isInteger(highlightIndex)
      ? highlightIndex
      : titleParts.findIndex((p) => norm(p) === norm(highlightWord));

  return (
    <section className="hero">
      <div className="heroBg" />
      <div className="heroInner">
        <Reveal delay={0} y={10}>
          <div className="brand" style={{ marginBottom: '20px' }}>
            <img src="/Logo.png" alt="Irmas das promos" className="brandImage" />
          </div>
        </Reveal>

        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          {kicker ? (
            <Reveal delay={140} y={14}>
              <Text className="kicker">{kicker}</Text>
            </Reveal>
          ) : null}

          <Reveal delay={220} y={18}>
            <Title style={{ fontSize: '30px', color: '#5A2333', fontWeight: 900 }}>
              ESSE GRUPO DE WHATSAPP ENCONTA <span style={{ color: '#FF4FA3' }}>PROMOÇÕES ABSURDAS</span> TODOS OS DIAS
            </Title>
          </Reveal>

          <Reveal delay={220} y={18}>
            <Title style={{ fontSize: '18px', color: '#5A2333' }}>
              Amazon, Mercado Livre e grande lojas com até 70% OFF.
            </Title>
          </Reveal>

          <Reveal delay={420} y={20}>
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <CTAButton href={content?.ctaHref} onClicked={onCTAClick}>
                {content?.ctaText}
              </CTAButton>
            </div>
          </Reveal>

          <Reveal delay={220} y={18}>
            <Title style={{ fontSize: '18px', color: '#5A2333' }}>
              Algumas promoções que enviamos hoje
            </Title>
          </Reveal>
          {/* 
          <Reveal delay={520} y={18}>
            <div style={{ color: "white" }}>
              <ProofStrip text={proofText} />
            </div>
          </Reveal>

          <Reveal delay={620} y={18}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <UrgencyPill text={urgencyText} />
            </div>
          </Reveal> */}

          <Reveal delay={0} y={10}>
            <div className="brand-cel">
              <img
                src="/celular 2.png"
                alt="Celular"
                className="imgCel"
              />
            </div>
          </Reveal>
        </Space>
      </div>
    </section>
  );
}
