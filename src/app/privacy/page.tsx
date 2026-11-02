import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${siteConfig.name} collects and uses your information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="2 November 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          {siteConfig.name} is a T-shirt label based in Pakistan. This policy explains what we collect when you use
          this website, why, and what you can do about it. Questions go to{" "}
          <a href={`mailto:${siteConfig.social.email}`} className="underline underline-offset-4">
            {siteConfig.social.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Order details.</strong> Your name, email address, phone number, shipping address and what you
            bought. We need these to take payment, ship your order and answer questions about it.
          </li>
          <li>
            <strong>Payment.</strong> Card details are entered on our payment provider&apos;s secure page and never
            touch our servers. We receive only a confirmation and the last four digits of the card.
          </li>
          <li>
            <strong>Your cart.</strong> Items you add are stored in your own browser (local storage) so they are
            still there when you come back. Nothing about your cart is sent to us until you check out.
          </li>
          <li>
            <strong>Usage data.</strong> Pages viewed, products viewed, items added to the cart and purchases, via the
            Meta Pixel and the Meta Conversions API (see below). Our hosting provider also keeps standard server logs
            (IP address, browser, time of request) for security.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advertising and the Meta Pixel</h2>
        <p>
          We use the Meta Pixel and Conversions API so we can measure our Facebook and Instagram ads and show ads
          to people who have visited the site. Meta receives the pages and products you looked at, what you added to
          the cart, and on a purchase the order value and a hashed (unreadable) version of your email address, your IP
          address and browser type. Meta uses this according to its own data policy. You can limit ad personalisation
          in your Facebook and Instagram ad settings, and you can block the pixel with a browser extension or by
          turning on tracking protection in your browser.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          The site itself sets no tracking cookies. The Meta Pixel sets its own cookies (_fbp and, after clicking an ad,
          _fbc) to recognise your browser. Your cart lives in local storage, not a cookie.
        </p>
      </section>

      <section>
        <h2>Who we share data with</h2>
        <ul>
          <li>Our payment provider, to process your payment.</li>
          <li>Our courier, to deliver your order (name, address, phone).</li>
          <li>Meta, for advertising measurement as described above.</li>
          <li>Our hosting provider, which stores the site and its logs.</li>
        </ul>
        <p>We do not sell your data and we do not share it with anyone else unless the law requires it.</p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Order records are kept for as long as we need them for accounting and returns, normally seven years.
          Server logs are kept for a few weeks. Ad measurement data is kept by Meta according to its policy.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          Email us to see what we hold about you, to correct it, or to have it deleted where we are not required to
          keep it. Clearing your browser&apos;s site data removes your cart and the pixel cookies.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If this policy changes we update the date at the top. See also our{" "}
          <Link href="/terms" className="underline underline-offset-4">
            terms of sale
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}
