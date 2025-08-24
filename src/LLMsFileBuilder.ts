import path from "node:path";

export class LlmsFileBuilder {
    #title: string | undefined;
    #description: string | undefined;
    #content: string;
    #url: string | undefined;

    constructor(title?: string, url?: string) {
        this.#title = title;
        this.#content = "";
        this.#url = url;
    }

    addDescription(description: string | undefined) {
        this.#description = description;
    }

    #createDescription() {
        if (this.#description) {
            return `\n> ${this.#description}\n`;
        }

        return "";
    }

    #createLinkToLLMsFull() {
        if (this.#url) {
            return `\n\nFor complete documentation in a single file, see [Full Documentation](${path.join(this.#url, "llms-full.txt")}).\n\n`;
        }

        return "";
    }

    build(): string {
        // TODO:
        return this.#title + "\n" + this.#createDescription() + this.#createLinkToLLMsFull() + "\n" + this.#content;
    }

    buildFull(): string {
        // TODO:
        return this.#title + "\n" + this.#createDescription() + "\n" + this.#content;
    }
}
