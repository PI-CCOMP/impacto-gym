import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

type FaqItemProps = { faqTitle: string; faqDescription: string };

export function FaqItem({ faqTitle, faqDescription }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <p className={styles.faqTitle}>{faqTitle}</p>
        <button className={styles.icon} onClick={() => setOpen(!open)}>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <p
        ref={contentRef}
        className={`${styles.faqDescription} ${open ? styles.active : ""}`}
        style={{ height }}
      >
        {faqDescription}
      </p>
    </div>
  );
}
