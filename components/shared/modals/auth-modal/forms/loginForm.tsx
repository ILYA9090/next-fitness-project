import { FormProvider, useForm } from "react-hook-form";
import { formLoginSchema, FormLoginValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "@/components/shared/title";
import { Button, Input } from "@/components/ui";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  className?: string;
  onClose?: VoidFunction;
}

export const LoginForm = (props: LoginFormProps) => {
  const { onClose } = props;

  const form = useForm<FormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormLoginValues) => {
    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!response?.ok) {
        toast.error("Не удалось войти в аккаунт", {
          icon: <X color="red" />,
        });
        return;
      }

      toast.success("Вы вошли в аккаунт", {
        icon: <Check color="green" />,
      });
      onClose?.();
    } catch (error) {
      toast.error("Не удалось войти в аккаунт", {
        icon: <X color="red" />,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        autoComplete="off"
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("❌ Ошибки валидации:", errors);
          toast.error("Заполните все поля корректно", {
            icon: <X color="red" />,
          });
        })}
      >
        <div className="mr-2">
          <Title text="Вход в аккаунт" size="md" className="font-bold" />
          <p className="text-gray-400">Введите email и пароль</p>
        </div>

        <Input
          placeholder="Введите email"
          autoComplete="off"
          className={cn(form.formState.errors.email && "border-red-500")}
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.email.message}
          </p>
        )}

        <Input
          placeholder="Введите пароль"
          autoComplete="off"
          className={cn(form.formState.errors.password && "border-red-500")}
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.password.message}
          </p>
        )}

        <Button
          type="submit"
          className="h-12 text-base"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Вход..." : "Войти"}
        </Button>
      </form>
    </FormProvider>
  );
};
