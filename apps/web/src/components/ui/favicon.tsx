import * as React from "react";

interface FaviconProps {
  baseUrl?: string;
}

export function Favicon({ baseUrl = "" }: FaviconProps) {
  const faviconLinks = [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: `${baseUrl}/apple-touch-icon.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: `${baseUrl}/favicon-32x32.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: `${baseUrl}/favicon-16x16.png`,
    },
    {
      rel: "manifest",
      href: `${baseUrl}/site.webmanifest`,
    },
    {
      rel: "mask-icon",
      href: `${baseUrl}/safari-pinned-tab.svg`,
      color: "#0f172a",
    },
  ];

  return (
    <>
      {faviconLinks.map((link) => (
        <link key={`${link.rel}-${link.sizes || ""}`} {...link} />
      ))}
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
}

// Basic SVG raw content for the favicon (can be used to generate actual files)
export const faviconSvg = `<svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M400 0C179.085 0 0 179.085 0 400C0 620.915 179.085 800 400 800C620.915 800 800 620.915 800 400C800 179.085 620.915 0 400 0Z"
    fill="#ffffff"
  />
  <path
    d="M66.667 400.001C66.667 215.822 215.822 66.6675 400 66.6675C584.178 66.6675 733.334 215.822 733.334 400.001C733.334 584.179 584.178 733.334 400 733.334C215.822 733.334 66.667 584.179 66.667 400.001Z"
    fill="#ffffff"
    stroke="#0f172a"
    stroke-width="40"
  />
  <path
    d="M133.334 400.001C133.334 252.223 252.223 133.334 400 133.334C547.777 133.334 666.667 252.223 666.667 400.001C666.667 547.778 547.777 666.667 400 666.667C252.223 666.667 133.334 547.778 133.334 400.001Z"
    fill="white"
    stroke="#0f172a"
    stroke-width="10"
  />
  <rect x="133.334" y="133.334" width="533.333" height="200" fill="#0f172a" />
  <text
    x="400"
    y="243.334"
    font-family="monospace"
    font-size="120"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    {"}"}
    <tspan dx="120">{"}"}</tspan>
  </text>
  <path
    d="M550 433.334L366.667 616.667L250 500.001"
    stroke="#0f172a"
    stroke-width="60"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;
