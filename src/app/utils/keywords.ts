export class Keywords {

    static createKeywords(text: string): string[] {
        const arrText = [];
        let curText = '';
        text.toLowerCase().split('').forEach(letter => {
            curText += letter;
            arrText.push(curText);
        });
        return arrText;
    }

    static generateKeywords(fields): string[] {
        const [name, city] = fields;
        const keywordsNameCity = this.createKeywords(`${name} ${city}`);
        const keywordsCityName = this.createKeywords(`${city} ${name}`);
        return [
            ...new Set([
              '',
              ...keywordsNameCity,
              ...keywordsCityName
            ])
        ];
    }

}
