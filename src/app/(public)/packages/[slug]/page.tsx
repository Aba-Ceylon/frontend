export default function PackagePage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Package: {params.slug}</h1>
    </div>
  );
}