import { Github, Linkedin, Twitter } from 'lucide-react';
import React from 'react';
import { Separator } from './ui/separator';

function Footer() {
  return (
    <section className="w-full bg-background text-foreground px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h2 className="font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-all"> Nyaynetra</h2>
          <h3 className="text-lg md:text-xl text-muted-foreground">Smart Analysis. Faster Decisions</h3>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <h4 className="text-md font-semibold mb-2">Product</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Overview</li>
              <li>Features</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blogs</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Contact us</h2>
            <h3 className="text-sm text-muted-foreground">support@nyaynetra.ai</h3>
          </div>
          <div className="flex gap-4 text-muted-foreground">
            <Linkedin className="cursor-pointer hover:text-primary" />
            <Github className="cursor-pointer hover:text-primary" />
            <Twitter className="cursor-pointer hover:text-primary" />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <p className="text-sm text-center text-muted-foreground">
        © 2025 👁 Nyaynetra. All rights reserved.
      </p>
    </section>
  );
}

export default Footer;
