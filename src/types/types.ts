export  interface ContentBlock {
  block_type: 'heading' | 'paragraph' | 'code' | 'quote' | 'key_takeaway';
  text: string;
  level?: number;
}

export interface RedesignResponse {
  title: string;
  byline?: string;
  estimated_read_time: number;
  tldr: string;
  key_points: string[];
  sections: ContentBlock[];
}