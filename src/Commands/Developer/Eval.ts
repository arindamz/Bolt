import { Command, CommandOptions } from 'discord-akairo';
import { stripIndents } from 'common-tags';
import { Message, Util } from 'discord.js';
import * as util from 'util';
import { ApplyOptions } from '../../Lib/Utils/ApplyOptions';

const NL = '!!NL!!';
const NL_PATTERN = new RegExp(NL, 'g');

@ApplyOptions<CommandOptions>('eval', {
  aliases: ['eval', 'ev'],
  description: {
    content: "You can't use this anyway, so why explain.",
    usage: '<code>',
  },
  category: 'Developer',
  ownerOnly: true,
  ratelimit: 2,
  args: [
    {
      id: 'code',
      match: 'content',
      type: 'string',
      prompt: {
        start: (message: Message) =>
          `${message.author}, what would you like to evaluate?`,
      },
    },
  ],
})
export default class Eval extends Command {
  public hrStart: [number, number] | undefined;

  public lastResult: any = null;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly _sensitivePattern!: any;

  public async exec(message: Message, { code }: { code: string }) {
    const msg = message;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let hrDiff;
    try {
      const hrStart = process.hrtime();
			this.lastResult = eval(code); // eslint-disable-line
      hrDiff = process.hrtime(hrStart);
    } catch (error) {
      return message.util!.send(`Error while evaluating: \`${error}\``);
    }

    this.hrStart = process.hrtime();
    const result = this._result(this.lastResult, hrDiff, code);
    if (Array.isArray(result))
      return result.map(async (res) => message.util!.send(res));
    return msg.util!.send(result);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _result(
    result: any,
    hrDiff: [number, number],
    input: string | null = null
  ) {
    const inspected = util
      .inspect(result, { depth: 0 })
      .replace(NL_PATTERN, '\n')
      .replace(this.sensitivePattern, '--snip--');
    const split = inspected.split('\n');
    const last = inspected.length - 1;
    const prependPart =
      !inspected.startsWith('{') &&
      !inspected.startsWith('[') &&
      !inspected.startsWith("'")
        ? split[0]
        : inspected[0];
    const appendPart =
      inspected[last] !== '}' &&
      inspected[last] !== ']' &&
      inspected[last] !== "'"
        ? split[split.length - 1]
        : inspected[last];
    const prepend = `\`\`\`javascript\n${prependPart}\n`;
    const append = `\n${appendPart}\n\`\`\``;
    if (input) {
      return Util.splitMessage(
        stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`,
        { maxLength: 1900, prepend, append }
      );
    }

    return Util.splitMessage(
      stripIndents`
			*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${
        hrDiff[1] / 1000000
      }ms.*
			\`\`\`javascript
			${inspected}
			\`\`\`
		`,
      { maxLength: 1900, prepend, append }
    );
  }

  private get sensitivePattern(): any {
    if (!this._sensitivePattern) {
      const token = this.client.token!.split('').join('[^]{0,2}');
      const revToken = this.client.token!.split('').reverse().join('[^]{0,2}');
      Object.defineProperty(this, '_sensitivePattern', {
        value: new RegExp(`${token}|${revToken}`, 'g'),
      });
    }
    return this._sensitivePattern;
  }
}
