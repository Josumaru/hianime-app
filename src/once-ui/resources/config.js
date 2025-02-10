const baseURL = "anime.josumaru.my.id";

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "dark", // dark | light
  neutral: "gray", // sand | gray | slate
  brand: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "contrast", // color | contrast | inverse
  solidStyle: "flat", // flat | plastic
  border: "playful", // rounded | playful | conservative
  surface: "filled", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

// default metadata
const meta = {
  title: "Animanga",
  description:
    "A platform to explore, watch your favorite anime, and read manga seamlessly in one place.",
};

// default open graph data
const og = {
  title: "Animanga",
  description: "A platform to explore, watch your favorite anime, and read manga seamlessly in one place.",
  type: "website",
  image: "/images/cover.jpg"
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "Animanga",
  description: "A platform to explore, watch your favorite anime, and read manga seamlessly in one place.",
  email: "",
};

// social links
const social = {
  twitter: "https://www.twitter.com/josumaru",
  linkedin: "https://www.linkedin.com/josumaru/",
  discord: "https://discord.com/",
};

export { baseURL, style, meta, og, schema, social };
