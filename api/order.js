import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Form error" });
    }

    const order = JSON.parse(fields.order || "[]");

    const customerEmail = fields.email?.[0] || fields.email || "";
    const customerName = fields.name?.[0] || fields.name || "";

    const orderList = order.map(item =>
      `${item.name} x ${item.qty} = ${item.price * item.qty} THB`
    ).join("\n");

    const total = order.reduce((sum, item) => {
      return sum + item.price * item.qty;
    }, 0);

    const slipFile = files.slip?.[0] || files.slip;

    const attachments = slipFile ? [
      {
        filename: slipFile.originalFilename || "payment-slip",
        path: slipFile.filepath
      }
    ] : [];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const adminMessage = `
New Solaris Wine Order

Customer:
Name: ${customerName}
Phone: ${fields.phone}
Email: ${customerEmail}
Address: ${fields.address}

LINE ID: ${fields.line}
WhatsApp: ${fields.whatsapp}
Facebook: ${fields.facebook}
Instagram: ${fields.instagram}

Order:
${orderList}

Total: ${total.toLocaleString()} THB

Note:
${fields.note || "-"}
`;

    const customerMessage = `
Dear ${customerName},

Thank you for your order with Solaris Wine.

Order Summary:
${orderList}

Total: ${total.toLocaleString()} THB

We have received your order information and payment slip.
Our team will verify the payment and contact you shortly.

Best regards,
Solaris Wine
Solaris Intertrade Co., Ltd.
orders@solariswine.com
`;

    await transporter.sendMail({
      from: `"Solaris Wine" <${process.env.EMAIL_USER}>`,
      to: "orders@solariswine.com",
      subject: "New Solaris Wine Order",
      text: adminMessage,
      attachments
    });

    await transporter.sendMail({
      from: `"Solaris Wine" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: "Thank you for your Solaris Wine order",
      text: customerMessage
    });

    return res.status(200).json({ message: "Order sent" });
  });
}
