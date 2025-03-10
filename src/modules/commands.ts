import fs from "fs";
import dayjs from "dayjs";

const commandsFiles = fs.readdirSync("./src/commands"); // todo: make this work with both src and dist
let commandsLoad = [];
for (const file of commandsFiles) {
	if (
		(!file.endsWith(".js") && !file.endsWith(".ts")) ||
		file.endsWith(".d.ts")
	)
		continue;
	const fileName = file.split(".");
	const timestamp = new Date().getTime();
	const time = dayjs(timestamp).toISOString();
	try {
		commandsLoad.push(await import(`../commands/${fileName[0]}.ts`));
		console.log(`[${time}] [commands] Loaded command file ${file}!`);
	} catch (error) {
		commandsLoad.push(await import(`../commands/${fileName[0]}.js`));
		console.log(`[${time}] [commands] Loaded command file ${file}!`);
	}
}

export const commands = commandsLoad;
