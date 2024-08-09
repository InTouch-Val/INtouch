import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  server: {
    open: true,
    port: 5273,
  },
  // Fix for `draft-js` package (https://github.com/facebook/fbjs/issues/290)
  define: {
    global: "window",
  },
  esbuild: {
    target: 'esnext',
    platform: 'linux',
  }
};
