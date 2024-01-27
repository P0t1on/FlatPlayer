const BITS = 0b1000;

function serializeNumArray(arr: number[], size: number = BITS) {
  let compressed = 0b0;

  for (let i = 0, size = arr.length; i < size; i++) {
    compressed |= (arr[i] as number) << (i * size);
  }

  return compressed;
}

function deserializeNumArray(bin: number, size: number = BITS) {
  let result = [];
  const mask = 2 ** size - 1;

  do {
    result.push(bin & mask);
    bin >>= size;
  } while (bin > 0);

  return bin;
}

const removeFlag = (flags: number, removeFlag: number) => flags & ~removeFlag;

const hasFlags = (flags: number, ...checks: number[]) => {
  for (const flag of checks) {
    if ((flags & flag) > 0) return true;
  }

  return false;
};

const containFlags = (flags: number, ...checks: number[]) => {
  for (const flag of checks) {
    if ((flags & flag) === 0) return false;
  }

  return true;
};

export { removeFlag, hasFlags, containFlags };
