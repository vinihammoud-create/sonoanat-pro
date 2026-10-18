import { cx } from '@/utils/format';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  className?: string;
}

export function Slider({ label, value, min, max, step = 1, unit = '%', onChange, className }: SliderProps) {
  return (
    <label className={cx('flex items-center gap-2 text-xs text-slate-300', className)}>
      <span className="shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full min-w-16 cursor-pointer"
        aria-label={label}
      />
      <span className="w-10 shrink-0 text-right tabular-nums text-slate-100">
        {value}
        {unit}
      </span>
    </label>
  );
}
