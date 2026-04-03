import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";

import { theme } from "../theme";
import { defaultLandingContent } from "../content/defaultLandingContent";
import { fetchLandingContent, deepMerge } from "../services/landingService";

import ClickOverlay from "../components/ui/ClickOverlay";
import HeroSection from "../components/hero/HeroSection";
import BenefitsSection from "../components/benefits/BenefitsSection";
import PageShell from "../components/layout/pageshell";
import VipJoinNotifier from "../components/notification/notification";
import GTM from "../components/gtm/GTM";
import Faixa from "../components/faixa/faixa";

export default function LandingPage({ slug = "geral" }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [c, setC] = useState(defaultLandingContent);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const remote = await fetchLandingContent(slug);

        if (!alive) return;

        // ✅ merge padrão + remoto
        const merged = remote
          ? deepMerge(defaultLandingContent, remote)
          : defaultLandingContent;

        // ✅ Benefits sempre do código (fixo)
        merged.benefits = defaultLandingContent.benefits;

        setC(merged);
      } catch (e) {
        console.error("Erro ao carregar landing:", e);

        // fallback total
        const fallback = { ...defaultLandingContent };
        fallback.benefits = defaultLandingContent.benefits;
        setC(fallback);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  const openOverlay = () => {
    setOverlayOpen(true);
    setTimeout(() => setOverlayOpen(false), 2200);
  };

  return (
    <ConfigProvider theme={theme}>
      <ClickOverlay open={overlayOpen} />

      <PageShell>
        <GTM gtmId="GTM-NRWHDJ6Q" />
        <Faixa></Faixa>
        <HeroSection content={c.hero} brand={c.brand} onCTAClick={openOverlay} />

        <VipJoinNotifier />

        {/* <BenefitsSection content={defaultLandingContent.benefits} ctaHref={c.hero?.ctaHref} /> */}
      </PageShell>
    </ConfigProvider>
  );
}
