type HeroVideoProps = {
  src: string;
  label?: string | null;
  autoPlay?: boolean;
};

export function HeroVideo({ src, label, autoPlay = true }: HeroVideoProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg">
      <video
        className="js-hero-video absolute inset-0 block h-full w-full object-cover"
        src={src}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label ?? "Hero video"}
      />
    </section>
  );
}
