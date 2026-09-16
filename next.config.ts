import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/comprar.html",
        destination: "/propiedades",
        permanent: true,
      },
      {
        source: "/ads/venta/inmueble",
        destination: "/propiedades",
        permanent: true,
      },
      {
        source: "/default.aspx",
        destination: "/",
        permanent: true,
      },
      {
        source: "/conocenos.html",
        destination: "/conocenos",
        permanent: true,
      },
      {
        source: "/contacto.html",
        destination: "/#lead-form",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.apinmo.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
