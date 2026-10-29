import { PublicFrame } from "../../../components/PublicFrame";
import { ArtistProfile } from "../../../components/ArtistProfile";
import { creators } from "../../../lib/model";

export const dynamicParams = false;

export function generateStaticParams() {
  return creators.filter((creator) => creator.showcase).map((creator) => ({ id: creator.id }));
}

export default async function ArtistPage({ params }) {
  const { id } = await params;
  return (
    <PublicFrame>
      <ArtistProfile id={id} />
    </PublicFrame>
  );
}
