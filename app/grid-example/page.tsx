import { Box } from "../features/Box";

export default function GridExample() {
  return (
    <div className="layout content-grid">
      <Box className="content" />
      <Box className="breakout" />
      <Box className="fullwidth" />
    </div>
  );
}
