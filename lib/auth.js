import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Pastikan kita buat ini nanti

export async function getSession(req) {
  return await getServerSession(authOptions);
}
