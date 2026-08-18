import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface VerificationUserProps {
  code: string;
}

export const VerificationUser = ({ code }: VerificationUserProps) => {
  return (
    <Html>
      <Head />
      <Preview>Подтверждение регистрации</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Подтверждение регистрации</Heading>
          <Text style={text}>Ваш код подтверждения:</Text>
          <Text style={codeStyle}>{code}</Text>
          <Link
            href={`http://localhost:3000/api/auth/verify?code=${code}`}
            style={link}
          >
            Подтвердить регистрацию
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "1.5",
  marginBottom: "16px",
};

const codeStyle = {
  backgroundColor: "#f0f0f0",
  borderRadius: "4px",
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  padding: "10px 20px",
  textAlign: "center" as const,
  display: "inline-block",
};

const link = {
  backgroundColor: "#4F46E5",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  padding: "12px 24px",
  textDecoration: "none",
};
