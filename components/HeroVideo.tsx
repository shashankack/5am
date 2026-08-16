type HeroVideoProps = {
  src: string;
  label?: string | null;
};

export function HeroVideo({ src, label }: HeroVideoProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg">
      <video
        className="absolute inset-0 block h-full w-full scale-[1.02] object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label ?? "Hero video"}
      />
    </section>
  );
}
