import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  confirmationLink: string;
}

export const WelcomeTemplate = ({
  name,
  confirmationLink,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>We&lsquo;d love to hear your thoughts on our app!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          Welcome to Product feedback, Your feedback is invaluable to us as we
          strive to provide the best experience possible. Please let us know
          what you liked and where we can improve.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={confirmationLink}>
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Best Regards,
          <br />
          Product feedback
        </Text>
        <Hr style={hr} />
        <Text style={footer}>product@soufian.me</Text>
      </Container>
    </Body>
  </Html>
);

WelcomeTemplate.PreviewProps = {
  name: "Alan",
} as WelcomeEmailProps;

export default WelcomeTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#AD1FEA",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "180px",
  padding: "14px 7px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
