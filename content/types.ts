export type BrandMedia = {
  logo: string;
  /** [0] = landing grid, [1] = case-study page */
  images: string[][];
  videos: string[];
};

export type Brand = {
  title: string;
  slug: string;
  caption: string;
  description: string;
  media: BrandMedia;
};

export type Category = {
  title: string;
  slug: string;
  brands: Brand[];
};

export type LandingSection = {
  id: string;
  title: string | null;
  description: string | null;
  locations: string | null;
  video: string | null;
  clients: string[];
};

export type Content = {
  clients: {
    categories: Category[];
  };
  landing: {
    sections: LandingSection[];
  };
};
