import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">設定</h1>
          <p className="text-muted-foreground">システムの設定を管理できます</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>営業時間設定</CardTitle>
            <CardDescription>
              店舗の営業時間とシフトの基本設定を行えます
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="openTime">営業開始時間</Label>
              <Input type="time" id="openTime" defaultValue="09:00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closeTime">営業終了時間</Label>
              <Input type="time" id="closeTime" defaultValue="22:00" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>通知設定</CardTitle>
            <CardDescription>
              システムからの通知設定を管理できます
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>シフト確定通知</Label>
                <p className="text-sm text-muted-foreground">
                  シフトが確定した際に通知を受け取ります
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>シフト変更通知</Label>
                <p className="text-sm text-muted-foreground">
                  シフトに変更があった際に通知を受け取ります
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>設定を保存</Button>
        </div>
      </div>
    </>
  );
} 