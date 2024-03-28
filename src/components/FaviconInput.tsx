import { Favicon } from "./Favicon";

export function FaviconInput({
  value,
  size,
}: {
  value?: string;
  size?: number;
}) {
  return <Favicon src={value ?? null} size={size} />;
}
