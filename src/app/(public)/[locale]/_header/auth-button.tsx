"use client";
import Notification from "@/app/(public)/[locale]/_header/notification";
import useAuthClient from "@/hooks/useAuth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutItem from "@/app/(public)/[locale]/_header/sign-out-item";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import HeaderButton from "@/app/(public)/[locale]/_header/components/header-button";
import { Separator } from "@/components/ui/separator";
import { DropdownItemWithIcon } from "@/app/(public)/[locale]/_header/components/header-dropdown";
import { CircleUserRoundIcon, SettingsIcon } from "lucide-react"; // Import Skeleton from shadcn/ui
import { useTranslations } from "next-intl";
export default function AuthButton() {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const { status, user } = useAuthClient();

  if (status === "loading") {
    return (
      <div className="flex flex-row space-x-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    );
  }
  if (status === "unauthenticated" || !user) {
    return (
      <div className="flex flex-row w-[88px] h-10 rounded-3xl bg-green-500 text-nowrap justify-center self-center">
        <Link className="self-center" href={`/sign-in`}>
          {tCommon("signin")}
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-row space-x-2">
      <Notification />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <HeaderButton isGradient={true}>
            <Avatar className="w-full h-full">
              {user.image ? (
                <AvatarImage src={user.image} />
              ) : (
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </HeaderButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 flex flex-col">
          <DropdownItemWithIcon
            icon={<CircleUserRoundIcon className="w-6 h-6" />}
            text={t("profile")}
            href="/settings/profile"
          />
          <DropdownItemWithIcon
            icon={<SettingsIcon className="w-6 h-6" />}
            text={t("settings")}
            href="/settings"
          />
          <Separator className="mt-6" />
          <SignOutItem dropdown />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}