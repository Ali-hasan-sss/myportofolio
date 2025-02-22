import useSocialMediaStore from "@/store/useSocialMediaStore";
import { useEffect } from "react";
import Loader from "../loader";
interface social {
  iconUrl: string;
  url: string;
  _id: string;
}

export default function SocialNedia() {
  const { fetchSocialLinks, socialLinks, loading } = useSocialMediaStore();
  useEffect(() => {
    fetchSocialLinks();
  }, []);
  return (
    <div className="flex w-full gap-4 px-4 items-center justify-between">
      {loading && <Loader />}
      {socialLinks.map((item: social, index: number) => (
        <a href={item.url} target="blank" key={index}>
          <img src={item.iconUrl} className="w-10 social h-10 " />
        </a>
      ))}
    </div>
  );
}
