import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = { title: "Contact", description: "Contact Downball Australia." };

export default async function ContactPage() {
  const { settings } = await getSiteData();
  return (
    <>
      <section className="page-hero"><div className="shell"><span className="eyebrow">Get in touch</span><h1>Contact</h1><p>Questions about competitions, clubs or the website? Send us a message.</p></div></section>
      <section className="section shell contact-layout">
        <div>
          <h2>Downball Australia</h2>
          <a href={`mailto:${settings.contactEmail}`}><Mail size={19} /><span><small>Email</small>{settings.contactEmail}</span></a>
          <a href={`tel:${settings.contactPhone.replace(/\D/g, "")}`}><Phone size={19} /><span><small>Phone</small>{settings.contactPhone}</span></a>
          <div><MapPin size={19} /><span><small>Location</small>{settings.location}</span></div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
