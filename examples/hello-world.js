import { Interpreter, parse } from "../lib/index.js";

const program = new Interpreter(
  parse(
    "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
  )
);
program.onOutput = (char) => process.stdout.write(char);
program.run();
