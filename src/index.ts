export enum TokenType {
  MoveLeft,
  MoveRight,
  Increment,
  Decrement,
  Input,
  Output,
  Loop,
}

export type Token = {
  type: TokenType;
  content?: Token[];
};

export function parse(program: string): Token[] {
  const groups: Token[][] = [[]];
  let groupIndex = 0;

  for (let i = 0; i < program.length; i++) {
    switch (program[i]) {
      case "<":
        groups[groupIndex].push({ type: TokenType.MoveLeft });
        break;

      case ">":
        groups[groupIndex].push({ type: TokenType.MoveRight });
        break;

      case "+":
        groups[groupIndex].push({ type: TokenType.Increment });
        break;

      case "-":
        groups[groupIndex].push({ type: TokenType.Decrement });
        break;

      case ",":
        groups[groupIndex].push({ type: TokenType.Input });
        break;

      case ".":
        groups[groupIndex].push({ type: TokenType.Output });
        break;

      case "[":
        const token = { type: TokenType.Loop, content: [] };
        groups[groupIndex].push(token);
        groupIndex = groups.push(token.content) - 1;
        break;

      case "]":
        if (groupIndex < 1) throw "Unmatched ]";
        groups.pop();
        groupIndex--;
    }
  }

  if (groupIndex > 0) throw "Unmatched [";

  return groups[0];
}

class InterpreterMemory {
  private cells: number[] = [];

  public get(cell: number) {
    if (Object.prototype.hasOwnProperty.call(this.cells, cell))
      return this.cells[cell];
    else return 0;
  }

  public set(cell: number, value: number) {
    if (value > Number.MAX_SAFE_INTEGER) value = 0;
    else if (value < 0) value = Number.MAX_SAFE_INTEGER;

    this.cells[cell] = Math.trunc(value);
  }

  public reset() {
    this.cells.length = 0;
  }
}

export class Interpreter {
  public readonly source: Token[];

  public onInput?: () => string;
  public onOutput?: (char: string | number) => void;

  private memory: InterpreterMemory = new InterpreterMemory();
  private currentCell = 0;

  constructor(source: Token[]) {
    this.source = source;
  }

  private async executeCommand(command: Token) {
    switch (command.type) {
      case TokenType.MoveLeft:
        if (this.currentCell > 0) this.currentCell--;
        break;

      case TokenType.MoveRight:
        this.currentCell++;
        break;

      case TokenType.Increment:
      case TokenType.Decrement:
        this.memory.set(
          this.currentCell,
          this.memory.get(this.currentCell) +
            (command.type === TokenType.Increment ? 1 : -1)
        );
        break;

      case TokenType.Input:
        if (this.onInput) {
          let input = this.onInput();
          if (input.length === 0) throw "Input can't be empty";
          else {
            if (typeof input === "number")
              this.memory.set(this.currentCell, input);
            else {
              const end = input.indexOf("\n");
              if (end !== -1) input = input.substring(0, end);

              let result = +input;
              if (isNaN(result)) {
                result = 0;
                for (let i = 0; i < input.length; i++)
                  result += input.charCodeAt(i);
              }

              this.memory.set(this.currentCell, result);
            }
          }
        }
        break;

      case TokenType.Output:
        if (this.onOutput)
          this.onOutput(String.fromCharCode(this.memory.get(this.currentCell)));
        break;

      case TokenType.Loop:
        if (command.content) {
          while (this.memory.get(this.currentCell) !== 0) {
            for (let i = 0; i < command.content.length; i++)
              this.executeCommand(command.content[i]);
          }
        }
    }
  }

  public run() {
    this.memory.reset();
    this.currentCell = 0;

    for (let i = 0; i < this.source.length; i++)
      this.executeCommand(this.source[i]);
  }
}
