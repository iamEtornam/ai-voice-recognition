import * as z from 'zod';

// Import the Genkit core libraries and plugins.
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, startFlowsServer } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';

// Import models from the Google AI plugin. The Google AI API provides access to
// several generative models. Here, we import Gemini 1.5 Flash.
import { gemini15Flash } from '@genkit-ai/googleai';

configureGenkit({
  plugins: [
    // Load the Google AI plugin. You can optionally specify your API key
    // by passing in a config object; if you don't, the Google AI plugin uses
    // the value from the GOOGLE_GENAI_API_KEY environment variable, which is
    // the recommended practice.
    googleAI(),
  ],
  // Log debug output to tbe console.
  logLevel: 'debug',
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracingAndMetrics: true,
});

export const assistanceFlow = defineFlow({
  name: 'assistanceFlow',
  inputSchema: z.string(),
  outputSchema: z.string(),
},
  async (text) => {
    const llmResponse = await generate({
      prompt: [
        {
          text: 'You are an intelligent and helpful voice assistant designed to assist users with a wide range of tasks. When users speak to you, always listen carefully and respond in a friendly, clear, and concise manner. Your primary goals are to understand the user\'s intent, offer relevant information, and guide them through their tasks seamlessly. If the user asks about the weather, provide a local weather update. For questions about nearby locations, such as restaurants, parks, or stores, suggest popular options based on their location. For reminders, appointments, or scheduling, confirm the details with the user and set the reminder in a helpful and polite way. Additionally, if the user requests a joke, fun fact, or motivational quote, deliver it in an engaging and cheerful tone. Always prioritize privacy, avoid sharing sensitive data unless explicitly requested, and confirm with the user if any personal information is involved. Stay adaptable, friendly, and professional at all times, ensuring users feel comfortable interacting with you.',
        },
     {
       text: text,
     }
      ],
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text();
  });

// Start a flow server, which exposes your flows as HTTP endpoints. This call
// must come last, after all of your plug-in configuration and flow definitions.
// You can optionally specify a subset of flows to serve, and configure some
// HTTP server options, but by default, the flow server serves all defined flows.
startFlowsServer();
