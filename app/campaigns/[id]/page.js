import { campaignIds } from "../../../lib/model";
import { CampaignDesk } from "../../../components/CampaignDesk";

export const dynamicParams = false;

export function generateStaticParams() {
  return campaignIds().map((id) => ({ id: String(id) }));
}

export default async function CampaignPage({ params }) {
  const { id } = await params;
  return <CampaignDesk id={Number(id)} />;
}
