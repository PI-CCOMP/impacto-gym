import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  transparent?: boolean;
};

export function Accordion({
  title,
  children,
  transparent = false,
}: AccordionProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  return (
    <div
      className={`${styles.container} ${transparent ? styles.transparent : ""}`}
    >
      <div className={styles.topContent}>
        <p className={styles.title}>{title}</p>
        <button className={styles.icon} onClick={() => setOpen(!open)}>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <div
        ref={contentRef}
        className={`${styles.content} ${open ? styles.active : ""}`}
        style={{ height, overflow: "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
