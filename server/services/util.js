exports.ID = () => Math.random().toString(36).substr(2, 9);

exports.getDistance = (x1, x2, y1, y2) => ({
  x: x2 - x1,
  y: y2 - y1,
  total: Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2)),
});
