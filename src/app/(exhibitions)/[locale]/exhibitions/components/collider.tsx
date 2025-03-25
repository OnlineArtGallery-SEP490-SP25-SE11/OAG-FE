import { PhysicalCollider } from "./physical-collider";
import { CurvedPhysicalCollider } from "./curved-physical-collider";
import { ColliderConfig } from "@/types/gallery";

export function Collider(props: ColliderConfig) {
  if (props.shape === 'box') {
    return <PhysicalCollider {...props} />;
  } else if (props.shape === 'curved') {
    return <CurvedPhysicalCollider {...props} />;
  }
  return null;
}