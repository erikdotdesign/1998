export const centerPosition = (
  desktopRef: React.RefObject<HTMLElement | null>,
  width: number,
  height: number
) => {
  const el = desktopRef.current;
  if (!el) return [0, 0];

  const rect = el.getBoundingClientRect();

  const x = Math.max(0, (rect.width - width) / 2);
  const y = Math.max(0, (rect.height - height) / 2);

  return [x, y];
};