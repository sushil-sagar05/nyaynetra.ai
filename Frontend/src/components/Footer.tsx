import { Github, Linkedin, Twitter, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import React from 'react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

function Footer() {
  const productLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Contact', href: '#contact' },
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '#docs' },
    { name: 'Help Center', href: '#help' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Blog', href: '#blog' },
  ];

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      icon: <Linkedin className="w-5 h-5" />, 
      href: 'https://www.linkedin.com/in/sushil-sagar09/',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    { 
      name: 'GitHub', 
      icon: <Github className="w-5 h-5" />, 
      href: 'https://github.com/sushil-sagar05/nyaynetra.ai',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    { 
      name: 'Twitter', 
      icon: <Twitter className="w-5 h-5" />, 
      href: 'https://x.com/noob_sagarr',
      color: 'hover:text-sky-500 dark:hover:text-sky-400'
    },
  ];

  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer inline-block">
                👁 NyayNetra
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Smart Analysis. Faster Decisions.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                Revolutionizing legal document analysis with AI-powered insights, helping professionals make informed decisions with confidence and speed.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                Get in Touch
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a 
                    href="mailto:support@nyaynetra.ai" 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    support@nyaynetra.ai
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Patna, India</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-md`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Stay Updated
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get the latest updates on new features and legal tech insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 min-w-0 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 text-sm whitespace-nowrap flex-shrink-0">
           Subscribe
        </Button>
        </div>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 👁 NyayNetra. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms
              </a>
              <span>•</span>
              <a href="#cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
