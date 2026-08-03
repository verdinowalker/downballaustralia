import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Downball Australia",
    short_name: "Downball",
    description: "The official Downball Australia competition platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#f5c518"
  };
}
