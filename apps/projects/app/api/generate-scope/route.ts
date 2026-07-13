import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const perplexityOpenAI = process.env.PERPLEXITY_API_KEY
  ? new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseURL: 'https://api.perplexity.ai',
    })
  : null;

function getProvider(model: string): 'openai' | 'anthropic' | 'perplexity' {
  if (model.startsWith('claude-')) return 'anthropic';
  if (model.startsWith('sonar')) return 'perplexity';
  return 'openai';
}

const SYSTEM_PROMPT = `You are a scope writer for projects and tasks. Generate a concise, actionable scope description.

Format the output using simple markdown:
- Use "## Heading" or "### Subheading" to divide content into logical sections when the scope warrants it (e.g. "## Goals", "## Deliverables", "## Out of Scope")
- Use "- " for bullet points under each section
- Use "**text**" to bold key deliverables, important phrases, or key terms
- Use numbered lists (1. 2. etc.) for sequential steps when appropriate
- Keep it concise — no padding, no fluff
- Be specific and practical
- For simple tasks a flat bullet list is fine; use headings only when they genuinely improve clarity

Output ONLY the formatted scope text — no preamble, no explanation.`;

export async function POST(req: Request) {
  try {
    const { prompt, name, type = 'project', model = 'claude-sonnet-4-6', projectName, projectDescription } = await req.json();

    if (!prompt?.trim() && !name?.trim()) {
      return NextResponse.json({ error: 'Prompt or name is required' }, { status: 400 });
    }

    let userPrompt = `Generate a scope for the following ${type}:\nName: ${(name ?? '').trim() || 'Untitled'}`;

    if (type === 'task') {
      if (projectName?.trim()) userPrompt += `\nProject: ${projectName.trim()}`;
      if (projectDescription?.trim()) userPrompt += `\nProject description: ${projectDescription.trim()}`;
    }

    if (prompt?.trim()) userPrompt += `\nAdditional context: ${prompt.trim()}`;

    const provider = getProvider(model);
    let content = '';

    if (provider === 'anthropic') {
      if (!anthropic) throw new Error('Anthropic API key not configured');
      const message = await anthropic.messages.create({
        model,
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });
      content = message.content[0]?.type === 'text' ? message.content[0].text : '';
    } else if (provider === 'perplexity') {
      if (!perplexityOpenAI) throw new Error('Perplexity API key not configured');
      const completion = await perplexityOpenAI.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 512,
      });
      content = completion.choices[0]?.message?.content ?? '';
    } else {
      if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key not configured');
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 512,
        temperature: 0.7,
      });
      content = completion.choices[0]?.message?.content ?? '';
    }

    return NextResponse.json({ content: content.trim() });
  } catch (error) {
    console.error('scope-gen error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate scope',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
