import { redirect } from "next/navigation";
import { signout } from "@/features/authentications/actions/signout";

export async function GET() {
  await signout();
  redirect("/");
}
