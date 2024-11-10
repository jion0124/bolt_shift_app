'use client';

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isWeekend,
  differenceInCalendarWeeks,
} from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";

// ShiftTypeの定義
enum ShiftType {
  REQUESTED_SHIFT = 'REQUESTED_SHIFT', // 希望勤務日
  REQUESTED_HOLIDAY = 'REQUESTED_HOLIDAY', // 希望休
  WORK_DAY = 'WORK_DAY', // 通常勤務日
  HOLIDAY = 'HOLIDAY', // 休日
  EARLY_SHIFT_LUNCH = 'EARLY_SHIFT_LUNCH', // 早番昼食
  CLEANING_DUTY = 'CLEANING_DUTY', // 掃除当番
  FOOD_INSPECTION_DUTY = 'FOOD_INSPECTION_DUTY', // 検食当番
}

// ShiftRoleの定義
enum ShiftRole {
  EARLY_SHIFT_LUNCH = 'EARLY_SHIFT_LUNCH',
  CLEANING_DUTY = 'CLEANING_DUTY',
  FOOD_INSPECTION_DUTY = 'FOOD_INSPECTION_DUTY',
}

// シフトの型定義
type Shift = {
  id?: number;
  employeeId: number;
  date: string;
  type: ShiftType;
  role?: ShiftRole; // 追加
};

// 従業員の型定義
type Employee = {
  id: number;
  name: string;
  contact: string;
  position: string;
};

// ShiftOptionの型定義
type ShiftOption = ShiftType | 'DELETE';

export default function NewShiftPage() {
  const [shifts, setShifts] = useState<Shift[]>([]); // 既存のシフトデータ
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShiftOption | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [manualShifts, setManualShifts] = useState<Shift[]>([]); // 手動で追加したシフト
  const [autoShifts, setAutoShifts] = useState<Shift[]>([]); // 自動生成されたシフト

  // 現在の月の開始日と終了日を取得
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 従業員データをフェッチ
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        if (!res.ok) throw new Error('Failed to fetch employee data.');
        const data: Employee[] = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
        toast.error('従業員データの取得に失敗しました。');
      }
    };

    fetchEmployees();
  }, []);

  // シフトデータをフェッチ
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch('/api/shifts');
        if (!res.ok) throw new Error('Failed to fetch shift data.');
        const data: Shift[] = await res.json();
        setShifts(data);
      } catch (error) {
        console.error(error);
        toast.error('シフトデータの取得に失敗しました。');
      }
    };

    fetchShifts();
  }, []);

  // 手動シフト（希望勤務日と希望休）を抽出
  useEffect(() => {
    const combinedManualShifts = shifts.filter(
      s => s.type === ShiftType.REQUESTED_SHIFT || s.type === ShiftType.REQUESTED_HOLIDAY
    );
    setManualShifts(combinedManualShifts);
  }, [shifts]);

  // シフトの内容をレンダリング
  const renderShiftContent = (shift: Shift | undefined) => {
    if (!shift) return null;
    switch (shift.type) {
      case ShiftType.REQUESTED_SHIFT:
      case ShiftType.WORK_DAY:
        if (shift.role) {
          switch (shift.role) {
            case ShiftRole.EARLY_SHIFT_LUNCH:
              return <span className="text-red-500">早</span>;
            case ShiftRole.CLEANING_DUTY:
              return <FaStar className="mx-auto text-red-500" />;
            case ShiftRole.FOOD_INSPECTION_DUTY:
              return <span className="text-red-500">検</span>;
            default:
              return null;
          }
        }
        return null;
      case ShiftType.REQUESTED_HOLIDAY:
      case ShiftType.HOLIDAY:
        return '公';
      default:
        return null;
    }
  };

  // シフトの背景色を決定
  const getShiftClass = (shiftsForCell: Shift[]) => {
    // 手動シフトのみ背景色を変更
    const hasManualShift = shiftsForCell.some(s => 
      s.type === ShiftType.REQUESTED_SHIFT || s.type === ShiftType.REQUESTED_HOLIDAY
    );
    
    if (hasManualShift) return 'bg-yellow-200'; // 手動シフトがあれば黄色背景
    return 'bg-white'; // その他は白背景
  };

  // セルクリック時の処理
  const handleCellClick = (employeeId: number, date: string) => {
    if (!selectedOption) return;

    if (selectedOption === 'DELETE') {
      // シフトの削除
      const updatedManualShifts = manualShifts.filter(
        s => !(s.employeeId === employeeId && s.date === date)
      );
      const updatedAutoShifts = autoShifts.filter(
        s => !(s.employeeId === employeeId && s.date === date && s.type !== ShiftType.WORK_DAY)
      );
      setManualShifts(updatedManualShifts);
      setAutoShifts(updatedAutoShifts);
      return;
    }

    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      console.error(`Employee with id ${employeeId} not found.`);
      return;
    }
    const isDoi = employee.name === '土井';

    if (selectedOption === ShiftType.REQUESTED_SHIFT || selectedOption === ShiftType.REQUESTED_HOLIDAY) {
      // 手動シフトの追加または更新
      const existingIndex = manualShifts.findIndex(
        s => s.employeeId === employeeId && s.date === date
      );
      let updatedManualShifts = [...manualShifts];
      if (existingIndex !== -1) {
        // 既存のシフトを更新
        updatedManualShifts[existingIndex].type = selectedOption;
        if (selectedOption === ShiftType.REQUESTED_SHIFT && !isDoi) {
          // ShiftRoleをランダムに割り当て
          const roles = Object.values(ShiftRole);
          const randomRole = roles[Math.floor(Math.random() * roles.length)];
          updatedManualShifts[existingIndex].role = randomRole;
        } else {
          updatedManualShifts[existingIndex].role = undefined;
        }
      } else {
        // 新しいシフトを追加
        let newShift: Shift = { employeeId, date, type: selectedOption };
        if (selectedOption === ShiftType.REQUESTED_SHIFT && !isDoi) {
          // ShiftRoleをランダムに割り当て
          const roles = Object.values(ShiftRole);
          const randomRole = roles[Math.floor(Math.random() * roles.length)];
          newShift.role = randomRole;
        }
        updatedManualShifts.push(newShift);
      }
      setManualShifts(updatedManualShifts);
      return;
    }

    // 自動シフトの追加または更新
    // 既に同じタイプのシフトが存在する場合は更新し、それ以外は追加
    const existingAutoIndex = autoShifts.findIndex(
      s => s.employeeId === employeeId && s.date === date && s.type === selectedOption
    );
    let updatedAutoShifts = [...autoShifts];
    if (existingAutoIndex !== -1) {
      // 既存のシフトを更新
      updatedAutoShifts[existingAutoIndex].type = selectedOption as ShiftType;
      updatedAutoShifts[existingAutoIndex].role = (selectedOption !== ShiftType.WORK_DAY && selectedOption !== ShiftType.HOLIDAY) ? (selectedOption as unknown as ShiftRole) : undefined;
    } else {
      // 新しいシフトを追加
      let newShift: Shift = { employeeId, date, type: selectedOption as ShiftType };
      if (selectedOption !== ShiftType.WORK_DAY && selectedOption !== ShiftType.HOLIDAY) {
        newShift.role = selectedOption as unknown as ShiftRole;
      }
      updatedAutoShifts.push(newShift);
    }
    setAutoShifts(updatedAutoShifts);
  };

  // 配列をシャッフルする関数
  const shuffleArray = <T,>(array: T[]): T[] => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // 週番号を取得するヘルパー関数
  const getWeekNumber = (date: Date) => {
    return differenceInCalendarWeeks(date, startOfMonth(date), { weekStartsOn: 0 });
  };

  // シフト自動生成関数
  const autoGenerateShifts = () => {
    if (employees.length === 0) {
      toast.error("従業員データがありません。");
      return;
    }

    const generatedShifts: Shift[] = [];

    // 各従業員のデータを初期化
    const employeeData: {
      [key: number]: {
        weeklyDaysOff: { [week: number]: number };
        consecutiveDaysOff: number;
      };
    } = {};

    employees.forEach(emp => {
      employeeData[emp.id] = {
        weeklyDaysOff: {},
        consecutiveDaysOff: 0,
      };
    });

    // 既存の手動シフトを考慮
    const existingManualShifts = manualShifts;

    // 「土井」を当番割り振りから除外（希望休には含める）
    const dutyExcludedEmployeeIds = employees
      .filter(emp => emp.name === '土井')
      .map(emp => emp.id);

    // 各日の当番役割を記録するオブジェクト
    const dailyAssignedRoles: { [date: string]: { [role in ShiftRole]?: number } } = {};

    // 月内の各日を処理
    daysInMonth.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = getDay(date); // 0: 日曜日, 6: 土曜日
      const isWeekendDay = isWeekend(date);
      const weekNumber = getWeekNumber(date); // 0-based week number

      // 既に希望勤務日や希望休が設定されている従業員を取得
      const manualShiftsForDate = existingManualShifts.filter(s => s.date === dateStr);
      const manualHolidays = manualShiftsForDate
        .filter(s => s.type === ShiftType.REQUESTED_HOLIDAY)
        .map(s => s.employeeId);
      const manualRequests = manualShiftsForDate
        .filter(s => s.type === ShiftType.REQUESTED_SHIFT)
        .map(s => s.employeeId);

      // 初期化
      if (!dailyAssignedRoles[dateStr]) {
        dailyAssignedRoles[dateStr] = {};
      }

      if (!isWeekendDay) {
        // 平日: 2人または3人が休み
        const requiredDaysOff = Math.random() < 0.5 ? 2 : 3;

        // 休みを割り当てる従業員をシャッフル（希望休が設定されていない従業員のみ）
        const availableEmployeesForOff = shuffleArray(
          employees.filter(emp => 
            !manualHolidays.includes(emp.id) // 希望休が設定されている従業員は休みに含まれる
          )
        );

        const daysOffAssigned: number[] = [];

        for (const employee of availableEmployeesForOff) {
          if (daysOffAssigned.length >= requiredDaysOff) break;

          const empData = employeeData[employee.id];

          // 週ごとの休みが約2回を超えないように
          const currentWeekOff = empData.weeklyDaysOff[weekNumber] || 0;
          if (currentWeekOff >= 2) continue;

          // 連続休みが2日以上にならないように
          if (empData.consecutiveDaysOff >= 2) continue;

          // 既に休みが割り当てられているか確認
          const alreadyOff = generatedShifts.some(
            s => s.employeeId === employee.id && s.date === dateStr && s.type === ShiftType.HOLIDAY
          );
          if (alreadyOff) continue;

          // 休みを割り当て
          generatedShifts.push({
            employeeId: employee.id,
            date: dateStr,
            type: ShiftType.HOLIDAY,
          });
          daysOffAssigned.push(employee.id);
          empData.weeklyDaysOff[weekNumber] = currentWeekOff + 1;
          empData.consecutiveDaysOff += 1;
        }

        // 残りの従業員に出勤シフトを割り当て
        const availableEmployeesForDuty = shuffleArray(
          employees.filter(emp => 
            !daysOffAssigned.includes(emp.id) && 
            !manualHolidays.includes(emp.id) &&
            !dutyExcludedEmployeeIds.includes(emp.id) // 当番割り振りから除外
          )
        );

        // 出勤者に役割を割り当てる（各役割1人のみ）
        const roles: ShiftRole[] = [
          ShiftRole.EARLY_SHIFT_LUNCH,
          ShiftRole.CLEANING_DUTY,
          ShiftRole.FOOD_INSPECTION_DUTY,
        ];

        for (const role of roles) {
          // 既にこの役割が割り当てられているか確認
          if (dailyAssignedRoles[dateStr][role]) continue;

          const emp = availableEmployeesForDuty.shift();
          if (emp) {
            generatedShifts.push({
              employeeId: emp.id,
              date: dateStr,
              type: ShiftType.WORK_DAY,
              role: role,
            });
            dailyAssignedRoles[dateStr][role] = emp.id;
            // 連続休みカウントをリセット
            employeeData[emp.id].consecutiveDaysOff = 0;
          }
        }

        // 希望勤務日の従業員も出勤者として役割を割り当てる
        const requestedWorkers = employees.filter(emp => manualRequests.includes(emp.id));
        requestedWorkers.forEach(emp => {
          if (dutyExcludedEmployeeIds.includes(emp.id)) return; // 「土井」さんは除外
          const availableRoles = roles.filter(role => !dailyAssignedRoles[dateStr][role]);
          if (availableRoles.length > 0) {
            const randomRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
            generatedShifts.push({
              employeeId: emp.id,
              date: dateStr,
              type: ShiftType.WORK_DAY,
              role: randomRole,
            });
            dailyAssignedRoles[dateStr][randomRole] = emp.id;
            // 連続休みカウントをリセット
            employeeData[emp.id].consecutiveDaysOff = 0;
          }
        });

        // 休みを取る従業員の連続休みカウントを更新
        daysOffAssigned.forEach(empId => {
          employeeData[empId].consecutiveDaysOff += 1;
        });
      } else {
        // 土日: 3人が出勤
        const requiredOnDuty = 3;

        // 出勤する従業員をシャッフルして選択（希望休が設定されていない従業員のみ）
        const shuffledEmployees = shuffleArray(
          employees.filter(emp => 
            !manualHolidays.includes(emp.id) && 
            !dutyExcludedEmployeeIds.includes(emp.id) // 当番割り振りから除外
          )
        );
        const onDutyEmployees = shuffledEmployees.slice(0, requiredOnDuty);

        // 出勤者に役割を割り当てる（各役割1人のみ）
        const roles: ShiftRole[] = [
          ShiftRole.EARLY_SHIFT_LUNCH,
          ShiftRole.CLEANING_DUTY,
          ShiftRole.FOOD_INSPECTION_DUTY,
        ];

        for (let i = 0; i < roles.length; i++) {
          const role = roles[i];
          const emp = onDutyEmployees[i];
          if (emp) {
            generatedShifts.push({
              employeeId: emp.id,
              date: dateStr,
              type: ShiftType.WORK_DAY,
              role: role,
            });
            dailyAssignedRoles[dateStr][role] = emp.id;
            // 連続休みカウントをリセット
            employeeData[emp.id].consecutiveDaysOff = 0;
          }
        }

        // 休みを取る従業員の連続休みカウントを更新
        const offEmployees = employees.filter(emp => 
          !onDutyEmployees.some(e => e.id === emp.id) &&
          !manualHolidays.includes(emp.id) &&
          !dutyExcludedEmployeeIds.includes(emp.id) // 休みに含めるが当番には含めない
        );

        offEmployees.forEach(emp => {
          employeeData[emp.id].consecutiveDaysOff += 1;
          // 休みを表示するために「公」を割り当て
          generatedShifts.push({
            employeeId: emp.id,
            date: dateStr,
            type: ShiftType.HOLIDAY,
          });
        });
      }
    });

    // 希望勤務日にも当番を割り当てる
    manualShifts.forEach(manualShift => {
      if (manualShift.type === ShiftType.REQUESTED_SHIFT) {
        const dateStr = manualShift.date;
        const empId = manualShift.employeeId;

        // 日付がmonthlyDays内に含まれているか確認
        const dateExists = daysInMonth.some(date => format(date, 'yyyy-MM-dd') === dateStr);
        if (!dateExists) {
          console.warn(`Date ${dateStr} from manualShift is not within the current month.`);
          return;
        }

        // dailyAssignedRoles[dateStr]が存在しない場合は初期化
        if (!dailyAssignedRoles[dateStr]) {
          dailyAssignedRoles[dateStr] = {};
        }

        // 役割をランダムに割り当てる（既に役割が割り当てられていない場合）
        const roles: ShiftRole[] = [
          ShiftRole.EARLY_SHIFT_LUNCH,
          ShiftRole.CLEANING_DUTY,
          ShiftRole.FOOD_INSPECTION_DUTY,
        ];
        const availableRoles = roles.filter(role => !dailyAssignedRoles[dateStr][role]);
        if (availableRoles.length > 0) {
          const randomRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
          generatedShifts.push({
            employeeId: empId,
            date: dateStr,
            type: ShiftType.WORK_DAY,
            role: randomRole,
          });
          dailyAssignedRoles[dateStr][randomRole] = empId;
        } else {
          console.warn(`No available roles to assign for employee ${empId} on ${dateStr}`);
        }
      }
    });

    // 連続休みが3日以上にならないように、再調整を試みる
    let adjustmentsMade = true;
    while (adjustmentsMade) {
      adjustmentsMade = false;
      employees.forEach(emp => {
        let consecutive = 0;
        daysInMonth.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const shiftIndex = generatedShifts.findIndex(s => s.employeeId === emp.id && s.date === dateStr);
          if (shiftIndex === -1) return;

          const shift = generatedShifts[shiftIndex];

          if (shift.type === ShiftType.HOLIDAY) {
            consecutive += 1;
            if (consecutive >= 3) {
              // 3日目の休みを出勤に変更
              generatedShifts[shiftIndex].type = ShiftType.WORK_DAY;
              generatedShifts[shiftIndex].role = undefined; // 役割をクリア
              consecutive = 0;
              adjustmentsMade = true;

              // 出勤シフトの役割をランダムに割り当て
              const roles: ShiftRole[] = [
                ShiftRole.EARLY_SHIFT_LUNCH,
                ShiftRole.CLEANING_DUTY,
                ShiftRole.FOOD_INSPECTION_DUTY,
              ];
              const availableRoles = roles.filter(role => !dailyAssignedRoles[dateStr][role]);
              if (availableRoles.length > 0) {
                const randomRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
                generatedShifts[shiftIndex].role = randomRole;
                dailyAssignedRoles[dateStr][randomRole] = emp.id;
              } else {
                console.warn(`No available roles to reassign for employee ${emp.id} on ${dateStr}`);
              }

              // 週ごとの休みカウントを再調整
              const weekNumber = getWeekNumber(new Date(dateStr));
              employeeData[emp.id].weeklyDaysOff[weekNumber] = Math.max(0, (employeeData[emp.id].weeklyDaysOff[weekNumber] || 1) - 1);
            }
          } else {
            consecutive = 0;
          }
        });
      });
    }

    // 自動シフトをセット（毎回生成し直す）
    setAutoShifts(generatedShifts);
    toast.success("シフトが自動生成されました！");
  };

  // 曜日ラベルの色設定（曜日ラベルのみ色を変える）
  const getDayColor = (day: number) => {
    if (day === 0) return "text-red-500"; // 日曜日
    if (day === 6) return "text-blue-500"; // 土曜日
    return "text-black"; // 平日は黒
  };

  // シフトをデータベースに保存
  const saveShiftsToDatabase = async () => {
    try {
      setLoading(true);
      const combinedShifts = [...manualShifts, ...autoShifts];
      const uniqueShifts: Shift[] = [];

      combinedShifts.forEach(shift => {
        const exists = uniqueShifts.find(s => s.employeeId === shift.employeeId && s.date === shift.date && s.type === shift.type);
        if (!exists) {
          uniqueShifts.push(shift);
        } else {
          // 手動シフトが優先される
          if (
            shift.type === ShiftType.REQUESTED_SHIFT ||
            shift.type === ShiftType.REQUESTED_HOLIDAY
          ) {
            uniqueShifts.splice(uniqueShifts.indexOf(exists), 1, shift);
          }
        }
      });

      const createShiftPromises = uniqueShifts.map(shift =>
        fetch('/api/shifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shift),
        })
      );

      await Promise.all(createShiftPromises);

      toast.success("シフトが保存されました！");
      setShifts([...shifts, ...uniqueShifts]);
      setAutoShifts([]);
      setManualShifts([]);
    } catch (error) {
      console.error(error);
      toast.error("シフトの保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* ボタン群 */}
      <div className="flex items-center space-x-4 mb-4">
        <Button
          variant={selectedOption === ShiftType.REQUESTED_SHIFT ? 'default' : 'outline'}
          onClick={() => setSelectedOption(selectedOption === ShiftType.REQUESTED_SHIFT ? null : ShiftType.REQUESTED_SHIFT)}
          className={selectedOption === ShiftType.REQUESTED_SHIFT ? 'bg-yellow-500 text-white' : ''}
          disabled={loading}
        >
          希望勤務日
        </Button>
        <Button
          variant={selectedOption === ShiftType.REQUESTED_HOLIDAY ? 'default' : 'outline'}
          onClick={() => setSelectedOption(selectedOption === ShiftType.REQUESTED_HOLIDAY ? null : ShiftType.REQUESTED_HOLIDAY)}
          className={selectedOption === ShiftType.REQUESTED_HOLIDAY ? 'bg-yellow-500 text-white' : ''}
          disabled={loading}
        >
          希望休
        </Button>
        <Button
          variant={selectedOption === 'DELETE' ? 'destructive' : 'outline'}
          onClick={() => setSelectedOption(selectedOption === 'DELETE' ? null : 'DELETE')}
          className={selectedOption === 'DELETE' ? 'bg-red-500 text-white' : ''}
          disabled={loading}
        >
          削除
        </Button>

        <Button onClick={autoGenerateShifts} className="ml-auto bg-green-500 text-white hover:bg-green-600" disabled={loading}>
          シフトを自動生成
        </Button>
        <Button 
          onClick={saveShiftsToDatabase} 
          className="bg-blue-500 text-white hover:bg-blue-600" 
          disabled={loading || (manualShifts.length === 0 && autoShifts.length === 0)}
        >
          保存する
        </Button>
      </div>

      {/* シフトテーブル */}
      <div className="overflow-x-auto relative">
        <table className="min-w-full table-fixed border-collapse border">
          <thead>
            <tr>
              <th className="p-2 border text-center">従業員</th>
              {daysInMonth.map(date => (
                <th key={format(date, 'yyyy-MM-dd')} className={`p-2 border text-center`}>
                  <span className="block text-black">{format(date, 'd')}</span>
                  <span className={`block ${getDayColor(getDay(date))}`}>
                    {['日', '月', '火', '水', '木', '金', '土'][getDay(date)]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td className="p-2 border font-semibold text-center whitespace-nowrap">{employee.name}</td>
                {daysInMonth.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');

                  // 手動シフトを取得
                  const manualShift = manualShifts.find(
                    s => s.employeeId === employee.id && s.date === dateStr
                  );

                  // 自動シフトを取得
                  const autoShift = autoShifts.find(
                    s => s.employeeId === employee.id && s.date === dateStr
                  );

                  // 「土井」さんのチェック
                  const isDoi = employee.name === '土井';

                  // シフトの背景色を取得（手動シフトのみを考慮）
                  const shiftClass = getShiftClass([manualShift].filter(Boolean));

                  // 表示内容を決定
                  let displayContent = null;

                  if (manualShift) {
                    if (manualShift.type === ShiftType.REQUESTED_HOLIDAY) {
                      // 希望休の場合
                      displayContent = '公';
                    } else if (manualShift.type === ShiftType.REQUESTED_SHIFT) {
                      // 希望勤務日の場合
                      if (autoShift && autoShift.type === ShiftType.WORK_DAY && autoShift.role) {
                        displayContent = renderShiftContent(autoShift);
                      } else {
                        displayContent = null;
                      }
                    }
                  } else if (autoShift) {
                    if (autoShift.type === ShiftType.HOLIDAY) {
                      // 自動生成の休日
                      displayContent = '公';
                    } else if (autoShift.type === ShiftType.WORK_DAY) {
                      // 自動生成の勤務日
                      displayContent = renderShiftContent(autoShift);
                    }
                  }

                  return (
                    <td
                      key={`${employee.id}-${dateStr}`}
                      className={`p-2 border cursor-pointer ${shiftClass} text-center relative`}
                      onClick={() => handleCellClick(employee.id, dateStr)}
                    >
                      {displayContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
