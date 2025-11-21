import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, photos } = req.body;

  if (!email || !photos || photos.length === 0) {
    return res.status(400).json({ error: "Email and photos are required" });
  }

  try {
    // Convert base64 images to attachments
    const attachments = photos.map((photo, index) => {
      // Remove data:image/jpeg;base64, prefix
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
      return {
        filename: `prism-photo-${index + 1}.jpg`,
        content: Buffer.from(base64Data, "base64"),
      };
    });

    const { data, error } = await resend.emails.send({
      from: "Prism Photo <onboarding@resend.dev>", // Update this with your verified domain
      to: [email],
      subject: "Ảnh của bạn từ Prism Photo",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #805AD5;">Cảm ơn bạn đã sử dụng Prism Photo!</h1>
          <p>Đính kèm là ${photos.length} ảnh đã được xử lý của bạn.</p>
          <p>Chúc bạn có những kỷ niệm đẹp!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            Prism Photo - Photobooth Online
          </p>
        </div>
      `,
      attachments: attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: error.message || "Failed to send email" });
    }

    return res.status(200).json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

