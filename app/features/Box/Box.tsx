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
    <div className={className}>
      <h2>{className}</h2>
    </div>
  );
}
