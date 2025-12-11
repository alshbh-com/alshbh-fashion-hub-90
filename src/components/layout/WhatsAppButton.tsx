import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappNumber = "201204486263";
  const message = "مرحباً، أريد الاستفسار عن منتجاتكم";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-gold"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
