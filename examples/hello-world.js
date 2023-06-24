const { Interpreter, parse } = require("../lib/index");

const program = new Interpreter(
  parse(
    "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
  )
);
program.onOutput = (char) => process.stdout.write(char);
program.run();
