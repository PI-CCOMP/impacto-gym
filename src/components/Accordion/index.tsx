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
      <button
        className={styles.topContent}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <p className={styles.title}>{title}</p>
        <span className={styles.icon} aria-hidden="true">
          {open ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>
      <div
        ref={contentRef}
        className={`${styles.content} ${open ? styles.active : ""}`}
        style={{ height, overflow: "hidden" }}
        hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}
