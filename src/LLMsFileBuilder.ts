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

    get llmsFilePath() {
        return this.#url ? `${this.#url}/llms.txt` : "llms.txt";
    }

    get llmsFullFilePath() {
        return this.#url ? `${this.#url}/llms-full.txt` : "llms-full.txt";
    }

    #createLinkToLLMsFull() {
        if (this.#url) {
            return `\n\nFor complete documentation in a single file, see [Full Documentation](${this.llmsFullFilePath}).\n\n`;
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
