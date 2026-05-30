import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-card border-t border-border mt-20">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="BallBox" className="h-10 w-10 object-contain rounded-full" />
            <h3 className="font-display text-2xl font-bold tracking-wider">
              BALL<span className="text-primary">BOX</span>
            </h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Premium basketball gear for athletes who demand the best. Dominate every court.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm tracking-widest uppercase mb-4">Shop</h4>
          <div className="flex flex-col gap-2">
            <Link to="/shop?cat=shoes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Basketball Shoes</Link>
            <Link to="/shop?cat=socks" className="text-sm text-muted-foreground hover:text-primary transition-colors">Basketball Socks</Link>
            <Link to="/shop?cat=bracelets" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fan Bracelets</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm tracking-widest uppercase mb-4">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">Avis clients</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm tracking-widest uppercase mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
        © 2026 BallBox Basketball Shop. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
