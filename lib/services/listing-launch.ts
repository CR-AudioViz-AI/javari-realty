// =============================================================================
// AI LISTING LAUNCH SERVICE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:26 PM EST
// Hero Workflow #1: Generate complete listing content in 30 minutes
// =============================================================================

import {
  ListingLaunchRequest,
  ListingLaunchResult,
  ListingLaunchProgress,
  ListingLaunchStep,
  GeneratedContent,
  ContentType,
  SOCIAL_TEMPLATES,
} from '@/types/listing-launch';

const AI_ENDPOINT = '/api/javari/generate';

interface AIGenerationOptions {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  model?: string;
}

/**
 * AI Listing Launch Service
 * Orchestrates the complete listing content generation workflow
 */
export class ListingLaunchService {
  private listingId: string;
  private request: ListingLaunchRequest;
  private progress: ListingLaunchProgress;
  private onProgressUpdate?: (progress: ListingLaunchProgress) => void;

  constructor(request: ListingLaunchRequest, onProgressUpdate?: (progress: ListingLaunchProgress) => void) {
    this.listingId = `lst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.request = request;
    this.onProgressUpdate = onProgressUpdate;
    this.progress = this.initializeProgress();
  }

  private initializeProgress(): ListingLaunchProgress {
    const steps: ListingLaunchStep[] = [
      { id: 'intel', name: 'Property Intelligence', description: 'Gathering location data', status: 'pending', progress: 0 },
      { id: 'mls', name: 'MLS Description', description: 'Writing listing description', status: 'pending', progress: 0 },
      { id: 'features', name: 'Feature Highlights', description: 'Crafting feature bullets', status: 'pending', progress: 0 },
      { id: 'neighborhood', name: 'Neighborhood Brief', description: 'Creating area overview', status: 'pending', progress: 0 },
      { id: 'social', name: 'Social Media Posts', description: 'Generating social content', status: 'pending', progress: 0 },
      { id: 'email', name: 'Email Templates', description: 'Creating email campaigns', status: 'pending', progress: 0 },
      { id: 'seo', name: 'SEO & Keywords', description: 'Optimizing for search', status: 'pending', progress: 0 },
    ];

    return {
      listing_id: this.listingId,
      overall_progress: 0,
      current_step: 'intel',
      steps,
      estimated_completion: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      can_cancel: true,
    };
  }

  private updateStep(stepId: string, updates: Partial<ListingLaunchStep>) {
    const step = this.progress.steps.find(s => s.id === stepId);
    if (step) {
      Object.assign(step, updates);
      
      // Calculate overall progress
      const completedSteps = this.progress.steps.filter(s => s.status === 'completed').length;
      const inProgressStep = this.progress.steps.find(s => s.status === 'in_progress');
      const inProgressContribution = inProgressStep ? (inProgressStep.progress / 100) : 0;
      
      this.progress.overall_progress = Math.round(
        ((completedSteps + inProgressContribution) / this.progress.steps.length) * 100
      );
      this.progress.current_step = stepId;
      
      this.onProgressUpdate?.(this.progress);
    }
  }

  /**
   * Execute the full listing launch workflow
   */
  async launch(): Promise<ListingLaunchResult> {
    const startTime = Date.now();
    let totalTokens = 0;

    try {
      // Step 1: Gather Property Intelligence
      this.updateStep('intel', { status: 'in_progress', started_at: new Date().toISOString() });
      const intelligence = await this.gatherIntelligence();
      this.updateStep('intel', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      // Step 2: Generate MLS Description
      this.updateStep('mls', { status: 'in_progress', started_at: new Date().toISOString() });
      const mlsDescription = await this.generateMLSDescription(intelligence);
      totalTokens += mlsDescription.tokens_used;
      this.updateStep('mls', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      // Step 3: Generate Feature Highlights
      this.updateStep('features', { status: 'in_progress', started_at: new Date().toISOString() });
      const features = await this.generateFeatureHighlights();
      totalTokens += features.tokens_used;
      this.updateStep('features', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      // Step 4: Generate Neighborhood Brief
      this.updateStep('neighborhood', { status: 'in_progress', started_at: new Date().toISOString() });
      const neighborhood = await this.generateNeighborhoodBrief(intelligence);
      totalTokens += neighborhood.tokens_used;
      this.updateStep('neighborhood', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      // Step 5: Generate Social Media Posts
      this.updateStep('social', { status: 'in_progress', started_at: new Date().toISOString() });
      const socialPosts = await this.generateSocialPosts(mlsDescription.content);
      totalTokens += Object.values(socialPosts).reduce((sum, p) => sum + p.tokens_used, 0);
      this.updateStep('social', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      // Step 6: Generate Email Templates
      this.updateStep('email', { status: 'in_progress', started_at: new Date().toISOString() });
      const emailTemplates = await this.generateEmailTemplates(mlsDescription.content);
      totalTokens += Object.values(emailTemplates).reduce((sum, e) => sum + e.tokens_used, 0);
      this.updateStep('email', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      // Step 7: Generate SEO Keywords
      this.updateStep('seo', { status: 'in_progress', started_at: new Date().toISOString() });
      const { keywords, hashtags } = await this.generateSEOContent();
      this.updateStep('seo', { status: 'completed', progress: 100, completed_at: new Date().toISOString() });

      const result: ListingLaunchResult = {
        id: this.listingId,
        status: 'review',
        request: this.request,
        mls_description: mlsDescription,
        feature_highlights: features,
        neighborhood_brief: neighborhood,
        social_posts: socialPosts,
        email_templates: emailTemplates,
        property_intelligence: intelligence,
        seo_keywords: keywords,
        hashtags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_tokens_used: totalTokens,
        generation_time_ms: Date.now() - startTime,
        credits_used: Math.ceil(totalTokens / 1000), // 1 credit per 1000 tokens
      };

      return result;
    } catch (error) {
      const failedStep = this.progress.steps.find(s => s.status === 'in_progress');
      if (failedStep) {
        this.updateStep(failedStep.id, { 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      throw error;
    }
  }

  private async gatherIntelligence(): Promise<ListingLaunchResult['property_intelligence']> {
    try {
      const response = await fetch(
        `/api/property-intelligence/orchestrate?address=${encodeURIComponent(this.request.property_address)}`
      );
      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          flood_zone: data.data.environmental?.flood_zone?.value?.zone || 'Unknown',
          walk_score: data.data.location?.walkability?.value?.walk_score || 0,
          school_rating: data.data.location?.schools?.value?.[0]?.rating || 0,
        };
      }
    } catch (error) {
      console.error('Failed to gather property intelligence:', error);
    }
    
    return {
      flood_zone: 'Unknown',
      walk_score: 0,
      school_rating: 0,
    };
  }

  private async generateMLSDescription(intelligence: ListingLaunchResult['property_intelligence']): Promise<GeneratedContent> {
    const prompt = this.buildMLSPrompt(intelligence);
    return this.generateContent('description', 'MLS Description', prompt, 500);
  }

  private buildMLSPrompt(intelligence: ListingLaunchResult['property_intelligence']): string {
    const { request: r } = this;
    
    return `Write a compelling MLS listing description for this property:

PROPERTY DETAILS:
- Address: ${r.property_address}
- Type: ${r.property_type.replace('_', ' ')}
- Bedrooms: ${r.bedrooms} | Bathrooms: ${r.bathrooms}
- Square Feet: ${r.square_feet.toLocaleString()}
- Year Built: ${r.year_built || 'Not specified'}
- List Price: $${r.list_price.toLocaleString()}

${r.special_features?.length ? `SPECIAL FEATURES:\n${r.special_features.map(f => `- ${f}`).join('\n')}` : ''}

${r.recent_upgrades?.length ? `RECENT UPGRADES:\n${r.recent_upgrades.map(u => `- ${u}`).join('\n')}` : ''}

${r.neighborhood_highlights?.length ? `NEIGHBORHOOD:\n${r.neighborhood_highlights.map(h => `- ${h}`).join('\n')}` : ''}

LOCATION DATA:
- Walk Score: ${intelligence?.walk_score || 'N/A'}
- School Rating: ${intelligence?.school_rating || 'N/A'}/10
- Flood Zone: ${intelligence?.flood_zone || 'N/A'}

TARGET BUYERS: ${r.target_buyers?.join(', ') || 'General'}

REQUIREMENTS:
1. Write 250-400 words
2. Start with an attention-grabbing headline
3. Highlight the most compelling features first
4. Include lifestyle benefits, not just features
5. End with a call to action
6. Use professional real estate language
7. Be factual - don't exaggerate
8. Make it scannable with varied sentence lengths

Write the description now:`;
  }

  private async generateFeatureHighlights(): Promise<GeneratedContent> {
    const { request: r } = this;
    
    const prompt = `Create bullet-point feature highlights for this property:

Property: ${r.bedrooms}BR/${r.bathrooms}BA ${r.property_type.replace('_', ' ')}
Square Feet: ${r.square_feet.toLocaleString()}
Price: $${r.list_price.toLocaleString()}
${r.special_features?.length ? `Features: ${r.special_features.join(', ')}` : ''}
${r.recent_upgrades?.length ? `Upgrades: ${r.recent_upgrades.join(', ')}` : ''}

Create 8-12 compelling bullet points that:
1. Lead with benefits, not just features
2. Use action verbs
3. Include specific details when available
4. Mix practical features with lifestyle benefits
5. Keep each bullet under 15 words

Format as bullet points starting with •`;

    return this.generateContent('features', 'Feature Highlights', prompt, 300);
  }

  private async generateNeighborhoodBrief(intelligence: ListingLaunchResult['property_intelligence']): Promise<GeneratedContent> {
    const { request: r } = this;
    
    const prompt = `Write a neighborhood brief for a property at: ${r.property_address}

LOCATION DATA:
- Walk Score: ${intelligence?.walk_score || 'N/A'}
- School Rating: ${intelligence?.school_rating || 'N/A'}/10
${r.neighborhood_highlights?.length ? `HIGHLIGHTS:\n${r.neighborhood_highlights.map(h => `- ${h}`).join('\n')}` : ''}

Write 150-200 words covering:
1. Neighborhood character and vibe
2. Nearby amenities (shopping, dining, parks)
3. Schools and family-friendliness
4. Commute and transportation
5. What makes this location special

Be specific and paint a picture of daily life here:`;

    return this.generateContent('neighborhood', 'Neighborhood Brief', prompt, 250);
  }

  private async generateSocialPosts(mlsDescription: string): Promise<ListingLaunchResult['social_posts']> {
    const { request: r } = this;
    const baseInfo = `${r.bedrooms}BR/${r.bathrooms}BA in ${r.property_address.split(',')[1]?.trim() || 'great location'} - $${r.list_price.toLocaleString()}`;

    // Generate all social posts in parallel
    const [facebook, instagram, linkedin, twitter] = await Promise.all([
      this.generateContent('social', 'Facebook Post', 
        `Write a Facebook post for this listing:\n${baseInfo}\n\nMLS Description: ${mlsDescription.substring(0, 500)}...\n\nMake it engaging, include emojis, and end with a call to action. 200-300 words.`, 
        200
      ),
      this.generateContent('social', 'Instagram Caption',
        `Write an Instagram caption for this listing:\n${baseInfo}\n\nMake it visual and lifestyle-focused. Include relevant emojis and 10-15 hashtags. Under 2000 characters.`,
        200
      ),
      this.generateContent('social', 'LinkedIn Post',
        `Write a professional LinkedIn post for this listing:\n${baseInfo}\n\nFocus on investment value, market positioning, and professional networking. No emojis. 150-250 words.`,
        200
      ),
      this.generateContent('social', 'Twitter Post',
        `Write a Twitter/X post for this listing:\n${baseInfo}\n\nMust be under 280 characters including hashtags. Make it punchy and include 2-3 hashtags.`,
        50
      ),
    ]);

    return { facebook, instagram, linkedin, twitter };
  }

  private async generateEmailTemplates(mlsDescription: string): Promise<ListingLaunchResult['email_templates']> {
    const { request: r } = this;
    
    const [announcement, openHouse] = await Promise.all([
      this.generateContent('email', 'Announcement Email',
        `Write a new listing announcement email:

Property: ${r.bedrooms}BR/${r.bathrooms}BA at ${r.property_address}
Price: $${r.list_price.toLocaleString()}
Agent: ${r.agent_name} | ${r.agent_phone} | ${r.agent_email}

Include:
1. Compelling subject line (put on first line)
2. Brief intro
3. Key features
4. Call to action to schedule showing
5. Agent signature

Keep it professional but warm. 200-300 words.`,
        300
      ),
      this.generateContent('email', 'Open House Email',
        `Write an open house invitation email:

Property: ${r.property_address}
Price: $${r.list_price.toLocaleString()}
Agent: ${r.agent_name}

Include:
1. Attention-grabbing subject line (first line)
2. Open house date/time placeholder: [DATE] [TIME]
3. Property highlights
4. What to expect at the open house
5. RSVP call to action

Keep it exciting and inviting. 150-250 words.`,
        250
      ),
    ]);

    return { announcement, open_house: openHouse };
  }

  private async generateSEOContent(): Promise<{ keywords: string[]; hashtags: string[] }> {
    const { request: r } = this;
    
    const prompt = `Generate SEO keywords and hashtags for this property listing:

Property: ${r.bedrooms}BR/${r.bathrooms}BA ${r.property_type.replace('_', ' ')}
Location: ${r.property_address}
Price: $${r.list_price.toLocaleString()}
${r.special_features?.length ? `Features: ${r.special_features.join(', ')}` : ''}

Provide:
1. 15 SEO keywords (comma separated)
2. 20 hashtags (with # symbol)

Format:
KEYWORDS: keyword1, keyword2, keyword3...
HASHTAGS: #hashtag1 #hashtag2 #hashtag3...`;

    const result = await this.generateContent('social', 'SEO Content', prompt, 150);
    
    // Parse the response
    const lines = result.content.split('\n');
    let keywords: string[] = [];
    let hashtags: string[] = [];
    
    for (const line of lines) {
      if (line.toUpperCase().startsWith('KEYWORDS:')) {
        keywords = line.replace(/KEYWORDS:/i, '').split(',').map(k => k.trim()).filter(Boolean);
      }
      if (line.toUpperCase().startsWith('HASHTAGS:')) {
        hashtags = line.replace(/HASHTAGS:/i, '').match(/#\w+/g) || [];
      }
    }

    return { keywords, hashtags };
  }

  private async generateContent(
    type: ContentType,
    title: string,
    prompt: string,
    maxTokens: number
  ): Promise<GeneratedContent> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const content = data.content || data.text || '';
      
      return {
        type,
        title,
        content,
        character_count: content.length,
        word_count: content.split(/\s+/).filter(Boolean).length,
        generated_at: new Date().toISOString(),
        model_used: data.model || 'claude-3-sonnet',
        tokens_used: data.usage?.total_tokens || Math.ceil(content.length / 4),
      };
    } catch (error) {
      // Return a placeholder if generation fails
      return {
        type,
        title,
        content: `[${title} generation failed - please try again]`,
        character_count: 0,
        word_count: 0,
        generated_at: new Date().toISOString(),
        model_used: 'fallback',
        tokens_used: 0,
      };
    }
  }
}

/**
 * Quick helper to launch a listing
 */
export async function launchListing(
  request: ListingLaunchRequest,
  onProgress?: (progress: ListingLaunchProgress) => void
): Promise<ListingLaunchResult> {
  const service = new ListingLaunchService(request, onProgress);
  return service.launch();
}

export default ListingLaunchService;
