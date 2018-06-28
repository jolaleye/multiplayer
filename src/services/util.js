export const lerp = (v0, v1, t) => ((1 - t) * v0) + (t * v1);

export const angleLerp = (a0, a1, t) => {
  const max = Math.PI * 2;
  const da = (a1 - a0) % max;
  const shortestAngle = ((2 * da) % max) - da;
  return a0 + (shortestAngle * t);
};
