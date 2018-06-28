export const lerp = (v0, v1, t) => ((1 - t) * v0) + (t * v1);

export const angleLerp = (a0, a1, t) => {
  const max = Math.PI * 2;
  const da = (a1 - a0) % max;
  const shortestAngle = ((2 * da) % max) - da;
  return a0 + (shortestAngle * t);
};

export const getDistance = (x1, x2, y1, y2) => ({
  x: x2 - x1,
  y: y2 - y1,
  total: Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2)),
});
