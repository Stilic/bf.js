const program =
  "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
let i: number;

const cells: number[] = [];
let currentCell = 0;

let output = "";

function parseCommand(cmd: string) {
  switch (cmd) {
    case ">":
      currentCell++;
      break;

    case "<":
      if (currentCell > 0) currentCell--;
      break;

    case "+":
    case "-":
      if (!Object.prototype.hasOwnProperty.call(cells, currentCell))
        cells[currentCell] = 0;
      if (cmd === "+") cells[currentCell]++;
      else if (cells[currentCell] > 0) cells[currentCell]--;
      break;

    case ".":
      output += String.fromCharCode(cells[currentCell]);
      break;

    case "[":
      const start = i + 1;
      let leftAttempts = 0;
      for (i++; i < program.length; i++) {
        if (program[i] === "[") leftAttempts++;
        else if (program[i] === "]") {
          if (leftAttempts > 0) leftAttempts--;
          else break;
        }
      }
      const end = i;
      while (cells[currentCell] !== 0) {
        for (i = start; i < end; i++) parseCommand(program[i]);
      }
  }
}

for (i = 0; i < program.length; i++) parseCommand(program[i]);

console.log(output);
