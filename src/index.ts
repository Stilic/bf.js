export enum TokenType {
  MoveLeft,
  MoveRight,
  Increment,
  Decrement,
  Input,
  Output,
}

export type Token = TokenType | TokenType[];

export function parse(program: string): Token[] {
  const groups: Token[][] = [[]];
  let groupIndex = 0;

  for (let i = 0; i < program.length; i++) {
    switch (program[i]) {
      case "<":
        groups[groupIndex].push(TokenType.MoveLeft);
        break;

      case ">":
        groups[groupIndex].push(TokenType.MoveRight);
        break;

      case "+":
        groups[groupIndex].push(TokenType.Increment);
        break;

      case "-":
        groups[groupIndex].push(TokenType.Decrement);
        break;

      case ",":
        groups[groupIndex].push(TokenType.Input);
        break;

      case ".":
        groups[groupIndex].push(TokenType.Output);
        break;

      case "[":
        const token: TokenType[] = [];
        groups[groupIndex].push(token);
        groupIndex = groups.push(token) - 1;
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

  private readonly memory: InterpreterMemory = new InterpreterMemory();
  private readonly inputBuffer: number[] = [];
  private currentCell = 0;

  constructor(source: Token[]) {
    this.source = source;
  }

  private async executeCommand(command: Token) {
    if (Array.isArray(command)) {
      if (command.length > 0) {
        while (this.memory.get(this.currentCell) !== 0) {
          for (let i = 0; i < command.length; i++)
            this.executeCommand(command[i]);
        }
      }
    } else {
      switch (command) {
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
              (command === TokenType.Increment ? 1 : -1)
          );
          break;

        case TokenType.Input:
          if (this.onInput) {
            let input = this.onInput();
            if (input.length > 0) {
              if (this.inputBuffer.length <= 0) {
                const end = input.indexOf("\n");
                if (end !== -1) input = input.substring(0, end);

                const result = parseInt(input, 10);
                if (isNaN(result)) {
                  for (let i = input.length - 1; i >= 0; i--)
                    this.inputBuffer.push(input.charCodeAt(i));
                } else this.inputBuffer.push(result);
              }

              this.memory.set(this.currentCell, this.inputBuffer.pop()!);
            } else this.memory.set(this.currentCell, 0);
          }
          break;

        case TokenType.Output:
          if (this.onOutput)
            this.onOutput(
              String.fromCharCode(this.memory.get(this.currentCell))
            );
          break;
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
