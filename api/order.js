import nodemailer from "nodemailer";
import formidable from "formidable";

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
    try {
      if (err) {
        return res.status(500).json({ message: "Form error" });
      }

      const getField = (name) => {
        const value = fields[name];
        return Array.isArray(value) ? value[0] : value || "";
      };

      const order = JSON.parse(getField("order") || "[]");

      const customerName = getField("name");
      const customerPhone = getField("phone");
      const customerEmail = getField("email");
      const customerAddress = getField("address");
      const customerLine = getField("line");
      const customerWhatsApp = getField("whatsapp");
      const customerFacebook = getField("facebook");
      const customerInstagram = getField("instagram");
      const customerNote = getField("note");

      let total = 0;

      const orderList = order.map((item) => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        const priceText =
          item.price > 0
            ? `${item.price.toLocaleString()} THB x ${item.qty} = ${subtotal.toLocaleString()} THB`
            : `Price TBC x ${item.qty}`;

        return `${item.name} — ${priceText}`;
      }).join("\n");

      const slipFile = Array.isArray(files.slip)
        ? files.slip[0]
        : files.slip;

      const attachments = slipFile
        ? [
            {
              filename: slipFile.originalFilename || "payment-slip",
              path: slipFile.filepath
            }
          ]
        : [];

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const adminMessage = `
New Solaris Wine Order

Customer Information
Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}
Address: ${customerAddress}

LINE ID: ${customerLine || "-"}
WhatsApp: ${customerWhatsApp || "-"}
Facebook: ${customerFacebook || "-"}
Instagram: ${customerInstagram || "-"}

Order Summary
${orderList}

Total: ${total.toLocaleString()} THB

Customer Note
${customerNote || "-"}

Payment
Bank: Kasikorn Bank
Account No: 224-1-32112-9
Account Name: Solaris Intertrade Co., Ltd.
`;

      const customerMessage = `
Dear ${customerName},

Thank you for your order with Solaris Wine.

We have received your order information and payment slip.
Our team will verify the payment and contact you shortly.

Order Summary
${orderList}

Total: ${total.toLocaleString()} THB

Payment Account
Kasikorn Bank
Account No: 224-1-32112-9
Account Name: Solaris Intertrade Co., Ltd.

Best regards,
Solaris Wine
Solaris Intertrade Co., Ltd.
Email: order@solariswine.com
LINE: @solariswine
WhatsApp: +66 96 164 4422
`;

      await transporter.sendMail({
        from: `"Solaris Wine" <${process.env.EMAIL_USER}>`,
        to: "order@solariswine.com",
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

      return res.status(200).json({
        message: "Order sent successfully"
      });

    } catch (error) {
      console.error("Order API error:", error);

      return res.status(500).json({
        message: "Order email failed",
        error: error.message
      });
    }
  });
}
