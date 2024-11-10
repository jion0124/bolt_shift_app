import * as React from "react";
import Link from "next/link";
import { employees } from '@/app/data/employees';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function DashboardPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">シフト管理</h1>
          <p className="text-muted-foreground">シフトの作成・管理ができます</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shifts/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              新規シフト作成
          </Link>
        </Button>
      </div>

      {/* 概要カード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の総シフト数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245シフト</div>
            <p className="text-xs text-muted-foreground">
              先月比 +12%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の総労働時間</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">386時間</div>
            <p className="text-xs text-muted-foreground">
              先週比 -2%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本日の出勤者数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8名</div>
            <p className="text-xs text-muted-foreground">
              通常日比 +1名
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未確定シフト</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3件</div>
            <p className="text-xs text-muted-foreground">
              要対応
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 今週のシフト表 */}
      <Card>
        <CardHeader>
          <CardTitle>今週のシフト</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>従業員名</TableHead>
                <TableHead>月</TableHead>
                <TableHead>火</TableHead>
                <TableHead>水</TableHead>
                <TableHead>木</TableHead>
                <TableHead>金</TableHead>
                <TableHead>土</TableHead>
                <TableHead>日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>9-18</TableCell>
                  <TableCell>10-19</TableCell>
                  <TableCell>休</TableCell>
                  <TableCell>9-18</TableCell>
                  <TableCell>9-18</TableCell>
                  <TableCell>休</TableCell>
                  <TableCell>13-22</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
} 