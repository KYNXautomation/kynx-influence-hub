import { recordIds } from "../../../lib/model";
import { CreatorDesk } from "../../../components/CreatorDesk";

export const dynamicParams = false;

export function generateStaticParams() {
  return recordIds().map((id) => ({ id }));
}

export default async function CreatorPage({ params }) {
  const { id } = await params;
  return <CreatorDesk id={id} />;
}
