
interface ForecastItemProps {
  id: number;
  time: string;
  temperature: number;
  description: string;
  phase: string;
}

type DayPhases = '00' | '06' | '12' | '18';