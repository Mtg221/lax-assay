import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { listFeaturedProducts } from "@/services/products";
import { getSettings } from "@/services/settings";
import { optimizedUrl } from "@/lib/cloudinary";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product, StoreSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/services/settings";

export default function Home() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listFeaturedProducts(), getSettings()])
      .then(([f, s]) => {
        setFeatured(f);
        setSettings(s);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[86vh] min-h-[560px] overflow-hidden">
        {settings.heroImageUrl ? (
          <img
            src={optimizedUrl(settings.heroImageUrl, 1600)}
            alt="Laxassaye — écharpes premium"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sand via-cream to-caramel/30 dark:from-espresso dark:via-ink dark:to-bark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="relative h-full container-lax flex flex-col justify-end pb-20">
          <p className="eyebrow text-cream mb-4">Laxassaye</p>
          <h1 className="font-display text-4xl sm:text-6xl text-cream max-w-2xl leading-[1.05] italic">
            {settings.heroSlogan}
          </h1>
          <Link to="/boutique" className="btn-primary mt-8 w-fit">
            {t.hero.cta}
          </Link>
        </div>
      </section>

      {/* Featured */}
      {!loading && featured.length > 0 && (
        <section className="container-lax py-24">
          <p className="eyebrow mb-2">Laxassaye</p>
          <h2 className="font-display text-3xl mb-10">{t.home.featured}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="container-lax py-24 border-t border-line dark:border-espresso">
        <div className="max-w-2xl mx-auto text-center">
          <p className="eyebrow mb-3">Depuis Dakar</p>
          <h2 className="font-display text-3xl mb-5">{t.home.aboutTitle}</h2>
          <p className="text-espresso/70 dark:text-cream/70 leading-relaxed mb-8">{settings.aboutText}</p>
          <Link to="/boutique" className="btn-secondary">
            {t.home.shopCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
