export const formatNumberIL = (value: number) => {
  return new Intl.DateTimeFormat('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date());
};

export const formatDateIL = (dateString: string | Date) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
 //אם התאריך לא נכונה מחזיר לי NULL 
    return String(dateString);
  }
  return new Intl.DateTimeFormat('he-IL').format(date);
};
