import Notification from "@/app/(public)/[locale]/_header/notification";
import { Toaster } from "@/components/ui/toaster";
export default function SettingsPage() {
  return (
    <div>
      <Notification />
      <Toaster />
    </div>
  );
}
