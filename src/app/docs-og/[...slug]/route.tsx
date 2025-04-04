import { generateOGImage } from "fumadocs-ui/og";
import { metadataImage } from "@/lib/metadata";

export const GET = metadataImage.createAPI((page) => {
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "zen docs",
    primaryColor: "#F76F53",
    primaryTextColor: "#D1CFC0",
  });
});

export function generateStaticParams() {
  return metadataImage.generateParams();
}
