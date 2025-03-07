import "./Box.css";

interface BoxProps {
  /**
   * The className should be one of:
   * - content
   * - breakout
   * - fullwidth
   */
  className: "content" | "breakout" | "fullwidth";
}

export default function Box({ className }: BoxProps) {
  return (
    <div className={`box ${className}`}>
      <h2>{className}</h2>
    </div>
  );
}
