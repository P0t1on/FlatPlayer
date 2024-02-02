// setEntity("wall", 1, 1, 0)
console.log(world);

for (let y = 1; y < world.height + 1; y++) {
  for (let x = 1; x < world.width + 1; x++) {
    if(x === 1 || y === 1 || x === world.width || y === world.height) setEntity("wall", x, y, 0);
  }
}
