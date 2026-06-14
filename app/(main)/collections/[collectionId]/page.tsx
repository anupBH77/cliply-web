import Collection from "@/components/collection/collection";

interface CollectionPageProps {
  params: Promise<{ collectionId: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const { collectionId } = resolvedParams;


  return (
    <Collection collectionId={collectionId} />
  );
}
