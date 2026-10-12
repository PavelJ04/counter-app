export function localDateIso(date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  export function daysUntil(target: string, today: string): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const targetTime = Date.parse(target);
    const todayTime = Date.parse(today);
  
    return (targetTime - todayTime) / millisecondsPerDay;
  }