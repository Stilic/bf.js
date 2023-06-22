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

export function parse(program: string) {
  const groups: Token[][] = [[]];
  let groupIndex = 0;

  for (let i = 0; i < program.length; ++i) {
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

export default class Interpreter {
  public readonly source: Token[];

  public onInput?: () => string;
  public onOutput?: (char: string) => void;

  private cells: number[] = [];
  private currentCell = 0;

  constructor(source: Token[]) {
    this.source = source;
  }

  private prepareCurrentCell() {
    if (!Object.prototype.hasOwnProperty.call(this.cells, this.currentCell))
      this.cells[this.currentCell] = 0;
  }

  private executeCommand(command: Token) {
    switch (command.type) {
      case TokenType.MoveLeft:
        if (this.currentCell > 0) this.currentCell--;
        this.prepareCurrentCell();
        break;

      case TokenType.MoveRight:
        this.currentCell++;
        this.prepareCurrentCell();
        break;

      case TokenType.Increment:
      case TokenType.Decrement:
        this.prepareCurrentCell();
        if (command.type === TokenType.Increment)
          this.cells[this.currentCell]++;
        else this.cells[this.currentCell]--;
        break;

      case TokenType.Input:
        if (this.onInput) {
          const input = this.onInput();
          if (input.length === 0) throw "Input can't be empty";
          else {
            this.prepareCurrentCell();
            this.cells[this.currentCell] = input.charCodeAt(0);
          }
        }
        break;

      case TokenType.Output:
        this.prepareCurrentCell();
        if (this.onOutput)
          this.onOutput(String.fromCharCode(this.cells[this.currentCell]));
        break;

      case TokenType.Loop:
        if (command.content) {
          while (this.cells[this.currentCell] !== 0) {
            for (let i = 0; i < command.content.length; ++i)
              this.executeCommand(command.content[i]);
          }
        }
    }
  }

  public async run() {
    this.cells = [];
    this.currentCell = 0;

    this.prepareCurrentCell();

    for (let i = 0; i < this.source.length; ++i)
      this.executeCommand(this.source[i]);
  }
}
