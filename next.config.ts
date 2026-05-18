/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true, // <--- ESTA ES LA MAGIA. Activalo sí o sí.
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig