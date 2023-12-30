// import { truncate } from "@/utils/HelperUtil";
// import { Link } from "@nextui-org/react";

/**
 * Types
 */
interface IProps {
  logo?: string;
  name?: string;
  url?: string;
  topic?: string;
  onDelete: () => Promise<void>;
}

/**
 * Component
 */
export default function PairingCard({ name, url, topic, onDelete }: IProps) {
  return (
    <>
      <div style={{ flex: 1 }}>
        {name}
        {topic}
        {url}
      </div>
      <button onClick={onDelete}></button>
    </>
  );
}
