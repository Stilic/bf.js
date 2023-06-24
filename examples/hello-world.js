const { Interpreter, parse } = require("../lib/index");

const program = new Interpreter(
  parse(
    "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
  )
);
program.onOutput = (char) => console.log(char);
program.run();
