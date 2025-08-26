
// Occupancy report response
// export interface OccupancyReportResponse {
//   period: TimePeriod;
//   dateRange: DateRangeFilter;
//   occupancyData: {
//     date: string; // ISO date string or YYYY-MM for monthly
//     totalSpaces: number;
//     occupiedSpaces: number;
//     openSpaceCount: number;
//     deskInRoomCount: number;
//     privateRoomCount: number;
//     roomForThreeCount: number;
//     klikahCardCount: number;
//     occupancyRate: number; // Percentage
//   }[];
//   summary: {
//     averageOccupancyRate: number;
//     maxOccupancyRate: number;
//     minOccupancyRate: number;
//     totalCustomerCount: number;
//   };
// }

// פונקציה קצרה שממירה את הנתונים:
// const createReportRequest = (): OccupancyReportRequest => {
//   const formData = methods.getValues();
//   const dateRange = getDateRange(methods.getValues());
  
//   return {
//     period: formData.TimePeriod,
//     dateRange: dateRange,
//     workspaceTypes: formData.WorkspaceType ? [formData.WorkspaceType] : undefined,
//     format: formData.format
//   };
// };
  // const reportRequest = createReportRequest();
  // console.log("📊 בקשת דוח:", reportRequest);
   // useEffect(() => {
  //   console.log("Current form values:", watchedValues);
  // }, [watchedValues]);
// console.log("🎯 Selected period:", selectedPeriod);

// useEffect(() => {
//   console.log("🔄 Period changed to:", selectedPeriod);
// }, [selectedPeriod]);
// בתוך handleSubmit הוסף רק את זה:



// const handleSubmit = () => {
//   const formData = methods.getValues();
//   const dateRange = getDateRange(formData);
  
//   const reportRequest: OccupancyReportRequest = {
//     period: formData.TimePeriod,
//     dateRange: dateRange,
//     workspaceTypes: formData.WorkspaceType ? [formData.WorkspaceType] : undefined,
//     format: formData.format
//   };

//////////////////
import { DateRangeFilter } from "shared-types"
import { WorkspaceType } from "shared-types"
import { TimePeriod } from "shared-types"
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { Form } from "../../../Common/Components/BaseComponents/Form";
import {  useForm, useWatch } from "react-hook-form";
import { ChartData, ChartDisplay } from "../../../Common/Components/BaseComponents/Graph";
import { useEffect, useState } from "react";
import { useReportStore } from "../../../Stores/Workspace/reportStore";

export const Report = () => {
  const timePeriod = Object.values(TimePeriod).map((v) => ({ label: v, value: v }));
  const workspaceType = Object.values(WorkspaceType).map((v) => ({ label: v, value: v }));
  const {getOccupancyReport,report,count,occupancyRate} = useReportStore();
  const methods = useForm({
      mode: "onChange"
  });
  //גרפים-------------------------------------
  const [chartData, setChartData] = useState<{
  occupancyChart: ChartData[];
  spaceTypesChart: ChartData[];
  timelineChart: ChartData[];
} | null>(null);

// פונקציה שממירה את הנתונים לפורמט של הגרפים
const prepareChartData = () => {
  if (!report || report.length === 0) return;

  // 1. גרף עוגה - התפלגות סוגי חללים
  const spaceTypeCount: Record<string, number> = {};
  report.forEach(space => {
    const type = methods.getValues('WorkspaceType');
    spaceTypeCount[type] = (spaceTypeCount[type] || 0) + 1;
  });

  const spaceTypesChart: ChartData[] = Object.entries(spaceTypeCount).map(([type, count]) => ({
    label: type,
    value: count
  }));

  // 2. גרף עמודות - אחוזי תפוסה
  const occupancyChart: ChartData[] = [
    { label: 'תפוס', value: Math.round(occupancyRate) },
    { label: 'פנוי', value: Math.round(100 - occupancyRate) }
  ];

  // 3. גרף קו - התפלגות לפי תאריכים (אם יש תאריכים)
  const dateCount: Record<string, number> = {};
  report.forEach(space => {
    if (space.assignedDate) {
      const date = new Date(space.assignedDate).toLocaleDateString('he-IL');
      dateCount[date] = (dateCount[date] || 0) + 1;
    }
  });

  const timelineChart: ChartData[] = Object.entries(dateCount)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, count]) => ({
      label: date,
      value: count
    }));

  setChartData({
    occupancyChart,
    spaceTypesChart,
    timelineChart
  });
};

useEffect(() => {
  if (report && report.length > 0) {
    prepareChartData();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[]);

  //const watchedValues = useWatch({ control: methods.control });
 
const selectedPeriod = useWatch({ 
  control: methods.control, 
  name: "TimePeriod" 
});


const renderDateField = () => {
  switch (selectedPeriod) {
    case TimePeriod.DAILY:
      return (
        <InputField name="dailyDate" label="בחר תאריך"type="date" className="mb-2" />);
    case TimePeriod.MONTHLY:
      return (
        <InputField name="monthlyDate" label="בחר חודש " type="month" className="mb-2" /> );
    case TimePeriod.WEEKLY:
      return (
        <InputField name="weeklyDate"label="בחר שבוע"  type="week"  className="mb-2" />  );  
    case TimePeriod.QUARTERLY:
      return (
        <div className="mb-2">
          <label className="block mb-1 font-medium">בחר רבעון</label>
          <div className="flex gap-2">
            <InputField name="quarterYear" label="שנה" type="number" defaultValue={new Date().getFullYear()}   className="flex-1"  />
            <SelectField
              name="quarter"
              label="רבעון"
              options={[
                { label: "Q1", value: "1" },
                { label: "Q2", value: "2" },
                { label: "Q3", value: "3" },
                { label: "Q4", value: "4" }
              ]}
              className="flex-1"
            />
          </div>
        </div>
      ); 
    case TimePeriod.YEARLY:
      return (
      <InputField name="yearlyDate" label="בחר שנה"  type="number" defaultValue={new Date().getFullYear()}  className="mb-2"/> );
    
    default:
      return null;
  }
};
const getDateRange = (formData: any): DateRangeFilter => {
  // const { TimePeriod } = formData;
  switch (formData.TimePeriod) {
    case 'DAILY':
      return {
        startDate: formData.dailyDate,
        endDate: formData.dailyDate
      };
    case 'WEEKLY': {
      const [year, week] = formData.weeklyDate.split('-W');
      const startDate = new Date(year, 0, 1 + (week - 1) * 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); 
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    } 
    case 'MONTHLY': {
      const [year, month] = formData.monthlyDate.split('-');
      return {
        startDate: `${year}-${month}-01`,
        endDate: new Date(year, month, 0).toISOString().split('T')[0]
      };
    }
    case 'QUARTERLY': {
      const year = formData.quarterYear;
      const quarter = formData.quarter;
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = quarter * 3;  
      return {
        startDate: `${year}-${startMonth.toString().padStart(2, '0')}-01`,
        endDate: new Date(year, endMonth, 0).toISOString().split('T')[0]
      };
    }
    case 'YEARLY':
      return {
        startDate: `${formData.yearlyDate}-01-01`,
        endDate: `${formData.yearlyDate}-12-31`
      };
    default:
   return {
        startDate:Date.now().toLocaleString(),
        endDate: Date.now().toLocaleString()
      };
  }
};

const handleSubmit = () => {
  const formData = methods.getValues();
  const dateRange = getDateRange(formData);
  console.log(JSON.stringify({  values: methods.getValues()}, null, 2));
  console.log(JSON.stringify(formData.WorkspaceType, null, 2));
  console.log("📅 טווח תאריכים:", dateRange); 
 getOccupancyReport(formData.WorkspaceType,dateRange);
 console.log("report", report);
 console.log("count", count);
 console.log("occupancyRate", occupancyRate);
}

  return (<div>

      <Form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8"  methods={methods}  >
        <SelectField name="WorkspaceType" label="בחר סוג חלל" options={workspaceType} className="mb-2" /><br />
          <SelectField name="TimePeriod" label="בחר תקופה" options={timePeriod}className="mb-2"dir="rtl" />   
<div className="mb-4">
  <label className="font-bold mb-1 block">  </label>
  {renderDateField()}
</div>
       <Button  type="submit" variant="primary" size="md" > לקבלת הדו"ח</Button>
      </Form>
 {/* <SelectField  name="format" label="פורמט ייצוא"options={exportFormat}className="mb-2"dir="rtl" /> */}
  
 {report && report.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800">סך הכל חללים</h3>
          <p className="text-3xl font-bold text-blue-600">{count}</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-800">אחוז תפוסה</h3>
          <p className="text-3xl font-bold text-green-600">{occupancyRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-purple-800">חללים מוקצים</h3>
          <p className="text-3xl font-bold text-purple-600">{report.length}</p>
        </div>
      </div>
    )}

    {/* הגרפים */}
    {chartData && (
      <div className="space-y-8">
        {/* גרף עוגה - סוגי חללים */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">התפלגות סוגי חללים</h3>
          <ChartDisplay 
            type="pie" 
            data={chartData.spaceTypesChart}
            rtl={true}
          />
        </div>

        {/* גרף עמודות - תפוסה */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">אחוזי תפוסה</h3>
          <ChartDisplay 
            type="bar" 
            data={chartData.occupancyChart}
            rtl={true}
          />
        </div>

        {/* גרף קו - ציר זמן (רק אם יש נתונים) */}
        {chartData.timelineChart.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">התפלגות לפי תאריכים</h3>
            <ChartDisplay 
              type="line" 
              data={chartData.timelineChart}
              rtl={true}
            />
          </div>
        )}
      </div>
    )}

    {/* הודעה אם אין נתונים */}
    {report && report.length === 0 && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 text-lg">לא נמצאו נתונים לתקופה שנבחרה</p>
      </div>
    )}
  </div>
);}
 //{/* הצגת הגרפים */}
//  {pieChartData && (
//   <div className="mt-8 bg-white p-6 rounded-lg shadow">
//     <h3 className="text-xl font-semibold mb-4">התפלגות סוגי חללים</h3>
//     <ChartDisplay 
//       type="pie" 
//       data={pieChartData}
//     />
//   </div>
       
//    )}
  // נתונים פשוטים לגרף עוגה:
//   const pieData: ChartData[] = [
//     { label: "חדר פרטי", value: 15 },
//     { label: "עמדת עבודה", value: 25 },
//     { label: "אזור משותף", value: 10 }
//   ];
  
//   setPieChartData(pieData);
  
//   console.log("📊 נתוני גרף עוגה:", pieData);
//     //const report = getOccupancyReport(get(watchedValues, "WorkspaceType"),dateRange);
  
//   };
// // דמה נתונים (בעתיד זה יהיה קריאה לשרת)
//   const mockOccupancyData = [
//     {
//       date: "2024-01-01",
//       totalSpaces: 50,
//       occupiedSpaces: 35,
//       openSpaceCount: 10,
//       deskInRoomCount: 15,
//       privateRoomCount: 8,
//       klikahCardCount: 2,
//       occupancyRate: 70
//     },
//     {
//       date: "2024-01-02", 
//       totalSpaces: 50,
//       occupiedSpaces: 42,
//       openSpaceCount: 12,
//       deskInRoomCount: 18,
//       privateRoomCount: 10,
//       klikahCardCount: 2,
//       occupancyRate: 84
//     }
//   ];
  
// const [pieChartData, setPieChartData] = useState<ChartData[] | null>(null);