import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: `The terms that apply when you buy from ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of sale" updated="2 November 2026">
      <section>
        <h2>The basics</h2>
        <p>
          These terms apply to every order placed on this website with {siteConfig.name}, a T-shirt label based in
          Pakistan. By placing an order you agree to them. If anything here is unclear, email{" "}
          <a href={`mailto:${siteConfig.social.email}`} className="underline underline-offset-4">
            {siteConfig.social.email}
          </a>{" "}
          before you buy.
        </p>
      </section>

      <section>
        <h2>Prices and payment</h2>
        <p>
          All prices are in Pakistani rupees and include any applicable taxes. Shipping is{" "}
          {formatPrice(siteConfig.flatShipping)} per order and free on orders over{" "}
          {formatPrice(siteConfig.freeShippingThreshold)}. Payment is taken in full when you place the order. We may
          correct an obvious pricing mistake before dispatch; if we do, you can cancel for a full refund.
        </p>
      </section>

      <section>
        <h2>Orders and dispatch</h2>
        <p>
          An order is accepted when we send the dispatch email. We aim to dispatch within two working days. Delivery
          times depend on the courier and your location. If something is out of stock after you order, we refund that
          item straight away.
        </p>
      </section>

      <section>
        <h2>Returns and exchanges</h2>
        <p>
          You can return any tee within 30 days of delivery for a refund or exchange, as long as it is unworn,
          unwashed and in its original condition. Email us with your order number to start a return. Return shipping
          is at your cost unless the item arrived faulty or we sent the wrong thing, in which case we cover it and
          refund in full. Refunds go back to the original payment method within ten working days of us receiving the
          item.
        </p>
      </section>

      <section>
        <h2>Sizing and fit</h2>
        <p>
          Measurements for each size are on the{" "}
          <Link href="/about#sizing" className="underline underline-offset-4">
            size guide
          </Link>
          . Tees are pre-washed, so the size you receive is the size you keep. Between sizes, go one up.
        </p>
      </section>

      <section>
        <h2>Our designs</h2>
        <p>
          The prints, photographs, name and logo on this site belong to {siteConfig.name}. Please do not reproduce
          them without asking.
        </p>
      </section>

      <section>
        <h2>Liability</h2>
        <p>
          We are responsible for the tees we sell being as described and fit for wearing. We are not responsible for
          losses that are not a foreseeable result of our mistake, or that arise from your own misuse of the product.
          Nothing in these terms limits rights you have under Pakistani consumer law.
        </p>
      </section>

      <section>
        <h2>Law</h2>
        <p>
          These terms are governed by the laws of Pakistan. See also our{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}
