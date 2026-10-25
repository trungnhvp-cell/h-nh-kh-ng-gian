/**
 * Solid Geometry Types & Interfaces
 */

export interface Point3D {
  name: string;
  x: number;
  y: number;
  z: number;
  color?: string;
  isVirtual?: boolean; // Points created by extensions (e.g. E = AB ∩ CD)
}

export interface LineSegment3D {
  id: string;
  from: string;
  to: string;
  dashed?: boolean; // Hidden line in spatial drawing convention
  color?: string;
  highlighted?: boolean;
  label?: string;
  isExtended?: boolean; // Extended line for finding intersection
}

export interface Polygon3D {
  id: string;
  points: string[]; // Point names in order
  color?: string;
  opacity?: number;
  label?: string;
  highlighted?: boolean;
}

export interface GeometryModelData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  points: Point3D[];
  edges: LineSegment3D[];
  faces: Polygon3D[];
  auxiliaryLines?: LineSegment3D[];
  auxiliaryPlanes?: Polygon3D[];
  crossSectionPoints?: Point3D[];
  crossSectionPolygon?: string[];
  cameraPreset?: { x: number; y: number; z: number };
}

export interface AxiomItem {
  id: string;
  number: number;
  title: string;
  titleEn: string;
  statement: string;
  statementEn: string;
  explanation: string;
  explanationEn: string;
  keyRule: string;
  keyRuleEn: string;
  practicalApplication: string;
  practicalApplicationEn: string;
  modelData: GeometryModelData;
}

export interface ProblemStep {
  stepNumber: number;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  geometryReasoning: string;
  geometryReasoningEn: string;
  highlightElements: {
    points?: string[];
    edges?: string[];
    faces?: string[];
    showAuxiliary?: boolean;
    showCrossSection?: boolean;
  };
  cameraTarget?: { x: number; y: number; z: number };
}

export interface SolvedProblem {
  id: string;
  title: string;
  titleEn: string;
  category: 'intersection_line' | 'intersection_point' | 'cross_section' | 'collinear_points';
  categoryLabel: string;
  categoryLabelEn: string;
  difficulty: 'Cơ bản' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  difficultyEn: 'Basic' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  descriptionEn: string;
  modelData: GeometryModelData;
  steps: ProblemStep[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionEn: string;
  options: { key: string; text: string; textEn: string }[];
  correctKey: string;
  explanation: string;
  explanationEn: string;
  axiomRef?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
  modelId?: string;
}

export interface DiscussionReply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isTeacher?: boolean;
  isAi?: boolean;
}

export interface DiscussionPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  tags: string[];
  replies: DiscussionReply[];
}

export interface UserProgress {
  score: number;
  xp: number;
  streakDays: number;
  completedProblems: string[];
  completedAxioms: string[];
  quizScores: { [quizId: string]: boolean };
  gameHighScore: number;
  lastStudyDate: string;
  notes: { [key: string]: string };
}
