"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button, Input } from "@/components/ui";
import { registerUser } from "@/lib/api/actions";
import {
  formRegisterSchema,
  FormRegisterValues,
} from "./modals/auth-modal/forms/schema";

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

  const onSubmit = async (data: FormRegisterValues) => {
    try {
      const result = await registerUser({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      // ✅ Обрабатываем успешный ответ
      if (result.success) {
        toast.success(
          result.message || "Регистрация успешна! Проверьте почту.",
          {
            icon: "✅",
          },
        );
        onClose?.();
      }
    } catch (error) {
      // ✅ Обрабатываем ошибку с сервера
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка при регистрации";

      toast.error(errorMessage, {
        icon: "❌",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Введите почту"
          required
          {...form.register("email")}
        />

        <Input placeholder="Полное имя" required {...form.register("name")} />

        <Input
          placeholder="Введите пароль"
          type="password"
          required
          {...form.register("password")}
        />

        <Input
          placeholder="Подтвердите пароль"
          type="password"
          required
          {...form.register("confirmPassword")}
        />

        <Button
          disabled={form.formState.isSubmitting}
          className="h-12 text-base"
          type="submit"
        >
          {form.formState.isSubmitting
            ? "Регистрация..."
            : "Зарегистрироваться"}
        </Button>
      </form>
    </FormProvider>
  );
};
