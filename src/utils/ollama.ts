

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
                    content: `You are a professional chef. Create a recipe for ${recipeName} using ingredients from: ${ingredients}. You may assume basic pantry items (salt, pepper, oil, butter, flour, sugar, common spices). You may add up to 3 extra ingredients thats not on the list if necessary. Respond ONLY with valid JSON, no extra text, no markdown. Format: { "ingredients": [{ "name": "string", "quantity": "string" }], "instructions": ["string"] }`
                }
            ],
            stream: false,
            think: false,
        })
    })

    const data = await response.json()
    return data.message.content
}
