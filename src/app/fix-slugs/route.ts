import { fixAllSlugs } from "@/actions/work";

export async function GET() {
  const result = await fixAllSlugs();
  return Response.json(result);
}
