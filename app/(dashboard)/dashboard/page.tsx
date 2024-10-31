import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">シフト管理</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規シフト作成
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>今月のシフト</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>本日のシフト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>早番 (8:00-17:00)</span>
                <span className="text-muted-foreground">3名</span>
              </div>
              <div className="flex justify-between items-center">
                <span>遅番 (13:00-22:00)</span>
                <span className="text-muted-foreground">2名</span>
              </div>
              <div className="flex justify-between items-center">
                <span>夜勤 (22:00-8:00)</span>
                <span className="text-muted-foreground">1名</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>未承認の希望休</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>山田太郎</span>
                <span className="text-muted-foreground">4/15</span>
              </div>
              <div className="flex justify-between items-center">
                <span>佐藤花子</span>
                <span className="text-muted-foreground">4/20-4/22</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}