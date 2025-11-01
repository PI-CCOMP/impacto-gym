import { useState, useRef } from "react";
import styles from "./styles.module.css";
import { Button } from "../Button";
import Picker from "react-mobile-picker";

interface TimeAdjustProps {
  initialTime?: number;
  onConfirm?: (time: number) => void;
}

export function TimeAdjust({ initialTime = 90, onConfirm }: TimeAdjustProps) {
  const [time, setTime] = useState<number>(initialTime);
  const [editing, setEditing] = useState<boolean>(false);

  const startY = useRef(0);
  const startTime = useRef(time);
  const dragging = useRef(false);

  const step = 5;
  const sensibility = 8;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}min ${sec < 10 ? "0" : ""}${sec}s`;
  };

  const handleConfirm = () => {
    setEditing(false);
    onConfirm?.(time);
  };

  const handleStart = (clientY: number) => {
    dragging.current = true;
    startY.current = clientY;
    startTime.current = time;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", stopDrag);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;

    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    const diffY = startY.current - clientY;

    const stepsMoved = Math.floor(diffY / sensibility);
    const newTime = Math.max(0, startTime.current + stepsMoved * step);

    setTime(newTime);
  };

  const stopDrag = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("touchend", stopDrag);
  };

  const maxTime = 240; // 4 minutos
  const timeOptions = Array.from(
    { length: maxTime / step + 1 },
    (_, i) => i * step
  );

  return (
    <div className={styles.container}>
      <p>Tempo de descanso:</p>

      <span
        className={styles.time}
        onClick={() => setEditing(true)}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: "ns-resize", userSelect: "none" }}
      >
        {formatTime(time)}
      </span>

      {editing && (
        <div className={styles.bottomOverlay}>
          <p className={styles.pickerTitle}>Ajustar descanso</p>
          <div className={styles.pickerWrapper}>
            <Picker
              value={{ sec: time }}
              onChange={(v) => setTime(v.sec)}
              itemHeight={60}
              visibleItemCount={3}
            >
              <Picker.Column name="sec">
                {timeOptions.map((sec) => (
                  <Picker.Item key={sec} value={sec}>
                    {formatTime(sec)}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </div>

          <Button onClick={handleConfirm}>Feito</Button>
        </div>
      )}
    </div>
  );
}
