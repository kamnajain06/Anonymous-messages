import * as React from "react";
import { Html, Head, Preview, Body, Container, Heading, Text, Button } from "@react-email/components";

interface VerificationEmailProps {
    otp: string;
    username: string;
}
export default function VerificationEmail({ username, otp } : VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={styles.body}>
        <Container style={styles.container as React.CSSProperties}>
          <Heading style={styles.heading}>Verify Your Email</Heading>
                  <Text style={styles.text}>
                    Hello {username},
                    Your verification code is:
                    </Text>
          <Text style={styles.code}>{otp}</Text>
          <Text style={styles.text}>
            Please enter this code to complete your verification. If you did not request this, please ignore this email.
          </Text>
          <Button href={`http://localhost:3000/verify/${username}`} style={styles.button}>Verify Now</Button>
          <Text style={styles.footer}>If you have any questions, contact our support team.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: { backgroundColor: "#f3f4f6", padding: "20px", fontFamily: "Arial, sans-serif" },
  container: { backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", textAlign: "center" },
  heading: { color: "#333333" },
  text: { color: "#555555" },
  code: { fontSize: "24px", fontWeight: "bold", color: "#333333", margin: "10px 0" },
  button: { backgroundColor: "#007bff", color: "#ffffff", padding: "10px 20px", textDecoration: "none", borderRadius: "5px", display: "inline-block", marginTop: "15px" },
  footer: { fontSize: "12px", color: "#777777", marginTop: "20px" }
};