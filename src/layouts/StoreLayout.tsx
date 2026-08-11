import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSettings } from "@/contexts/SettingsContext";

export default function StoreLayout() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton phoneDigits={settings.whatsappNumber} />
    </div>
  );
}
