export interface IGood {
  link: string;
  text: string;
  images: string[];
  data?: {
    title: string;
    description: string;
    price: string;
    attributes: string;
  };
}
