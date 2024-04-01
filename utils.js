

export function map_value(value, oldMin, oldMax, newMin, newMax) {
  // Check if the old range is not zero to avoid division by zero
  if (oldMax - oldMin === 0) {
    throw new Error("The old range cannot have zero width.");
  }

  // Map the value to the new range
  var mappedValue = ((value - oldMin) * (newMax - newMin) / (oldMax - oldMin)) + newMin;

  // Clamp the mapped value within the new range
  if (newMin < newMax) {
    mappedValue = Math.min(Math.max(mappedValue, newMin), newMax);
  } else {
    mappedValue = Math.min(Math.max(mappedValue, newMax), newMin);
  }


  return mappedValue;
}

export function find_sequence(arr, sequence) {
  for (let i = 0; i <= arr.length - sequence.length; i++) {
    let found = true;
    for (let j = 0; j < sequence.length; j++) {
      if (arr[i + j].toLowerCase() !== sequence[j].toLowerCase()) {
        found = false;
        break;
      }
    }
    if (found) {
      return i;
    }
  }
  return -1;
}
