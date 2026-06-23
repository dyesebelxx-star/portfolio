import { getAllSiteConfigs } from "@/actions/site-config";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const configs = await getAllSiteConfigs();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">网站设置</h1>
        <p className="text-muted-foreground text-sm">
          修改关于我、联系方式、技能工具等信息
        </p>
      </div>

      <SettingsForm configs={configs} />
    </div>
  );
}
