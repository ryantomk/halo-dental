import type { ReactNode } from "react";

// TODO: Compose Header, Footer, FloatingWhatsAppButton, and
// FloatingBookingWidget around {children} per technical spec Section 4
// (every public page shares this chrome; /admin does not).

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
      {/* <FloatingWhatsAppButton /> */}
      {/* <FloatingBookingWidget /> */}
    </>
  );
}
