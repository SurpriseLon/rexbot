import { Message } from "revolt.js";

import { globalStrings } from "../i18n/en_GB";

import { handleError } from "../modules/functions";

import * as util from "util";

export const name = "eval";
export const aliases = ["evaluate"];
export const description = "Evaluates the provided code.";
export const developer = true;
export const serverOnly = false;

export async function run(msg: Message, language: string, args: string[]) {
	try {
		const clean = (text: string) => {
			if (typeof text === "string")
				return text
					.replace(/`/g, "`" + String.fromCharCode(8203))
					.replace(/@/g, "@" + String.fromCharCode(8203));
			else return text;
		};
		const response = (input: string) => {
			if (input.length > 2000) {
				console.log(input);
				return "The output was too long, so I've `console.log`ged it.";
			} else if (input.length === 0) {
				return "There was no output :flushed:";
			} else return input;
		};
		try {
			const input = args.join(" ");
			let output = eval(input);
			if (typeof output !== "string") output = util.inspect(output);
			const cleanOutput = clean(output);
			const content = response(cleanOutput);
			return msg.channel?.sendMessage(content);
		} catch (error) {
			return msg.channel?.sendMessage(
				`# Something went wrong\n\n### There appears to have been an error - here's the error message:\n\n\`\`\`${error}\`\`\``
			);
		}
	} catch (err) {
		msg.channel?.sendMessage(
			globalStrings.errors.genericErrorWithTrace(err)
		);
		handleError(msg, err, "error");
	}
}
