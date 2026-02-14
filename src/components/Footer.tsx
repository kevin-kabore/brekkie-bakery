import { CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy text-cream py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl">BREKKIE</p>
            <p className="font-script text-coral text-lg">Banana Bread</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-cream/80 hover:text-coral transition-colors duration-200 block"
            >
              {CONTACT.email}
            </a>
            <p className="text-cream/80 mt-2">{CONTACT.address}</p>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-cream/80 hover:text-coral transition-colors duration-200"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-cream/80 hover:text-coral transition-colors duration-200"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-cream/20 mt-12 pt-6">
          <p className="text-center text-cream/50 text-sm">
            &copy; 2026 Brekkie LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
