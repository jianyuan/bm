import { Image } from "@mantine/core";
import { Link2Icon } from "@radix-ui/react-icons";

export function Favicon({
  src,
  size = 16,
}: {
  src: string | null;
  size?: number;
}) {
  if (!src) {
    return <Link2Icon width={size} height={size} />;
  }
  return <Image src={src} h={size} w={size} fit="contain" alt="Favicon" />;
}
