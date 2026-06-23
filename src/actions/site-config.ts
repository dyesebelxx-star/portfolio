"use server";

import { prisma } from "@/lib/prisma";

export async function getSiteConfig(key: string): Promise<string | null> {
  const config = await prisma.siteConfig.findUnique({ where: { key } });
  return config?.value ?? null;
}

export async function getManySiteConfigs(keys: string[]): Promise<Record<string, string>> {
  const configs = await prisma.siteConfig.findMany({
    where: { key: { in: keys } },
  });
  const result: Record<string, string> = {};
  for (const c of configs) {
    result[c.key] = c.value;
  }
  return result;
}

export async function getAllSiteConfigs(): Promise<Record<string, string>> {
  const configs = await prisma.siteConfig.findMany();
  const result: Record<string, string> = {};
  for (const c of configs) {
    result[c.key] = c.value;
  }
  return result;
}

export async function setSiteConfig(key: string, value: string) {
  await prisma.siteConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function setManySiteConfigs(data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    await setSiteConfig(key, value);
  }
}
