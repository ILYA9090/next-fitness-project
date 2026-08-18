"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button, Input } from "@/components/ui";
import { formRegisterSchema, FormRegisterValues } from "./schema";
import { registerUser } from "@/lib/api/actions";

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose, onClickLogin }) => {
  const form = useForm<FormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  const onSubmit = async (data: FormRegisterValues) => {
    try {
      await registerUser({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      toast.success("Регистрация успешна 📝. Подтвердите свою почту", {
        icon: "✅",
      });

      onClose?.();
    } catch (error) {
      toast.error("Вы уже зарегистрированы", {
        icon: "❌",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit, (formErrors) => {
          console.log("❌ Ошибки валидации:", formErrors);
          toast.error("Заполните все поля корректно", {
            icon: "❌",
          });
        })}
      >
        <div>
          <Input
            placeholder="Введите почту"
            required
            {...form.register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input placeholder="Полное имя" required {...form.register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Введите пароль"
            type="password"
            required
            {...form.register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            placeholder="Подтвердите пароль"
            type="password"
            required
            {...form.register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          className="h-12 text-base"
          type="submit"
        >
          {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
    </FormProvider>
  );
};
