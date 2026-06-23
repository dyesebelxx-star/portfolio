"use server";

import { redirect } from "next/navigation";
import { createToken, setSession, clearSession, getSession, validateAdmin } from "@/lib/auth";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "请输入用户名和密码" };
  }

  const isValid = await validateAdmin(username, password);
  if (!isValid) {
    return { error: "用户名或密码错误" };
  }

  const token = await createToken(username);
  await setSession(token);

  redirect("/admin");
}

export async function logout() {
  "use server";
  await clearSession();
  redirect("/admin/login");
}

export async function checkAuth() {
  const session = await getSession();
  return session !== null;
}
