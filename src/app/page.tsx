import { HomeView } from "@/components/home/HomeView";
import { getPublicHome } from "@/lib/content/get-public-home";

export default function HomePage() {
  const content = getPublicHome();
  return <HomeView content={content} />;
}
