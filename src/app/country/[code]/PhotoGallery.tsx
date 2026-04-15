import Image from "next/image";
import { getCountryPhotos } from "@/lib/pexels";

export async function PhotoGallery({ countryName }: { countryName: string }) {
  const photos = await getCountryPhotos(countryName, 6);

  // Skip if only 1 photo (already used as hero)
  if (photos.length <= 1) return null;

  // Use photos 2-6 (first one is the hero)
  const galleryPhotos = photos.slice(1);

  return (
    <section className="mb-10">
      <h2 className="mb-2 font-display text-2xl font-semibold">Photo Gallery</h2>
      <p className="mb-4 text-sm text-foreground/50">
        Travel photography from {countryName}
      </p>

      {/* Masonry-style gallery */}
      <div className="columns-2 gap-3 sm:columns-3">
        {galleryPhotos.map((photo, i) => (
          <div key={photo.id} className="mb-3 break-inside-avoid overflow-hidden rounded-xl">
            <div className={`relative w-full ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/3]" : "aspect-square"}`}>
              <Image
                src={photo.srcSmall}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <p className="mt-1 text-[10px] text-foreground/40">
              Photo by{" "}
              <a
                href={photo.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent hover:underline"
              >
                {photo.photographer}
              </a>{" "}
              on Pexels
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
