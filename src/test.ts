import parse from "./Parser";
import Interpreter from "./Interpreter";

const interpreter = new Interpreter(
  parse(
    `
    +++[>+++++<-]>[>+>+++>+>++>+++++>++<[++<]>---]>->-.[>++>+<<--]>--.--.+.>
    >>++.<<.<------.+.+++++.>>-.<++++.<--.>>>.<<---.<.-->-.>+.[+++++.---<]>>
    [.--->]<<.<+.++.++>+++[.<][http://www.hevanet.com/cristofd/brainfuck/]<.
      `
  )
);
interpreter.onOutput = (char) => process.stdout.write(char);
interpreter.run();
