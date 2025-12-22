import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "NR-01", href: "/nr01" },
        { label: "Riscos Psicossociais", href: "/riscos-psicossociais" },
        { label: "Sobre", href: "/sobre" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl gradient-instagram flex items-center justify-center transition-transform group-hover:scale-110">
                            <Zap className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl gradient-instagram-text">HumaniQ AI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === item.href
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link to="/auth">
                            <Button size="sm">Login</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background absolute w-full">
                    <div className="px-4 py-4 space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block text-base font-medium transition-colors",
                                    location.pathname === item.href
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-border">
                            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full">Acessar Plataforma</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
