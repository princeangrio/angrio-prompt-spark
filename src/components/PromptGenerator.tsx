import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, ExternalLink, Copy, Brain, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedPrompt {
  id: string;
  finalCopy: string;
  imagePrompt: string;
  designNotes: string;
  postType: string;
}

const PromptGenerator = () => {
  const [model, setModel] = useState<string>('gpt-4o');
  const [content, setContent] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('3');
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const detectPostType = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('hiring') || lowerContent.includes('job') || lowerContent.includes('recruit')) return 'hiring';
    if (lowerContent.includes('stat') || lowerContent.includes('data') || lowerContent.includes('number')) return 'statistics';
    if (lowerContent.includes('awareness') || lowerContent.includes('education') || lowerContent.includes('tip')) return 'awareness';
    if (lowerContent.includes('motivation') || lowerContent.includes('inspire') || lowerContent.includes('quote')) return 'motivation';
    return 'general';
  };

  const generateAngrioPrompt = (content: string, index: number): GeneratedPrompt => {
    const postType = detectPostType(content);
    const variations = [
      { headline: 'Transform Your', subline: 'Join the Future' },
      { headline: 'Discover New', subline: 'Excellence Awaits' },
      { headline: 'Unlock Success', subline: 'Innovation Starts Here' }
    ];
    
    const variation = variations[index % variations.length];
    
    return {
      id: `prompt-${Date.now()}-${index}`,
      postType,
      finalCopy: `🎯 ${variation.headline} ${content.split(' ').slice(0, 3).join(' ')}

${content}

✨ ${variation.subline}
📞 Contact Angrio Technologies Today

#AngrioTech #Innovation #Technology`,
      
      imagePrompt: `Create a professional 1080x1080px social media post with paper texture background. Layout: Angrio Technologies logo in top-left corner. Main headline "${variation.headline}" in bold navy blue (#03224C) text, left-aligned in center area. Hero object (${postType === 'hiring' ? 'professional person or team' : postType === 'statistics' ? 'charts or graphs' : 'relevant icon/illustration'}) positioned on the right side. Color palette: Navy blue #03224C, bright orange #FF8828, clean white. Bottom features full-width orange bar with call-to-action text. Modern, clean design with professional typography. Include subtle shadows and depth.`,
      
      designNotes: `📐 DESIGN SPECIFICATIONS:
• Dimensions: 1080x1080px square format
• Background: Subtle paper texture in light gray/white
• Logo: Angrio Technologies top-left (120x40px)
• Typography: Inter or similar modern sans-serif
• Primary Text: Navy #03224C, bold, left-aligned
• Secondary Text: Dark gray #333333
• Accent Color: Orange #FF8828 for CTAs and highlights
• Hero Element: Right-side positioning, 40% width
• CTA Bar: Full-width orange background at bottom
• Spacing: 20px margins, 15px between elements
• Style: Professional, modern, clean lines`
    };
  };

  const handleGeneratePrompts = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter a post description to generate prompts.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prompts: GeneratedPrompt[] = [];
    for (let i = 0; i < parseInt(quantity); i++) {
      prompts.push(generateAngrioPrompt(content, i));
    }
    
    setGeneratedPrompts(prompts);
    setIsGenerating(false);
    
    toast({
      title: "Prompts Generated!",
      description: `Successfully created ${quantity} unique Angrio post prompts.`,
    });
  };

  const handleOpenInTabs = () => {
    generatedPrompts.forEach((prompt, index) => {
      const fullPrompt = `${prompt.finalCopy}\n\n${prompt.imagePrompt}\n\n${prompt.designNotes}`;
      const encodedPrompt = encodeURIComponent(fullPrompt);
      const chatUrl = model === 'gpt-4o' 
        ? `https://chat.openai.com/?model=gpt-4o&q=${encodedPrompt}`
        : `https://chat.openai.com/?model=gpt-3.5-turbo&q=${encodedPrompt}`;
      
      // Delay each tab opening to prevent browser blocking
      setTimeout(() => {
        window.open(chatUrl, `_blank_${index}`);
      }, index * 500);
    });

    toast({
      title: "Opening Prompts",
      description: `Opening ${generatedPrompts.length} tabs with your generated prompts.`,
    });
  };

  const copyAllPrompts = () => {
    const allPrompts = generatedPrompts.map((prompt, index) => 
      `=== PROMPT ${index + 1} ===\n\n1️⃣ FINAL COPY\n${prompt.finalCopy}\n\n2️⃣ IMAGE PROMPT\n${prompt.imagePrompt}\n\n3️⃣ DESIGN NOTES\n${prompt.designNotes}\n\n`
    ).join('\n');
    
    navigator.clipboard.writeText(allPrompts);
    toast({
      title: "Copied!",
      description: "All prompts copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            <span className="text-secondary">Angrio's</span> AI Graphic Designer
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate professional post design prompts with Angrio's brand guidelines
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Model Selection */}
            <Card className="bg-card shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Brain className="h-5 w-5 text-secondary" />
                  Select AI Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {model === 'gpt-4o' ? 'Advanced model for richer, more detailed prompts' : 'Faster model for quick prompt generation'}
                </p>
              </CardContent>
            </Card>

            {/* Content Input */}
            <Card className="bg-card shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Describe Your Post Idea or Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., Create a hiring post for a female telecaller position with competitive salary and growth opportunities..."
                  className="min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Auto-assigns Angrio layout, fonts, color palette, and post type
                </p>
              </CardContent>
            </Card>

            {/* Quantity & Generate */}
            <Card className="bg-card shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Generation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    How many creative prompts?
                  </label>
                  <Select value={quantity} onValueChange={setQuantity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} prompt{num > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGeneratePrompts}
                  disabled={isGenerating || !content.trim()}
                  className="w-full bg-gradient-secondary hover:bg-secondary/90 text-secondary-foreground shadow-button"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Generating Prompts...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Create Prompts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {generatedPrompts.length > 0 && (
              <>
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleOpenInTabs}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Tabs
                  </Button>
                  <Button 
                    onClick={copyAllPrompts}
                    variant="outline"
                    className="border-border hover:bg-muted"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </div>

                {/* Generated Prompts */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {generatedPrompts.map((prompt, index) => (
                    <Card key={prompt.id} className="bg-card shadow-card border-border">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-foreground">
                            Prompt {index + 1}
                          </CardTitle>
                          <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                            {prompt.postType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-secondary mb-2">1️⃣ FINAL COPY</h4>
                          <div className="bg-muted rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap">
                            {prompt.finalCopy}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-secondary mb-2">2️⃣ IMAGE PROMPT</h4>
                          <div className="bg-muted rounded-lg p-3 text-sm text-foreground">
                            {prompt.imagePrompt}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-secondary mb-2">3️⃣ DESIGN NOTES</h4>
                          <div className="bg-muted rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap">
                            {prompt.designNotes}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {generatedPrompts.length === 0 && (
              <Card className="bg-card shadow-card border-border">
                <CardContent className="text-center py-12">
                  <Wand2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-muted-foreground">
                    Enter your post description and click "Create Prompts" to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;