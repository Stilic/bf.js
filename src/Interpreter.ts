import { Token, TokenType } from "./Parser";

export default class Interpreter {
  public readonly source: Token[];

  public onInput?: () => string;
  public onOutput?: (char: string) => void;

  private cells: number[];
  private currentCell: number;

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
