

import HeaderPelapor from "@/components/pelapor/partials/header";
import FooterPelapor from "@/components/pelapor/partials/footer";

export default function PelaporLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderPelapor />
      <main className="flex-grow  p-4 pt-16">{children}</main>
      <FooterPelapor />
    </div>
  );
}