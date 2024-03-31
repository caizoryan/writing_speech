

export function map_value(value, start1, stop1, start2, stop2) {
  let val = start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));

  if (val > stop2) return stop2
  else return val
}
