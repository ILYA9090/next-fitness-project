import { Resend } from "resend";

export const sendEmail = async (
  to: string,
  subject: string,
  template: React.ReactNode | string,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const isStringTemplate = typeof template === "string";

  const { data, error } = await resend.emails.send({
    from: "noreply@ilya-fitness.online",
    to,
    subject,
    text: isStringTemplate ? template : "",
    react: isStringTemplate ? undefined : template,
    html: isStringTemplate ? template : undefined,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }

  return data;
};
