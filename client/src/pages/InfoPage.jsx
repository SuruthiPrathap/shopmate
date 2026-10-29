import React from "react";
import { ArrowLeft, HelpCircle, RotateCcw, Truck, Lock, FileText, ShieldCheck } from "lucide-react";

// Text for the footer pages. Edit the words here any time.
const TOPICS = {
  help: {
    title: "Help Center",
    icon: HelpCircle,
    intro: "Answers to common questions about shopping on ShopMate.",
    sections: [
      { heading: "How do I place an order?", body: "Open a product, choose a size if it asks for one, and click Buy Now. Or add items to your cart and click Proceed to Checkout. Sign in with a customer account, enter your delivery address, choose a payment method and click Place Order." },
      { heading: "Which payment methods can I use?", body: "Cash on Delivery and UPI. For UPI you type your own UPI ID at checkout." },
      { heading: "How do I track my order?", body: "Open My Profile, then My Orders, and click Track order. You can also use the Track Order link at the bottom of any page. The tracker shows Order Placed, Processing, Shipped and Delivered." },
      { heading: "Can I cancel an order?", body: "Yes. You can cancel from My Orders within 24 hours of placing the order, while it is still Processing. Once an order is shipped it can no longer be cancelled." },
      { heading: "How do I sell on ShopMate?", body: "Click Become a Seller and fill in the form with your GSTIN or Udyam number and a business document. Our team checks your details before your store is approved." },
      { heading: "Still need help?", body: "Email support@shopmate.com or call +91 1800-123-4567." },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    icon: RotateCcw,
    intro: "If something is not right with your order, we will help you fix it.",
    sections: [
      { heading: "7-day replacement", body: "If you receive a damaged, defective or wrong item, you can ask for a replacement within 7 days of delivery." },
      { heading: "How to ask for a return", list: ["Email support@shopmate.com with your order number and clear photos of the item.", "We reply with the next steps and arrange the pick-up.", "Once the item is checked, we send the replacement or the refund."] },
      { heading: "Refunds", body: "Refunds are processed after the returned item is checked, usually within 5 to 7 business days." },
      { heading: "Items that cannot be returned", list: ["Used or washed clothing and footwear", "Innerwear and personal care items that have been opened", "Items without their original packaging or tags"] },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    icon: Truck,
    intro: "How and when your order reaches you.",
    sections: [
      { heading: "Delivery charges", body: "Orders above ₹1,000 ship free. A flat delivery fee of ₹99 applies to smaller orders." },
      { heading: "Delivery time", body: "Orders are packed within 1 to 2 business days. Delivery usually takes 3 to 7 business days, depending on your location." },
      { heading: "Delivery area", body: "We deliver across India. Please enter a correct 6 digit PIN code at checkout." },
      { heading: "Order status", body: "Follow your order from My Orders: Order Placed, Processing, Shipped and Delivered." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    icon: Lock,
    intro: "What we collect, why we collect it, and how we keep it safe.",
    sections: [
      { heading: "What we collect", list: ["Your name, email address and phone number", "Your delivery address and your orders", "For sellers: business name, GSTIN or Udyam number and the business document you upload"] },
      { heading: "How we use it", body: "To create your account, deliver your orders, verify sellers and answer your questions." },
      { heading: "How we protect it", body: "Passwords are stored in a scrambled (hashed) form, never as plain text. Seller documents can only be opened by ShopMate admins." },
      { heading: "Sharing", body: "We do not sell your personal data. Your delivery details are used only to fulfil your order." },
      { heading: "Your choices", body: "You can ask us to delete your account by writing to support@shopmate.com." },
    ],
  },
  terms: {
    title: "Terms of Service",
    icon: FileText,
    intro: "The simple rules for using ShopMate.",
    sections: [
      { heading: "Using ShopMate", body: "Please give correct details and keep your password private. You are responsible for activity on your account." },
      { heading: "Orders and prices", body: "Prices are shown in Indian rupees. Prices and stock can change, and the price at the time you place your order is the price you pay." },
      { heading: "Cancellations and returns", body: "Orders can be cancelled within 24 hours while they are Processing. Returns follow our Returns & Refunds page." },
      { heading: "Sellers", body: "Sellers must give valid registration details. Accounts with false or unverifiable details are rejected or removed." },
      { heading: "Changes", body: "We may update these terms from time to time. Using the site after a change means you accept the new terms." },
    ],
  },
  security: {
    title: "Security",
    icon: ShieldCheck,
    intro: "How ShopMate keeps your account and your shopping safe.",
    sections: [
      { heading: "Your account", body: "Passwords are hashed, and you stay signed in with a secure token that expires." },
      { heading: "Payments", body: "We never ask for or store your card details. For UPI we only keep the UPI ID you type, so your order can be matched with your payment." },
      { heading: "Seller verification", body: "Every seller must give a valid GSTIN or Udyam number and a business document. An admin checks the number on the official government portal before the store goes live." },
      { heading: "Stay safe", list: ["Never share your UPI PIN, card PIN or OTP with anyone.", "ShopMate staff will never ask for your password or PIN.", "Report anything suspicious to support@shopmate.com."] },
    ],
  },
};

function InfoPage({ topic = "help", onBackToHome }) {
  const page = TOPICS[topic] || TOPICS.help;
  const Icon = page.icon;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 16px 60px" }}>
      <button className="back-btn-pill" onClick={onBackToHome} style={{ marginBottom: "16px" }}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.7rem", margin: "0 0 6px", color: "#0f172a" }}>
          <Icon size={28} color="#2874f0" /> {page.title}
        </h1>
        <p style={{ color: "#64748b", margin: "0 0 22px" }}>{page.intro}</p>

        {page.sections.map((section) => (
          <div key={section.heading} style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", margin: "0 0 6px", color: "#1e293b" }}>{section.heading}</h3>
            {section.body && <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{section.body}</p>}
            {section.list && (
              <ul style={{ margin: "4px 0 0", paddingLeft: "20px", color: "#475569", lineHeight: 1.7 }}>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <p style={{ marginTop: "28px", paddingTop: "14px", borderTop: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "12px" }}>
          ShopMate is a demo project, so this page is sample text.
        </p>
      </div>
    </div>
  );
}

export default InfoPage;