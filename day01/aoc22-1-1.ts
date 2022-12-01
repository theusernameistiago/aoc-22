const fs = require('fs');
const readline = require('readline');

async function readCalories() {
  const fileStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let caloriesPerElf = [];
  let totalForThisElf = 0;

  for await (const line of rl) {
    const l = line.trim();
    const calorieAmount = parseFloat(l);
    if (isNaN(calorieAmount)) {
      caloriesPerElf.push(totalForThisElf);
      totalForThisElf = 0;
    } else {
      totalForThisElf += calorieAmount;
    }
  }

  return caloriesPerElf;
}


async function printSolutions() {
  const cals = await readCalories();
  cals.sort((a,b) => a-b);
  console.log(`Solution to 1st part: ${cals[cals.length-1]}`);
  console.log(`Solution to 2nd part: ${cals[cals.length-1] + cals[cals.length-2] + cals[cals.length-3]}`);
}

printSolutions();