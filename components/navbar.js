"use client";
import { useState, useEffect } from "react";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitch from "./themeSwitch";
import { cx } from "@/utils/all";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/50 dark:bg-dark-background/50 backdrop-blur-md"
          : "bg-transparent"
      )}>
      <Container large={true}>
        <nav className="flex items-center justify-between py-4 px-8 xl:px-5">
          <div>
            <Link href="/">
              <Image
                src="/img/diabol-logo-black.png"
                width={150}
                height={30}
                alt="Diabol AI Logo"
                priority={true}
                className="dark:hidden"
              />
              <Image
                src="/img/diabol-logo-white.png"
                width={150}
                height={30}
                alt="Diabol AI Logo"
                priority={true}
                className="hidden dark:block"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <ThemeSwitch />
          </div>
        </nav>
      </Container>
    </div>
  );
}
