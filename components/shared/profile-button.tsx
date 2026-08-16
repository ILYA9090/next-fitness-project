"use client";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Button } from "../ui";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";

interface ProfileButtonProps {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton = (props: ProfileButtonProps) => {
  const { data: session } = useSession();
  const { className, onClickSignIn } = props;
  return (
    <div className={cn("", className)}>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          className="flex items-center gap-1"
          variant="outline"
        >
          <User size={16} />
          Войти
        </Button>
      ) : (
        <Link href="/profile">
          <Button className="flex items-center gap-1" variant="secondary">
            <CircleUser size={20} />
            Профиль
          </Button>
        </Link>
      )}
    </div>
  );
};
