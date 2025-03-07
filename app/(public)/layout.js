import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/partials/header";


export const metadata = {
  title: "LAPOR KK BUPATI",
  description: "Sampaikan laporan Anda melalui LAPOR KK BUPATI",
};

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
