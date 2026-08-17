"use client";

import { Button, Dialog } from "@/components/ui";
import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { LoginForm } from "./forms/loginForm";
import { RegisterForm } from "./forms/registerForm";

interface AuthModalProps {
  className?: string;
  open: boolean;
  onClose: () => void;
}

export const AuthModal = (props: AuthModalProps) => {
  const { className, onClose, open } = props;
  const [type, setType] = useState<"login" | "register">("login");

  const onSwitchType = useCallback(
    () => setType(type === "login" ? "register" : "login"),
    [type],
  );

  const authorization = useCallback((value: string) => {
    signIn(value, { callbackUrl: "/", redirect: true });
  }, []);
  const handleClose = () => onClose();
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn("w-[450px]", className)}>
        {type === "login" ? (
          <LoginForm onClose={handleClose} />
        ) : (
          <RegisterForm onClose={handleClose} />
        )}
        <hr />
        <div className="flex gap-2 justify-center w-full">
          <Button
            className="flex items-center gap-1 w-full"
            variant="outline"
            onClick={() => authorization("github")}
          >
            <img
              className="w-6 h-6"
              src="https://github.githubassets.com/favicons/favicon.svg"
            />
            github
          </Button>
          <Button
            className="flex items-center gap-1 w-full"
            variant="outline"
            onClick={() => authorization("google")}
          >
            <img
              className="w-6 h-6"
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
            />
            google
          </Button>
        </div>
        <Button variant="outline" onClick={onSwitchType} type="button">
          {type !== "login" ? "Войти" : "Регистрация"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
