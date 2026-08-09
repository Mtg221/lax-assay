import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSettings } from "@/services/settings";

export default function StoreLayout() {
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    getSettings().then((s) => setWhatsapp(s.whatsappNumber));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton phoneDigits={whatsapp} />
    </div>
  );
}
