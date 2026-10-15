import { creatorIds } from "../../../lib/model";
import { CreatorDesk } from "../../../components/CreatorDesk";

export const dynamicParams = false;

export function generateStaticParams() {
  return creatorIds().map((id) => ({ id: String(id) }));
}

export default async function CreatorPage({ params }) {
  const { id } = await params;
  return <CreatorDesk id={Number(id)} />;
}
