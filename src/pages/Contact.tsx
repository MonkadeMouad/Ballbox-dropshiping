import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message envoyé ! Nous vous répondrons dans les 24h.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <section className="bg-card court-lines border-b border-border">
        <div className="container py-10 md:py-16">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Nous contacter</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">CONTACT</h1>
          <p className="text-muted-foreground">On est là pour vous aider</p>
        </div>
      </section>

      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

          {/* Formulaire */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">ENVOYER UN MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required name="name" placeholder="Votre nom"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <input
                  required name="email" type="email" placeholder="Adresse email"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <input
                required name="subject" placeholder="Sujet"
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <textarea
                required name="message" rows={5} placeholder="Votre message..."
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-105"
              >
                <Send className="w-4 h-4" /> Envoyer
              </button>
            </form>
          </div>

          {/* Infos de contact */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">NOS COORDONNÉES</h2>
            <div className="space-y-4">
              {[
                { icon: Mail,    text: "mrballbox@gmail.com" },
                { icon: Phone,   text: "+212 652744953" },
                { icon: MapPin,  text: "El Jadida, Maroc" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                  <div className="p-3 bg-muted rounded-lg shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>


          </div>

        </div>
      </div>
    </main>
  );
};

export default Contact;
