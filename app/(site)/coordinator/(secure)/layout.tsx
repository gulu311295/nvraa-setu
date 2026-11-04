import { isCoordinatorAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CoordinatorSecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isCoordinatorAuthenticated())) {
    redirect("/coordinator/login");
  }
  return children;
}
