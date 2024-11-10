// constants/shiftTypes.ts

// シフトタイプの定義（英語表記に変更）
export enum ShiftType {
  REQUESTED_SHIFT = 'REQUESTED_SHIFT',          // 希望勤務
  REQUESTED_HOLIDAY = 'REQUESTED_HOLIDAY',      // 希望休日
  WORK_DAY = 'WORK_DAY',                        // 勤務
  HOLIDAY = 'HOLIDAY',                          // 休日
  EARLY_SHIFT_LUNCH = 'EARLY_SHIFT_LUNCH',      // 早番昼食
  CLEANING_DUTY = 'CLEANING_DUTY',              // 掃除当番
  FOOD_INSPECTION_DUTY = 'FOOD_INSPECTION_DUTY' // 検食当番
}

// シフトタイプの表示ラベル
export const ShiftTypeLabels: { [key in ShiftType]: string } = {
  [ShiftType.REQUESTED_SHIFT]: '希望勤務',
  [ShiftType.REQUESTED_HOLIDAY]: '希望休日',
  [ShiftType.WORK_DAY]: '勤務',
  [ShiftType.HOLIDAY]: '休日',
  [ShiftType.EARLY_SHIFT_LUNCH]: '早',
  [ShiftType.CLEANING_DUTY]: '掃除当番',
  [ShiftType.FOOD_INSPECTION_DUTY]: '検',
};
