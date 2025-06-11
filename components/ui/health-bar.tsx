import { Triangle } from "lucide-react";

export function HealthBar({ value }: { value: "GREEN" | "YELLOW" | "ORANGE" | "RED" }) {
    const colorMap = {
        GREEN: 0,
        YELLOW: 27,
        ORANGE: 53,
        RED: 79,
    }
    const color = colorMap[value];
    
    return (
    <div className="scale-120">
        <div className="flex items-center gap-0.5">
            <div className="w-2 h-2 rounded-[2px] bg-green-500" />
            <div className="w-2 h-2 rounded-[2px] bg-yellow-500" />
            <div className="w-2 h-2 rounded-[2px] bg-orange-500" />
            <div className="w-2 h-2 rounded-[2px] bg-red-500" />
        </div>
        <div className="relative w-full">
            <div className="absolute top-[1px]" style={{ left: `${color}%` }}>
                <Triangle className="size-2 fill-gray-800 stroke-0 text-gray-800 dark:fill-gray-200 dark:stroke-0 dark:text-gray-200" />
            </div>
        </div>
    </div>
  );
}