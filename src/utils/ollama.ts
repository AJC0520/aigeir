

// *****************************************************************
//
//      COOKGEIR FUNCTIONS
//
// *****************************************************************
export async function getRecipeSuggestions(ingredients: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen3.5:4b',
            messages: [
                {
                    role: 'user',
                    content: `I have these ingredients: ${ingredients}, plus basic pantry and household items. Return exactly 3 recipes. No thinking, no explanation, no extra text. Respond in this exact format: Recipe1 Name|Cooking Time in Minutes\nRecipe2 Name|Cooking Time in Minutes\nRecipe3 Name|Cooking Time in Minutes`
                }
            ],
            stream: false,
            think: false,
        })
    })

    const data = await response.json()
    return data.message.content
}

export async function getRecipeDetails(recipeName: string, ingredients: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen3.5:4b',
            messages: [
                {
                    role: 'user',
                    content: `Provide detailed instructions for making ${recipeName} using relevant ingredients from: ${ingredients}. No thinking, no explanation, no extra text. Respond ONLY with valid JSON in this exact format: { "ingredients": [{ "name": "ingredient name", "quantity": "amount" }], "instructions": ["Step one", "Step two"] }`
                }
            ],
            stream: false,
            think: false,
        })
    })

    const data = await response.json()
    return data.message.content
}
