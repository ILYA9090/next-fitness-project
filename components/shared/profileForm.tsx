"use client";

import React from "react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button, Input } from "@/components/ui";
import { updateUserInfo } from "@/lib/api/actions";
import {
  formRegisterSchema,
  FormRegisterValues,
} from "./modals/auth-modal/forms/schema";
import { signOut } from "next-auth/react";
import { Container } from "./container";
import { Title } from "./title";
import { User } from "@/lib/generated/prisma";

interface ProfileFormProps {
  data: User;
}

export const ProfileForm = (props: ProfileFormProps) => {
  const { data } = props;

  const form = useForm<FormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      name: data.name || "",
      email: data.email,
      password: "",
      confirmPassword: "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  const onSubmit = async (data: FormRegisterValues) => {
    const toastId = toast.loading("Сохранение данных...");

    try {
      await updateUserInfo({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      toast.success("Данные обновлены 📝", {
        id: toastId,
        icon: "✅",
      });
    } catch (error) {
      toast.error("Ошибка при обновлении данных", {
        id: toastId,
        icon: "❌",
      });
    }
  };

  const onError = (errors: FieldErrors<FormRegisterValues>) => {
    console.log("❌ Ошибки валидации:", errors);
    toast.error("Введите корректные данные", {
      icon: "❌",
    });
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  return (
    <Container className="my-10">
      <Title
        text={`Личные данные | ${data.name || "пользователя"}`}
        size="md"
        className="font-bold"
      />

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-5 w-96 mt-10"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          <div>
            <Input placeholder="E-Mail" required {...form.register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              placeholder="Полное имя"
              required
              {...form.register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Новый пароль"
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
              type="password"
              placeholder="Повторите пароль"
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
            className="text-base mt-10"
            type="submit"
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            onClick={onClickSignOut}
            variant="secondary"
            disabled={isSubmitting}
            className="text-base"
            type="button"
          >
            Выйти
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
};
