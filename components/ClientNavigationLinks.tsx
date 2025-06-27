"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ClientNavigationLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/code", label: "Code Example" },
    { href: "/", label: "Small Dataset" },
    { href: "/largedataset", label: "Large Dataset" },
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-medium transition-colors ${
              isActive
                ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                : "hover:text-blue-600"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
} 