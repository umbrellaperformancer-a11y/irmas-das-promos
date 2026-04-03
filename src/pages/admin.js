import React from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  Divider,
  message,
  Alert,
  Layout,
  Checkbox,
  Modal,
  Row,
  Col,
  Tabs,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";
import { defaultLandingContent } from "../content/defaultLandingContent";
import { fetchLandingContent, saveLandingContent, deepMerge } from "../services/landingService";

const { Title, Text } = Typography;

// ========= Remember me (localStorage) =========
const LS_REMEMBER_KEY = "bc_admin_remember";
const LS_EMAIL_KEY = "bc_admin_email";
const LS_PASS_KEY = "bc_admin_password"; // ⚠️ inseguro

function getRememberFlag() {
  return localStorage.getItem(LS_REMEMBER_KEY) === "1";
}
function setRememberFlag(v) {
  if (v) localStorage.setItem(LS_REMEMBER_KEY, "1");
  else localStorage.removeItem(LS_REMEMBER_KEY);
}
function getSavedCreds() {
  const remember = getRememberFlag();
  if (!remember) return { email: "", password: "" };
  return {
    email: localStorage.getItem(LS_EMAIL_KEY) || "",
    password: localStorage.getItem(LS_PASS_KEY) || "",
  };
}
function clearSavedCreds() {
  localStorage.removeItem(LS_EMAIL_KEY);
  localStorage.removeItem(LS_PASS_KEY);
  localStorage.removeItem(LS_REMEMBER_KEY);
}
function askRememberChoice() {
  return new Promise((resolve) => {
    Modal.confirm({
      title: "Deseja salvar o acesso neste dispositivo?",
      content:
        "Se você escolher “Sim”, na próxima vez o painel vai abrir com os dados preenchidos e tentar entrar automaticamente.",
      okText: "Sim, salvar",
      cancelText: "Não, sempre perguntar",
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

// ========= Lines editor =========
const LinesEditor = ({ value = [], onChange, placeholder = "1 linha por vez" }) => {
  const str = Array.isArray(value) ? value.join("\n") : "";
  return (
    <Input.TextArea
      rows={6}
      value={str}
      placeholder={placeholder}
      onChange={(e) => {
        const lines = e.target.value.replace(/\r/g, "").split("\n");
        onChange?.(lines);
      }}
    />
  );
};

async function checkIsAdmin(uid) {
  const ref = doc(db, "admins", uid);
  const snap = await getDoc(ref);
  return snap.exists();
}

const normalizeLines = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((s) => String(s ?? "").trim())
    .filter((s) => s.length > 0);

export default function Admin() {
  const [form] = Form.useForm();

  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);

  const [autoTried, setAutoTried] = React.useState(false);

  // ✅ tabs/slug
  const [activeSlug, setActiveSlug] = React.useState("geral"); // "geral" | "perfumes"

  // ---- auth state
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);

      if (u?.uid) {
        try {
          const ok = await checkIsAdmin(u.uid);
          setIsAdmin(ok);
        } catch (e) {
          console.error(e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  // auto-login se marcou lembrar
  React.useEffect(() => {
    if (user) return;
    if (autoTried) return;

    const remember = getRememberFlag();
    const { email, password } = getSavedCreds();

    if (!remember || !email || !password) {
      setAutoTried(true);
      return;
    }

    (async () => {
      try {
        setAutoTried(true);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        console.error("Auto-login falhou:", e);
        clearSavedCreds();
      }
    })();
  }, [user, autoTried]);

  // ---- load content for current slug (only if admin)
  React.useEffect(() => {
    let alive = true;

    (async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const remote = await fetchLandingContent(activeSlug);
        if (!alive) return;

        const merged = remote
          ? deepMerge(defaultLandingContent, remote)
          : defaultLandingContent;

        // ✅ Benefits sempre fixo do código
        merged.benefits = defaultLandingContent.benefits;

        form.setFieldsValue(merged);
      } catch (e) {
        console.error(e);
        const fallback = { ...defaultLandingContent, benefits: defaultLandingContent.benefits };
        form.setFieldsValue(fallback);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [form, isAdmin, activeSlug]);

  const onLogout = async () => {
    await signOut(auth);
    message.info("Saiu.");
  };

  const onLogin = async (values) => {
    const email = (values.email || "").trim();
    const password = values.password || "";

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const remember = await askRememberChoice();
      if (remember) {
        setRememberFlag(true);
        localStorage.setItem(LS_EMAIL_KEY, email);
        localStorage.setItem(LS_PASS_KEY, password);
      } else {
        clearSavedCreds();
      }

      message.success("Logado ✅");
    } catch (e) {
      console.error(e);
      message.error(`Falha no login: ${e?.code || ""}`);
    }
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();

      const titleParts = normalizeLines(values?.hero?.titleParts);

      const highlightWordRaw = String(values?.hero?.highlightWord ?? "");
      const norm = (s) => String(s ?? "").trim().toLowerCase();

      let highlightIndex = titleParts.findIndex((p) => norm(p) === norm(highlightWordRaw));
      if (highlightIndex < 0) highlightIndex = Math.min(1, Math.max(0, titleParts.length - 1));

      const payload = {
        ...values,
        hero: {
          ...values.hero,
          titleParts,
          highlightIndex,
          highlightWord: titleParts[highlightIndex] || "",
        },

        // ✅ Benefits SEMPRE fixo do código (não salva do form)
        benefits: defaultLandingContent.benefits,

        finalCta: {
          ...values.finalCta,
        },
      };

      setSaving(true);

      // ✅ AQUI ESTAVA O BUG: precisa passar slug
      await saveLandingContent(activeSlug, payload);

      message.success(`Salvo ✅ (${activeSlug})`);
    } catch (e) {
      console.error(e);
      message.error(`Não foi possível salvar: ${e?.code || ""}`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Content style={{ padding: 18 }}>
          <Row justify="center" align="middle" style={{ minHeight: "calc(100vh - 36px)" }}>
            <Col>
              <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
                <Title level={3} style={{ marginBottom: 0 }}>Admin</Title>
                <Text type="secondary">Carregando autenticação...</Text>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    );
  }

  // LOGIN
  if (!user) {
    const saved = getSavedCreds();
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Content style={{ padding: 18 }}>
          <Row justify="center" align="middle" style={{ minHeight: "calc(100vh - 36px)" }}>
            <Col xs={24} sm={18} md={12} lg={9} xl={7}>
              <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
                <Title level={3} style={{ marginBottom: 0 }}>Administrador</Title>
                <Text type="secondary">Entre para editar o painel.</Text>
                <Divider style={{ margin: "12px 0" }} />

                <Form
                  layout="vertical"
                  onFinish={onLogin}
                  initialValues={{
                    email: saved.email,
                    password: saved.password,
                    remember: getRememberFlag(),
                  }}
                >
                  <Form.Item name="email" label="E-mail" rules={[{ required: true }]}>
                    <Input prefix={<MailOutlined />} placeholder="admin@..." />
                  </Form.Item>

                  <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Sua senha" />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox
                      onChange={(e) => {
                        if (!e.target.checked) clearSavedCreds();
                        else setRememberFlag(true);
                      }}
                    >
                      Tentar entrar automaticamente neste dispositivo
                    </Checkbox>
                  </Form.Item>

                  <Button type="primary" htmlType="submit" block size="large" style={{ borderRadius: 12 }}>
                    Entrar
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    );
  }

  // NOT ADMIN
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 18 }}>
        <Title level={2}>Admin</Title>
        <Alert
          type="error"
          showIcon
          message="Seu usuário não tem permissão de admin."
          description="Adicione um documento com o seu UID em /admins/{uid} no Firestore."
        />
        <Divider />
        <Button onClick={onLogout}>Sair</Button>
      </div>
    );
  }
// ADMIN EDITOR
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 18 }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>Admin — Landing Content</Title>
          <Text type="secondary">Edite e salve. Atualiza o site sem redeploy.</Text>
        </div>
        <Button onClick={onLogout}>Sair</Button>
      </Space>

      <Divider />

      {/* ✅ Tabs para escolher o slug */}
      <Card style={{marginBottom: 15}}>
      <Tabs
        activeKey={activeSlug}
        onChange={(k) => setActiveSlug(k)}
        items={[
          { key: "geral", label: "Geral" },
          // { key: "perfumes", label: "Perfumes" },
        ]}
      />
      </Card>

      <Form form={form} layout="vertical" disabled={loading}>
        <Card title="Brand" style={{ marginBottom: 14 }}>
          <Form.Item name="brand" label="Nome da marca">
            <Input />
          </Form.Item>
        </Card>

        <Card title="Hero" style={{ marginBottom: 14 }}>
          <Form.Item name={["hero", "kicker"]} label="Kicker (opcional)">
            <Input placeholder="ex: Acesso exclusivo" />
          </Form.Item>

          <Form.Item
            name={["hero", "titleParts"]}
            label="Título (1 linha por vez)"
            valuePropName="value"
            trigger="onChange"
            getValueFromEvent={(val) => val}
          >
            <LinesEditor placeholder="Cada linha vira um pedaço do título (titleParts)" />
          </Form.Item>

          <Form.Item
            name={["hero", "highlightWord"]}
            label="Texto destacado (mantém a palavra verde)"
          >
            <Input placeholder="ex: com até 70% de desconto." />
          </Form.Item>

          <Form.Item name={["hero", "subtitle"]} label="Subtítulo">
            <Input />
          </Form.Item>

          <Space style={{ width: "100%" }} direction="vertical" size={8}>
            <Form.Item name={["hero", "ctaText"]} label="Texto do CTA">
              <Input />
            </Form.Item>
            <Form.Item name={["hero", "ctaHref"]} label="Link do CTA (WhatsApp)">
              <Input />
            </Form.Item>
          </Space>

          <Form.Item name={["hero", "proofText"]} label="Prova social">
            <Input />
          </Form.Item>

          <Form.Item name={["hero", "urgencyText"]} label="Urgência">
            <Input />
          </Form.Item>
        </Card>

        {/* ✅ Benefits fixo (não edita) */}
        <Card title="Benefits (fixo no código)" style={{ marginBottom: 14 }}>
          <Text type="secondary">
            Esse bloco fica sempre ativo pelo código e não vem do Firestore.
          </Text>
        </Card>

        <Card title="Final CTA" style={{ marginBottom: 14 }}>
          <Form.Item name={["finalCta", "title"]} label="Título">
            <Input />
          </Form.Item>
          <Form.Item name={["finalCta", "ctaText"]} label="Texto do CTA">
            <Input />
          </Form.Item>
          <Form.Item name={["finalCta", "microText"]} label="Micro texto">
            <Input />
          </Form.Item>
        </Card>

        <Space>
          <Button type="primary" onClick={onSave} loading={saving}>
            Salvar e publicar
          </Button>

          <Button onClick={() => form.setFieldsValue({ ...defaultLandingContent, benefits: defaultLandingContent.benefits })}>
            Reset para padrão
          </Button>
        </Space>
      </Form>
    </div>
  );
}
