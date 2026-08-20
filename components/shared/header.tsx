"use client";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./searchInput";
import { ProfileButton } from "./profile-button";
import { AuthModal } from "./modals/auth-modal/auth-modal";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface HeaderProps {
  className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    let toastMessage = "";
    if (searchParams.has("verified")) {
      toastMessage = "Почта успешно подтверждена";
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace("/");
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);
    }
  }, []);
  return (
    <header className={cn("border border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/bicep.png" alt="" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-white">Made yourseld</h1>
              <p className="text-sm text-blue">
                Работа над собой - это здорово!
              </p>
            </div>
          </div>
        </Link>

        <div>
          <div className="mx-10 flex-1 w-120">
            <SearchInput />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AuthModal open={openModal} onClose={() => setOpenModal(false)} />
          <ProfileButton onClickSignIn={() => setOpenModal(true)} />
          <div>
            <Link href="/favorites">
              <Button className="group relative">
                <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                  <Heart size={16} className="relative" strokeWidth={2} />
                </div>
                <ArrowRight
                  size={20}
                  className=" absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
