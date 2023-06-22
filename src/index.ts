import parse from "./Parser";
import Interpreter from "./Interpreter";

new Interpreter(
  parse(
    `
	>>>++[
		<++++++++[
			<[<++>-]>>[>>]+>>+[
				-[->>+<<<[<[<<]<+>]>[>[>>]]]
				<[>>[-]]>[>[-<<]>[<+<]]+<<
			]<[>+<-]>>-
		]<.[-]>>
	]
	`
  )
)
  .run()
  .then((output) => console.log(output));
