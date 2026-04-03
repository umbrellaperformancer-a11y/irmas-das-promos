import React from "react";
import { Carousel, Card, Tag, Button, Typography, Skeleton } from "antd";
import { collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { Title, Text } = Typography;

const formatBRL = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function UpcomingLiveCarousel() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // ✅ 1) tenta READY
    const qReady = query(
      collection(db, "queue_items"),
      where("status", "==", "READY"),
      limit(10)
    );

    const unsubReady = onSnapshot(
      qReady,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // se tiver READY, usa eles
        if (data.length) {
          setItems(data);
          setLoading(false);
          return;
        }

        // ✅ 2) fallback: últimos CLAIMED (pra nunca ficar vazio)
        const qClaimed = query(
          collection(db, "queue_items"),
          where("status", "==", "CLAIMED"),
          limit(10)
        );

        const unsubClaimed = onSnapshot(
          qClaimed,
          (snap2) => {
            const data2 = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
            setItems(data2);
            setLoading(false);
          },
          (err2) => {
            console.log("Firestore CLAIMED error:", err2);
            setLoading(false);
          }
        );

        // retorna cleanup do fallback
        return () => unsubClaimed();
      },
      (err) => {
        console.log("Firestore READY error:", err);
        setLoading(false);
      }
    );

    return () => unsubReady();
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Title level={3} style={{ margin: 0 }}>🔴 Live dos próximos links ativos</Title>
        <Tag color="red">AO VIVO</Tag>
        <Text type="secondary">({items.length}/10)</Text>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : !items.length ? (
        <Card>
          <Text type="secondary">⏳ Preparando a próxima oferta… pode entrar a qualquer momento.</Text>
        </Card>
      ) : (
        <Carousel autoplay autoplaySpeed={3500} dots draggable pauseOnHover infinite>
          {items.map((it) => {
            const from = formatBRL(it.priceFrom);
            const to = formatBRL(it.priceTo);

            return (
              <div key={it.id} style={{ padding: 8 }}>
                <Card hoverable style={{ borderRadius: 18, overflow: "hidden" }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={it.imageUrl}
                      alt={it.productName || "Promo"}
                      style={{ width: "100%", height: 420, objectFit: "cover" }}
                      loading="lazy"
                    />

                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8 }}>
                      <Tag color="red">🔴 LIVE</Tag>
                      <Tag color={it.status === "READY" ? "gold" : "blue"}>
                        {it.status === "READY" ? "PRÓXIMO" : "LIBERADO"}
                      </Tag>
                    </div>

                    {from && to && (
                      <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                        <div style={{ background: "rgba(0,0,0,.55)", color: "#fff", padding: 12, borderRadius: 14 }}>
                          <div style={{ fontSize: 12 }}>
                            de <span style={{ textDecoration: "line-through" }}>{from}</span>
                          </div>
                          <div style={{ fontSize: 20, fontWeight: 800 }}>por {to}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: 12 }}>
                    <Text type="secondary">{it.day ? `📅 ${it.day}` : ""}</Text>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{it.productName || "Promoção"}</div>

                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Tag color="blue">Homens</Tag>
                      <Tag color="purple">Achados</Tag>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      href={it.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ borderRadius: 14, fontWeight: 800, marginTop: 10 }}
                      block
                    >
                      Ver oferta agora
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
}
