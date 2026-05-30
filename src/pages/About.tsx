import { Target, Trophy, Users, Flame } from "lucide-react";

const About = () => {
  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      {/* Hero */}
      <section className="bg-card court-lines border-b border-border">
        <div className="container py-16 md:py-24">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-4">Our Story</p>
          <h1 className="font-display text-4xl md:text-7xl font-bold mb-6 max-w-3xl">
            BORN ON THE <span className="text-primary">COURT</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            HoopZone started in 2020 with a simple mission: create basketball gear that performs as hard as you do. 
            Founded by players, for players — we know what it takes to dominate.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">THE HOOPZONE DIFFERENCE</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every product we make is tested on the court by real athletes. We don't just design gear — we engineer it.
              From our reactive cushioning systems to our grip-enhanced socks, every detail is built for performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe great basketball gear shouldn't cost a fortune. That's why we cut out the middlemen
              and deliver premium quality directly to you at fair prices.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Trophy, label: "50K+", desc: "Athletes Equipped" },
              { icon: Target, label: "98%", desc: "Satisfaction Rate" },
              { icon: Users, label: "120+", desc: "Countries Shipped" },
              { icon: Flame, label: "4.8★", desc: "Average Rating" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={desc} className="bg-card border border-border rounded-lg p-6 text-center hover-lift">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-display text-2xl font-bold">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-card court-lines py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-4">Our Mission</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              EMPOWER EVERY <span className="text-primary">PLAYER</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're shooting hoops at the park or competing at the highest level, 
              HoopZone is here to fuel your game. We're building a community of athletes 
              who refuse to settle for anything less than their best.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
