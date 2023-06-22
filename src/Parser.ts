export enum TokenType {
  MoveLeft,
  MoveRight,
  Increment,
  Decrement,
  Output,
  Input,
  Loop,
}

export type Token = {
  type: TokenType;
  content?: Token[];
};

export default function parse(program: string) {
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

      case ".":
        groups[groupIndex].push({ type: TokenType.Output });
        break;

      case ",":
        groups[groupIndex].push({ type: TokenType.Input });
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

  if (groups.length > 1) throw "Unmatched [";

  return groups[0];
}
