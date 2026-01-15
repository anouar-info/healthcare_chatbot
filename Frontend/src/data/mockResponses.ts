export const mockResponses: string[] = [
  "🩺 Demo reply: Your symptoms are currently vibes-based. Please reboot your immune system.",
  "Demo reply: I consulted the ancient scrolls of data. Result: maybe-ish.",
  "Demo reply: I ran a totally scientific guess: 73% chance of 'Monday syndrome'.",
  "Demo reply: According to my calculations, you might benefit from more snacks. This is not medical advice.",
  "🔬 Demo reply: Your health aura appears to be... loading. Please try again in a parallel universe.",
  "Demo reply: Based on my quantum health algorithm, I recommend interpretive dance therapy.",
  "Demo reply: The medical oracle says: 'Ask again after coffee.'",
  "💊 Demo reply: I've cross-referenced your symptoms with 47 cat videos. Results inconclusive but adorable.",
  "Demo reply: Your wellness score is 'mildly existential.' Consider petting a dog.",
  "Demo reply: My diagnosis: You're experiencing a classic case of being a human. Symptoms include existing.",
  "🏥 Demo reply: I've consulted the ancient healing crystals (they're actually just decorative). Stay hydrated!",
  "Demo reply: According to my highly sophisticated random number generator: Take two naps and call me never.",
  "Demo reply: Your symptoms suggest you may be a plant pretending to be a person. Water yourself.",
  "🌡️ Demo reply: The thermometer of fate reads: 'Room temperature with a chance of meatballs.'",
  "Demo reply: I ran your query through our AI... it just sent back a shrug emoji. 🤷‍♂️",
  "Demo reply: Medical analysis complete: You are made of stardust and occasional bad decisions.",
  "💉 Demo reply: My prescription: One unit of fresh air, three laughs, and unlimited puppy cuddles.",
  "Demo reply: Consulting the mystical health database... it says to eat your vegetables. How original.",
  "Demo reply: Your biological metrics indicate you are approximately one (1) human. Congratulations!",
  "🧬 Demo reply: DNA scan complete. Results: 100% that person. No further action required.",
  "Demo reply: The wellness algorithm suggests: Have you tried turning yourself off and on again?",
  "Demo reply: According to ancient wisdom and/or this random array: Drink more water, less drama.",
  "🩹 Demo reply: Diagnosis pending... just kidding, I'm not a real doctor. I'm just vibing here.",
  "Demo reply: Your health inquiry has been forwarded to the Department of Made-Up Statistics.",
  "Demo reply: Based on my analysis of zero actual data: You're probably fine. Probably.",
  "🌿 Demo reply: The herbal remedy generator suggests: Have you considered becoming a houseplant?",
  "Demo reply: Processing your symptoms through our patented nonsense filter... Output: ¯\\_(ツ)_/¯",
  "Demo reply: Your wellness trajectory appears to be trending towards 'needs more snacks.'",
  "💚 Demo reply: Health status: Currently held together by caffeine and good intentions.",
  "Demo reply: I've analyzed your query with cutting-edge placeholder technology. Result: ✨ vibes ✨",
];

export function getRandomMockResponse(): string {
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
}

export function generateConversationTitle(firstMessage: string): string {
  const words = firstMessage.trim().split(/\s+/).slice(0, 4);
  let title = words.join(' ');
  if (title.length > 30) {
    title = title.substring(0, 27) + '...';
  }
  return title || 'New chat';
}
