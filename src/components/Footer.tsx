import { Instagram, Mail, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-espresso text-cream py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-display text-3xl">Brekkie</p>
            <p className="font-accent text-xl text-crust">
              Protein Banana Bread
            </p>
            <p className="text-cream/50 text-sm mt-4 max-w-xs">
              Sweet enough for dessert. Smart enough for breakfast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              <a
                href="#products"
                className="text-cream/60 hover:text-crust transition-colors text-sm"
              >
                Products
              </a>
              <a
                href="#why"
                className="text-cream/60 hover:text-crust transition-colors text-sm"
              >
                Why Brekkie
              </a>
              <a
                href="#story"
                className="text-cream/60 hover:text-crust transition-colors text-sm"
              >
                Our Story
              </a>
              <a
                href="#order"
                className="text-cream/60 hover:text-crust transition-colors text-sm"
              >
                Order
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-cream/60 hover:text-crust transition-colors text-sm flex items-center gap-2"
              >
                <Mail size={16} />
                {CONTACT.email}
              </a>
              <p className="text-cream/60 text-sm flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                {CONTACT.address}
              </p>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/60 hover:text-crust transition-colors text-sm flex items-center gap-2"
              >
                <Instagram size={16} />
                @brekkiebakery
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-xs">
            &copy; {new Date().getFullYear()} Brekkie LLC. All rights reserved.
          </p>
          <p className="font-accent text-cream/40 text-sm">
            Made with love in NYC
          </p>
        </div>
      </div>
    </footer>
  );
}
