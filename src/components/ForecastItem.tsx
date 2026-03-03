import { cn } from "@/lib/utils";
import { CloudRain, CloudSun, Sun } from 'lucide-react';

const ForecastItem = ({
  time,
  id,
  temperature,
  description,
  phase,
}: ForecastItemProps) => (
  <div
    className={cn("flex flex-col items-center gap-1 p-3 text-sm border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-md mx-auto cursor-pointer")}
    onClick={() => {/* TODO: open subsection */}}
  >
    <span className="font-medium text-muted-foreground">{phase} • {time}</span>
    <span className="text-2xl font-bold text-foreground">{temperature} °C</span>
    <span className="capitalize text-xs text-muted-foreground text-center">
      {description.includes('rain')
      ? (
        <CloudRain className="size-8" />
      ) : description.includes('clear') ? <Sun className="size-8" /> : <CloudSun className="size-8" />}
    </span>
  </div>
)

export default ForecastItem;