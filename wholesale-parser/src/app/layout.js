export const metadata = {
  title: "Wholesale Order Parser",
  description: "Parse wholesale orders into Matrixify-ready CSV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f9f9f8" }}>
        {children}
      </body>
    </html>
  );
}
