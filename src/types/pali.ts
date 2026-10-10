export type ActiveTab =
  | 'pali-to-vi'
  | 'vi-to-pali'
  | 'sentence-pali-to-vi'
  | 'sentence-vi-to-pali'
  | 'grammar-handbook';

export interface RootAndType {
  root: string;
  base: string;
  wordType: string;
  genderOrClass?: string;
  etymologyNote?: string;
}

export interface CurrentMorphology {
  classification: string;
  paliTerm?: string;
  number: string;
  summary: string;
  alternativeForms?: string[];
}

export interface TableRow {
  caseOrPerson: string;
  singularForm: string;
  singularMeaning: string;
  pluralForm: string;
  pluralMeaning: string;
  isCurrentSingular?: boolean;
  isCurrentPlural?: boolean;
}

export interface TableData {
  title: string;
  paradigmType: string;
  rows: TableRow[];
}

export interface PaliWordAnalysisResult {
  analyzedWord: string;
  paliWord?: string; // For Vi-to-Pali
  vietnameseWord?: string;
  rootAndType: RootAndType;
  currentMorphology: CurrentMorphology;
  directMeaning?: string;
  markdownTable: string;
  tableData: TableData;
  formattedMarkdown: string;
  fourPointsFormattedMarkdown?: string;
}

export interface SentenceWordSyntax {
  word: string;
  vietnameseMeaning?: string;
  abbreviation: string;
  detailedAnalysis: string;
}

export interface SentencePaliToViResult {
  originalSentence: string;
  words: SentenceWordSyntax[];
  smoothTranslation: string;
  rawOutput: string;
}

export interface SentenceViToPaliResult {
  originalSentence: string;
  paliTranslation: string;
  grammarBreakdown: string;
  translationNotes?: string;
  rawOutput: string;
}

export type HubResult =
  | { mode: 'pali-to-vi'; data: PaliWordAnalysisResult }
  | { mode: 'vi-to-pali'; data: PaliWordAnalysisResult }
  | { mode: 'sentence-pali-to-vi'; data: SentencePaliToViResult }
  | { mode: 'sentence-vi-to-pali'; data: SentenceViToPaliResult };

export interface HistoryItem {
  id: string;
  mode: ActiveTab;
  query: string;
  summary: string;
  timestamp: number;
  bookmarked: boolean;
  result: HubResult;
}
