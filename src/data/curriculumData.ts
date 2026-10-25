import { AxiomItem, SolvedProblem, QuizQuestion, GeometryModelData } from '../types/geometry';

/**
 * 5 Fundamental Axioms of Solid Geometry
 */
export const AXIOMS_DATA: AxiomItem[] = [
  {
    id: 'axiom-1',
    number: 1,
    title: 'Tiên đề 1: Sự tồn tại và duy nhất của đường thẳng',
    titleEn: 'Axiom 1: Existence and Uniqueness of a Line',
    statement: 'Có một và chỉ một đường thẳng đi qua hai điểm phân biệt.',
    statementEn: 'There is one and only one line passing through two distinct points.',
    explanation: 'Nếu cho hai điểm phân biệt A và B trong không gian, ta luôn xác định được một đường thẳng duy nhất đi qua A và B, kí hiệu là đường thẳng AB.',
    explanationEn: 'Given two distinct points A and B in space, exactly one straight line passes through them, denoted as line AB.',
    keyRule: 'Kí hiệu: Đường thẳng AB hoặc (AB). Hai điểm phân biệt xác định duy nhất 1 đường thẳng.',
    keyRuleEn: 'Notation: Line AB. Any two distinct points uniquely define a line.',
    practicalApplication: 'Dùng làm nền tảng xác định cạnh của hình đa diện và kéo dài hai điểm để tìm giao điểm.',
    practicalApplicationEn: 'Serves as the foundation to define polygon edges and extend lines to find intersections.',
    modelData: {
      id: 'model-axiom-1',
      title: 'Minh họa Tiên đề 1: Hai điểm A và B xác định duy nhất đường thẳng d',
      titleEn: 'Illustration of Axiom 1: Points A and B determine unique line d',
      description: 'Hai điểm đỏ A và B xác định duy nhất một đường thẳng kéo dài vô tận trong không gian.',
      descriptionEn: 'Points A and B uniquely determine a line extended infinitely in space.',
      points: [
        { name: 'A', x: -2, y: 0, z: -1, color: '#ef4444' },
        { name: 'B', x: 2, y: 1.5, z: 1.5, color: '#3b82f6' },
      ],
      edges: [
        { id: 'ab-extended-left', from: 'A', to: 'B', color: '#10b981', label: 'd (AB)' },
      ],
      faces: [],
      cameraPreset: { x: 5, y: 4, z: 6 }
    }
  },
  {
    id: 'axiom-2',
    number: 2,
    title: 'Tiên đề 2: Sự tồn tại và duy nhất của mặt phẳng',
    titleEn: 'Axiom 2: Existence and Uniqueness of a Plane',
    statement: 'Có một và chỉ một mặt phẳng đi qua ba điểm không thẳng hàng.',
    statementEn: 'There is one and only one plane passing through three non-collinear points.',
    explanation: 'Nếu có 3 điểm A, B, C không cùng nằm trên một đường thẳng thì có một và chỉ một mặt phẳng đi qua cả 3 điểm đó, kí hiệu là mặt phẳng (ABC).',
    explanationEn: 'Given three points A, B, and C that do not lie on the same straight line, exactly one plane passes through them, denoted as plane (ABC).',
    keyRule: 'Kí hiệu: mp(ABC) hoặc (ABC). 3 điểm không thẳng hàng tạo thành tam giác và xác định một mặt phẳng duy nhất.',
    keyRuleEn: 'Notation: Plane (ABC). Three non-collinear points form a triangle and uniquely fix a plane.',
    practicalApplication: 'Chân kiềng 3 chân luôn đứng vững trên mọi mặt sàn vì 3 đầu chân tạo thành 1 mặt phẳng duy nhất.',
    practicalApplicationEn: 'A 3-legged tripod never wobbles on uneven ground because 3 points define an exact plane.',
    modelData: {
      id: 'model-axiom-2',
      title: 'Minh họa Tiên đề 2: Ba điểm A, B, C xác định mặt phẳng (ABC)',
      titleEn: 'Illustration of Axiom 2: Three points A, B, C determine plane (ABC)',
      description: 'Ba điểm A, B, C không thẳng hàng tạo thành một mặt phẳng không gian trong suốt.',
      descriptionEn: 'Three non-collinear points A, B, C define a unique transparent 3D plane.',
      points: [
        { name: 'A', x: -2, y: 0, z: -1.5, color: '#ef4444' },
        { name: 'B', x: 2, y: 0.5, z: -1, color: '#3b82f6' },
        { name: 'C', x: 0, y: 1.8, z: 2, color: '#8b5cf6' },
      ],
      edges: [
        { id: 'ab', from: 'A', to: 'B', color: '#64748b' },
        { id: 'bc', from: 'B', to: 'C', color: '#64748b' },
        { id: 'ca', from: 'C', to: 'A', color: '#64748b' },
      ],
      faces: [
        { id: 'plane-abc', points: ['A', 'B', 'C'], color: '#3b82f6', opacity: 0.35, label: '(ABC)' }
      ],
      cameraPreset: { x: 5, y: 5, z: 6 }
    }
  },
  {
    id: 'axiom-3',
    number: 3,
    title: 'Tiên đề 3: Đường thẳng nằm trong mặt phẳng',
    titleEn: 'Axiom 3: Line Lying in a Plane',
    statement: 'Nếu một đường thẳng có hai điểm phân biệt thuộc một mặt phẳng thì mọi điểm của đường thẳng đều thuộc mặt phẳng đó.',
    statementEn: 'If a line has two distinct points belonging to a plane, then every point of the line belongs to that plane.',
    explanation: 'Khi đường thẳng d có hai điểm phân biệt A, B thuộc mp(P), ta nói d nằm trong (P) hay (P) chứa d, kí hiệu: d ⊂ (P) hoặc (P) ⊃ d.',
    explanationEn: 'When line d has two distinct points A, B belonging to plane (P), line d lies entirely inside (P), denoted as d ⊂ (P).',
    keyRule: 'd có 2 điểm phân biệt thuộc (P) ⟹ d ⊂ (P). Điểm M bất kì trên d đều có M ∈ (P).',
    keyRuleEn: 'If line d has 2 distinct points in (P) ⟹ d ⊂ (P). Any point on d also belongs to (P).',
    practicalApplication: 'Dùng để kiểm tra mặt bàn phẳng bằng cách đặt thước thẳng lên: nếu mép thước tiếp xúc tại 2 điểm mà khít toàn bộ thì mặt bàn phẳng.',
    practicalApplicationEn: 'Used to check flat surfaces with a straightedge ruler touching two points.',
    modelData: {
      id: 'model-axiom-3',
      title: 'Minh họa Tiên đề 3: Đường thẳng d nằm trọn trong mặt phẳng (P)',
      titleEn: 'Illustration of Axiom 3: Line d lies entirely in plane (P)',
      description: 'Đường thẳng d đi qua hai điểm A, B thuộc mặt phẳng (P) nên d nằm hoàn toàn trong (P). Điểm M trên d cũng nằm trong (P).',
      descriptionEn: 'Line d passes through points A, B in plane (P), so line d and any point M on it lie in (P).',
      points: [
        { name: 'A', x: -1.5, y: 0.5, z: -0.5, color: '#ef4444' },
        { name: 'B', x: 1.5, y: 0.5, z: 0.5, color: '#3b82f6' },
        { name: 'M', x: 0, y: 0.5, z: 0, color: '#f59e0b' },
        { name: 'P1', x: -3, y: 0.5, z: -2, color: '#94a3b8' },
        { name: 'P2', x: 3, y: 0.5, z: -2, color: '#94a3b8' },
        { name: 'P3', x: 3, y: 0.5, z: 2, color: '#94a3b8' },
        { name: 'P4', x: -3, y: 0.5, z: 2, color: '#94a3b8' },
      ],
      edges: [
        { id: 'line-d', from: 'A', to: 'B', color: '#10b981', label: 'd ⊂ (P)' },
        { id: 'p12', from: 'P1', to: 'P2', color: '#475569' },
        { id: 'p23', from: 'P2', to: 'P3', color: '#475569' },
        { id: 'p34', from: 'P3', to: 'P4', color: '#475569' },
        { id: 'p41', from: 'P4', to: 'P1', color: '#475569' },
      ],
      faces: [
        { id: 'plane-p', points: ['P1', 'P2', 'P3', 'P4'], color: '#6366f1', opacity: 0.3, label: 'Mặt phẳng (P)' }
      ],
      cameraPreset: { x: 5, y: 5, z: 5 }
    }
  },
  {
    id: 'axiom-4',
    number: 4,
    title: 'Tiên đề 4: Giao tuyến của hai mặt phẳng',
    titleEn: 'Axiom 4: Intersection Line of Two Planes',
    statement: 'Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có một đường thẳng chung duy nhất chứa tất cả các điểm chung của hai mặt phẳng đó.',
    statementEn: 'If two distinct planes share a point, they share a unique straight line containing all their common points.',
    explanation: 'Đường thẳng chung duy nhất này gọi là giao tuyến của hai mặt phẳng, kí hiệu d = (P) ∩ (Q). Để tìm giao tuyến, ta chỉ cần tìm 2 điểm chung phân biệt!',
    explanationEn: 'This common line is called the line of intersection, denoted d = (P) ∩ (Q). To find the intersection line, find 2 distinct common points.',
    keyRule: 'A ∈ (P) ∩ (Q) và B ∈ (P) ∩ (Q) với A ≠ B ⟹ (P) ∩ (Q) = AB.',
    keyRuleEn: 'If A and B are 2 distinct points in both (P) and (Q) ⟹ (P) ∩ (Q) = AB.',
    practicalApplication: 'Là cốt lõi của 90% bài toán hình học không gian 11: Tìm giao tuyến, tìm thiết diện, chứng minh đồng quy.',
    practicalApplicationEn: 'The core theorem for finding intersection lines, cross sections, and concurrence in 3D.',
    modelData: {
      id: 'model-axiom-4',
      title: 'Minh họa Tiên đề 4: Giao tuyến d của hai mặt phẳng cắt nhau (P) và (Q)',
      titleEn: 'Illustration of Axiom 4: Intersection line d of intersecting planes (P) and (Q)',
      description: 'Hai mặt phẳng (P) và (Q) cắt nhau theo đường thẳng d = AB màu vàng rực rỡ.',
      descriptionEn: 'Two intersecting planes (P) and (Q) meet along the common line d = AB.',
      points: [
        { name: 'A', x: 0, y: -1.2, z: -1.5, color: '#ef4444' },
        { name: 'B', x: 0, y: 1.2, z: 1.5, color: '#ef4444' },
        { name: 'P_left', x: -2.8, y: -0.5, z: 0, color: '#3b82f6' },
        { name: 'Q_right', x: 2.8, y: 0.5, z: 0, color: '#10b981' },
      ],
      edges: [
        { id: 'intersection-ab', from: 'A', to: 'B', color: '#f59e0b', label: 'd = (P) ∩ (Q)', highlighted: true },
      ],
      faces: [
        { id: 'plane-p', points: ['A', 'P_left', 'B'], color: '#3b82f6', opacity: 0.35, label: '(P)' },
        { id: 'plane-q', points: ['A', 'Q_right', 'B'], color: '#10b981', opacity: 0.35, label: '(Q)' }
      ],
      cameraPreset: { x: 5, y: 4, z: 6 }
    }
  },
  {
    id: 'axiom-5',
    number: 5,
    title: 'Tiên đề 5: Tính nhất quán của hình học phẳng trên mỗi mặt phẳng',
    titleEn: 'Axiom 5: Consistency of Plane Geometry on Each Plane',
    statement: 'Trên mỗi mặt phẳng, các kết quả đã biết trong hình học phẳng đều đúng.',
    statementEn: 'On each plane, all established Euclidean plane geometry theorems remain valid.',
    explanation: 'Trong bất kì mặt phẳng nào của không gian, định lý Ta-lét, định lý Pythagoras, tính chất đường trung bình, tam giác đồng dạng, đường tròn... đều áp dụng chính xác như trong hình học phẳng.',
    explanationEn: 'Within any plane in space, Thales theorem, Pythagorean theorem, midlines, and trigonometry hold true exactly as in 2D geometry.',
    keyRule: 'Khi quy về một mặt phẳng cụ thể, ta sử dụng toàn bộ công cụ hình học phẳng lớp 8, 9.',
    keyRuleEn: 'Once reduced to a specific single plane, all 2D Euclidean geometry theorems apply directly.',
    practicalApplication: 'Dùng tỉ số Ta-lét, trung điểm để tính tỉ số thể tích, chứng minh song song và tính độ dài cạnh thiết diện.',
    practicalApplicationEn: 'Used to apply ratios, midpoints, and compute cross-sectional edge lengths.',
    modelData: {
      id: 'model-axiom-5',
      title: 'Minh họa Tiên đề 5: Định lý hình học phẳng trên mặt phẳng nghiêng',
      titleEn: 'Illustration of Axiom 5: Plane geometry on an inclined space plane',
      description: 'Tam giác vuông ABC với định lý Pythagoras và đường trung bình MN trên mặt phẳng không gian.',
      descriptionEn: 'Right triangle with midline on a space plane obeying plane theorems.',
      points: [
        { name: 'A', x: -1.5, y: 1.5, z: 0, color: '#ef4444' },
        { name: 'B', x: -1.5, y: -1.2, z: 0, color: '#3b82f6' },
        { name: 'C', x: 2, y: -1.2, z: 0, color: '#8b5cf6' },
        { name: 'M', x: -1.5, y: 0.15, z: 0, color: '#f59e0b' },
        { name: 'N', x: 0.25, y: 0.15, z: 0, color: '#f59e0b' },
      ],
      edges: [
        { id: 'ab', from: 'A', to: 'B', color: '#64748b' },
        { id: 'bc', from: 'B', to: 'C', color: '#64748b' },
        { id: 'ca', from: 'C', to: 'A', color: '#64748b' },
        { id: 'mn', from: 'M', to: 'N', color: '#10b981', label: 'MN // BC' },
      ],
      faces: [
        { id: 'plane-triangle', points: ['A', 'B', 'C'], color: '#06b6d4', opacity: 0.35, label: '(ABC)' }
      ],
      cameraPreset: { x: 4, y: 4, z: 5 }
    }
  }
];

/**
 * 3 Classic Methods to Determine a Plane (Ba cách xác định mặt phẳng)
 */
export const PLANE_DETERMINATION_METHODS = [
  {
    id: 'method-1',
    title: 'Cách 1: Qua 3 điểm không thẳng hàng',
    titleEn: 'Method 1: Three Non-Collinear Points',
    formula: 'mp(A, B, C) hoặc (ABC)',
    condition: 'A, B, C không cùng thuộc một đường thẳng',
    description: 'Chỉ có đúng một mặt phẳng đi qua ba điểm phân biệt không thẳng hàng.'
  },
  {
    id: 'method-2',
    title: 'Cách 2: Qua 1 điểm và 1 đường thẳng không chứa điểm đó',
    titleEn: 'Method 2: A Point and a Line Not Containing It',
    formula: 'mp(M, d) hoặc (M, d)',
    condition: 'M ∉ d',
    description: 'Lấy hai điểm phân biệt A, B trên d. Ba điểm M, A, B không thẳng hàng xác định duy nhất mp(M, A, B).'
  },
  {
    id: 'method-3',
    title: 'Cách 3: Qua 2 đường thẳng cắt nhau (hoặc song song)',
    titleEn: 'Method 3: Two Intersecting (or Parallel) Lines',
    formula: 'mp(a, b) hoặc (a, b)',
    condition: 'a ∩ b = {I} (hoặc a // b)',
    description: 'Hai đường thẳng cắt nhau tại I xác định một mặt phẳng duy nhất chứa cả hai đường thẳng đó.'
  }
];

/**
 * Step-by-Step Solved Problems with 3D Models
 */
export const SOLVED_PROBLEMS_DATA: SolvedProblem[] = [
  {
    id: 'prob-1',
    title: 'Tìm giao tuyến của hai mặt phẳng (SAB) và (SCD) trong hình chóp S.ABCD',
    titleEn: 'Find the Intersection Line of Planes (SAB) and (SCD) in Pyramid S.ABCD',
    category: 'intersection_line',
    categoryLabel: 'Tìm giao tuyến 2 mặt phẳng',
    categoryLabelEn: 'Plane-Plane Intersection',
    difficulty: 'Cơ bản',
    difficultyEn: 'Basic',
    description: 'Cho hình chóp S.ABCD có đáy ABCD là hình thang với đáy lớn AB và đáy nhỏ CD không song song (AB và CD cắt nhau tại E). Hãy tìm giao tuyến của mặt phẳng (SAB) và mặt phẳng (SCD).',
    descriptionEn: 'Given pyramid S.ABCD whose base ABCD is a trapezoid where AB and CD intersect at E. Find the intersection line of planes (SAB) and (SCD).',
    modelData: {
      id: 'model-pyramid-sab-scd',
      title: 'Mô hình 3D Hình chóp S.ABCD đáy hình thang',
      titleEn: '3D Pyramid S.ABCD with Trapezoid Base',
      description: 'Hình chóp S.ABCD với đáy ABCD (AB kéo dài cắt CD tại E). Giao tuyến cần tìm là đường thẳng SE.',
      descriptionEn: 'Pyramid S.ABCD with extended base lines AB and CD meeting at E. The intersection line is SE.',
      points: [
        { name: 'S', x: 0, y: 3.2, z: 0, color: '#f59e0b' },
        { name: 'A', x: -2.5, y: 0, z: -1.5, color: '#3b82f6' },
        { name: 'B', x: 2.2, y: 0, z: -1.2, color: '#3b82f6' },
        { name: 'C', x: 1.0, y: 0, z: 1.6, color: '#3b82f6' },
        { name: 'D', x: -1.4, y: 0, z: 1.3, color: '#3b82f6' },
        { name: 'E', x: 4.8, y: 0, z: -0.9, color: '#ef4444', isVirtual: true }
      ],
      edges: [
        // Base edges
        { id: 'ab', from: 'A', to: 'B', color: '#94a3b8' },
        { id: 'bc', from: 'B', to: 'C', color: '#94a3b8' },
        { id: 'cd', from: 'C', to: 'D', color: '#94a3b8' },
        { id: 'da', from: 'D', to: 'A', dashed: true, color: '#64748b' },
        // Lateral edges
        { id: 'sa', from: 'S', to: 'A', dashed: true, color: '#64748b' },
        { id: 'sb', from: 'S', to: 'B', color: '#94a3b8' },
        { id: 'sc', from: 'S', to: 'C', color: '#94a3b8' },
        { id: 'sd', from: 'S', to: 'D', color: '#94a3b8' },
      ],
      auxiliaryLines: [
        { id: 'be-ext', from: 'B', to: 'E', color: '#ef4444', isExtended: true, dashed: true },
        { id: 'ce-ext', from: 'C', to: 'E', color: '#ef4444', isExtended: true, dashed: true },
        { id: 'se-line', from: 'S', to: 'E', color: '#10b981', highlighted: true, label: 'd = SE' }
      ],
      faces: [
        { id: 'base-face', points: ['A', 'B', 'C', 'D'], color: '#334155', opacity: 0.25 },
        { id: 'sab-face', points: ['S', 'A', 'B'], color: '#3b82f6', opacity: 0.2 },
        { id: 'scd-face', points: ['S', 'C', 'D'], color: '#f59e0b', opacity: 0.2 }
      ],
      cameraPreset: { x: 7, y: 5, z: 7 }
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Tìm điểm chung thứ nhất',
        titleEn: 'Step 1: Identify the First Common Point',
        content: 'Quan sát tên hai mặt phẳng (SAB) và (SCD), ta thấy ngay cả hai mặt phẳng đều chứa đỉnh S.',
        contentEn: 'Looking at planes (SAB) and (SCD), both clearly contain the vertex S.',
        geometryReasoning: 'S ∈ (SAB) và S ∈ (SCD) ⟹ S là một điểm chung của hai mặt phẳng (SAB) và (SCD).',
        geometryReasoningEn: 'S ∈ (SAB) and S ∈ (SCD) ⟹ S is a common point of planes (SAB) and (SCD).',
        highlightElements: {
          points: ['S'],
          faces: ['sab-face', 'scd-face'],
          showAuxiliary: false
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Tìm điểm chung thứ hai trong mặt phẳng đáy',
        titleEn: 'Step 2: Find the Second Common Point in the Base Plane',
        content: 'Trong mặt phẳng đáy (ABCD), đường thẳng AB thuộc (SAB) và đường thẳng CD thuộc (SCD). Vì tứ giác ABCD có AB và CD không song song, ta kéo dài AB và CD cắt nhau tại một điểm E.',
        contentEn: 'In base plane (ABCD), line AB lies in (SAB) and line CD lies in (SCD). Since they are non-parallel, extend AB and CD to intersect at point E.',
        geometryReasoning: 'Trong mp(ABCD): Gọi E = AB ∩ CD (hai đường thẳng đồng phẳng không song song luôn cắt nhau).',
        geometryReasoningEn: 'In plane (ABCD): Let E = AB ∩ CD (two non-parallel coplanar lines must intersect).',
        highlightElements: {
          points: ['E', 'A', 'B', 'C', 'D'],
          edges: ['ab', 'cd'],
          showAuxiliary: true
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Chứng minh điểm E thuộc cả hai mặt phẳng',
        titleEn: 'Step 3: Prove Point E Belongs to Both Planes',
        content: 'Theo Tiên đề 3: Vì E thuộc đường thẳng AB mà AB ⊂ (SAB), nên E ∈ (SAB). Tương tự, E thuộc CD mà CD ⊂ (SCD), nên E ∈ (SCD).',
        contentEn: 'By Axiom 3: Since E ∈ AB and AB ⊂ (SAB), we have E ∈ (SAB). Similarly, E ∈ CD and CD ⊂ (SCD), so E ∈ (SCD).',
        geometryReasoning: 'E ∈ AB ⊂ (SAB) ⟹ E ∈ (SAB). Đồng thời E ∈ CD ⊂ (SCD) ⟹ E ∈ (SCD). Do đó E là điểm chung thứ hai.',
        geometryReasoningEn: 'E ∈ AB ⊂ (SAB) ⟹ E ∈ (SAB) and E ∈ CD ⊂ (SCD) ⟹ E ∈ (SCD). Thus E is the 2nd common point.',
        highlightElements: {
          points: ['S', 'E'],
          showAuxiliary: true
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Kết luận giao tuyến theo Tiên đề 4',
        titleEn: 'Step 4: Conclude the Intersection Line via Axiom 4',
        content: 'Hai mặt phẳng phân biệt (SAB) và (SCD) có hai điểm chung phân biệt S và E. Theo Tiên đề 4, đường thẳng SE chính là giao tuyến duy nhất cần tìm.',
        contentEn: 'Planes (SAB) and (SCD) share distinct points S and E. By Axiom 4, line SE is their unique intersection line.',
        geometryReasoning: 'Kết luận: (SAB) ∩ (SCD) = SE (đường màu xanh ngọc hiển thị trên mô hình 3D).',
        geometryReasoningEn: 'Conclusion: (SAB) ∩ (SCD) = SE (highlighted in emerald green in the 3D model).',
        highlightElements: {
          points: ['S', 'E'],
          edges: ['se-line'],
          showAuxiliary: true
        }
      }
    ]
  },
  {
    id: 'prob-2',
    title: 'Tìm giao điểm của đường thẳng và mặt phẳng: Đường thẳng d và mp(SBD)',
    titleEn: 'Find the Intersection of a Line and a Plane: Line AM and Plane (SBD)',
    category: 'intersection_point',
    categoryLabel: 'Tìm giao điểm đường & mặt',
    categoryLabelEn: 'Line-Plane Intersection',
    difficulty: 'Thông hiểu',
    difficultyEn: 'Intermediate',
    description: 'Cho hình chóp S.ABCD có đáy là hình bình hành tâm O. Lấy điểm M là trung điểm của cạnh SC. Tìm giao điểm của đường thẳng AM và mặt phẳng (SBD).',
    descriptionEn: 'Given pyramid S.ABCD with parallelogram base centered at O. Let M be the midpoint of SC. Find the intersection of line AM with plane (SBD).',
    modelData: {
      id: 'model-line-plane-intersection',
      title: 'Mô hình 3D Giao điểm AM ∩ (SBD) = I',
      titleEn: '3D Model: Intersection AM ∩ (SBD) = I',
      description: 'Đường thẳng AM xuyên qua mặt phẳng chéo (SBD) tại giao điểm I, chính là trọng tâm tam giác SAC.',
      descriptionEn: 'Line AM intersects diagonal plane (SBD) at point I (centroid of triangle SAC).',
      points: [
        { name: 'S', x: 0, y: 3.2, z: 0, color: '#f59e0b' },
        { name: 'A', x: -2.2, y: 0, z: -1.4, color: '#3b82f6' },
        { name: 'B', x: 1.8, y: 0, z: -1.4, color: '#3b82f6' },
        { name: 'C', x: 2.2, y: 0, z: 1.4, color: '#3b82f6' },
        { name: 'D', x: -1.8, y: 0, z: 1.4, color: '#3b82f6' },
        { name: 'O', x: 0, y: 0, z: 0, color: '#94a3b8' },
        { name: 'M', x: 1.1, y: 1.6, z: 0.7, color: '#ec4899' },
        { name: 'I', x: -0.37, y: 1.07, z: -0.23, color: '#10b981', isVirtual: true }
      ],
      edges: [
        { id: 'ab', from: 'A', to: 'B', color: '#94a3b8' },
        { id: 'bc', from: 'B', to: 'C', color: '#94a3b8' },
        { id: 'cd', from: 'C', to: 'D', color: '#94a3b8' },
        { id: 'da', from: 'D', to: 'A', dashed: true, color: '#64748b' },
        { id: 'sa', from: 'S', to: 'A', dashed: true, color: '#64748b' },
        { id: 'sb', from: 'S', to: 'B', color: '#94a3b8' },
        { id: 'sc', from: 'S', to: 'C', color: '#94a3b8' },
        { id: 'sd', from: 'S', to: 'D', color: '#94a3b8' },
        { id: 'ac', from: 'A', to: 'C', dashed: true, color: '#64748b' },
        { id: 'bd', from: 'B', to: 'D', dashed: true, color: '#64748b' },
        { id: 'so', from: 'S', to: 'O', dashed: true, color: '#f59e0b', label: 'SO' },
        { id: 'am', from: 'A', to: 'M', dashed: true, color: '#ec4899', label: 'AM' }
      ],
      faces: [
        { id: 'sbd-face', points: ['S', 'B', 'D'], color: '#8b5cf6', opacity: 0.35, label: '(SBD)' },
        { id: 'sac-face', points: ['S', 'A', 'C'], color: '#06b6d4', opacity: 0.2, label: 'mp phụ (SAC)' }
      ],
      cameraPreset: { x: 6, y: 4, z: 6 }
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Chọn mặt phẳng phụ chứa đường thẳng AM',
        titleEn: 'Step 1: Choose an Auxiliary Plane Containing Line AM',
        content: 'Ta tìm một mặt phẳng dễ thấy nhất chứa đường thẳng AM và dễ tìm giao tuyến với (SBD). Vì A ∈ (ABCD) và M ∈ SC ⟹ chọn mặt phẳng phụ là (SAC).',
        contentEn: 'Find an auxiliary plane containing AM. Since A and M both lie in plane (SAC), choose (SAC) as auxiliary plane.',
        geometryReasoning: 'AM ⊂ (SAC) vì A ∈ (SAC) và M ∈ SC ⊂ (SAC).',
        geometryReasoningEn: 'AM ⊂ (SAC) since A ∈ (SAC) and M ∈ SC ⊂ (SAC).',
        highlightElements: {
          points: ['A', 'M', 'S', 'C'],
          edges: ['am'],
          faces: ['sac-face'],
          showAuxiliary: true
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Tìm giao tuyến giữa mp phụ (SAC) và (SBD)',
        titleEn: 'Step 2: Find Intersection Line of (SAC) and (SBD)',
        content: 'Hai mặt phẳng (SAC) và (SBD) có điểm chung thứ nhất là đỉnh S. Điểm chung thứ hai là tâm O = AC ∩ BD của đáy hình bình hành.',
        contentEn: 'Planes (SAC) and (SBD) share vertex S. The second point is center O = AC ∩ BD of the parallelogram base.',
        geometryReasoning: 'S là điểm chung thứ nhất. O = AC ∩ BD ⟹ O ∈ AC ⊂ (SAC) và O ∈ BD ⊂ (SBD). Suy ra (SAC) ∩ (SBD) = SO.',
        geometryReasoningEn: 'S is common point 1. O = AC ∩ BD ⟹ O is common point 2. Thus (SAC) ∩ (SBD) = SO.',
        highlightElements: {
          points: ['S', 'O'],
          edges: ['so'],
          faces: ['sbd-face', 'sac-face']
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Trong mp(SAC), tìm giao điểm của AM và SO',
        titleEn: 'Step 3: In Plane (SAC), Intersect AM and SO',
        content: 'Vì AM và SO cùng nằm trong mặt phẳng (SAC) và không song song, chúng cắt nhau tại điểm I.',
        contentEn: 'Since AM and SO both lie in plane (SAC) and are not parallel, they intersect at point I.',
        geometryReasoning: 'Trong mp(SAC): Gọi I = AM ∩ SO. Điểm I chính là trọng tâm của tam giác SAC (giao điểm 2 đường trung tuyến SO và AM).',
        geometryReasoningEn: 'In plane (SAC): Let I = AM ∩ SO. I is the centroid of triangle SAC.',
        highlightElements: {
          points: ['I', 'A', 'M', 'S', 'O'],
          edges: ['am', 'so']
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Kết luận giao điểm',
        titleEn: 'Step 4: Conclude the Intersection Point',
        content: 'Vì I ∈ SO mà SO ⊂ (SBD), nên I ∈ (SBD). Mặt khác I ∈ AM. Vậy I chính là giao điểm của AM và (SBD).',
        contentEn: 'Because I ∈ SO and SO ⊂ (SBD), I ∈ (SBD). Furthermore I ∈ AM. Thus I = AM ∩ (SBD).',
        geometryReasoning: 'Kết luận: I = AM ∩ (SBD), với tỉ số SI/SO = 2/3.',
        geometryReasoningEn: 'Conclusion: I = AM ∩ (SBD), with ratio SI/SO = 2/3.',
        highlightElements: {
          points: ['I'],
          edges: ['am', 'so'],
          faces: ['sbd-face']
        }
      }
    ]
  },
  {
    id: 'prob-3',
    title: 'Tìm thiết diện của hình tứ diện ABCD cắt bởi mặt phẳng (MNP)',
    titleEn: 'Find the Cross-Section of Tetrahedron ABCD Cut by Plane (MNP)',
    category: 'cross_section',
    categoryLabel: 'Tìm thiết diện (Cross Section)',
    categoryLabelEn: 'Cross Section of Solids',
    difficulty: 'Vận dụng',
    difficultyEn: 'Advanced',
    description: 'Cho tứ diện ABCD. Lấy điểm M trên cạnh AB, điểm N trên cạnh AC (sao cho MN không song song với BC), điểm P trên cạnh BD. Hãy xác định thiết diện của tứ diện ABCD khi cắt bởi mặt phẳng (MNP).',
    descriptionEn: 'Given tetrahedron ABCD. M lies on AB, N on AC (MN not parallel to BC), and P on BD. Find the cross-section of ABCD cut by plane (MNP).',
    modelData: {
      id: 'model-tetrahedron-cross-section',
      title: 'Mô hình 3D Thiết diện Tứ giác MNPQ',
      titleEn: '3D Cross-Section: Quadrilateral MNPQ',
      description: 'Mặt phẳng (MNP) mở rộng cắt các mặt của tứ diện ABCD tạo thành thiết diện là tứ giác MNPQ tô màu xanh.',
      descriptionEn: 'Plane (MNP) expands across faces of tetrahedron ABCD forming cross-section quadrilateral MNPQ.',
      points: [
        { name: 'A', x: 0, y: 3.0, z: 0, color: '#f59e0b' },
        { name: 'B', x: -2.2, y: 0, z: -1.2, color: '#3b82f6' },
        { name: 'C', x: 2.2, y: 0, z: -1.2, color: '#3b82f6' },
        { name: 'D', x: 0, y: 0, z: 2.0, color: '#3b82f6' },
        { name: 'M', x: -1.1, y: 1.5, z: -0.6, color: '#ec4899' },
        { name: 'N', x: 0.66, y: 2.1, z: -0.36, color: '#ec4899' },
        { name: 'P', x: -1.1, y: 0, z: 0.4, color: '#ec4899' },
        { name: 'I', x: 4.8, y: 0, z: -1.2, color: '#ef4444', isVirtual: true },
        { name: 'Q', x: 0.85, y: 0, z: 1.35, color: '#10b981', isVirtual: true }
      ],
      edges: [
        { id: 'ab', from: 'A', to: 'B', color: '#94a3b8' },
        { id: 'bc', from: 'B', to: 'C', dashed: true, color: '#64748b' },
        { id: 'ca', from: 'A', to: 'C', color: '#94a3b8' },
        { id: 'ad', from: 'A', to: 'D', color: '#94a3b8' },
        { id: 'bd', from: 'B', to: 'D', color: '#94a3b8' },
        { id: 'cd', from: 'C', to: 'D', color: '#94a3b8' },
        // Cross section boundary edges
        { id: 'mn', from: 'M', to: 'N', color: '#10b981', highlighted: true },
        { id: 'mp', from: 'M', to: 'P', color: '#10b981', highlighted: true },
        { id: 'pq', from: 'P', to: 'Q', color: '#10b981', highlighted: true },
        { id: 'qn', from: 'Q', to: 'N', color: '#10b981', highlighted: true },
      ],
      auxiliaryLines: [
        { id: 'ni-ext', from: 'N', to: 'I', color: '#f59e0b', dashed: true, isExtended: true },
        { id: 'ci-ext', from: 'C', to: 'I', color: '#f59e0b', dashed: true, isExtended: true },
        { id: 'ip-line', from: 'I', to: 'P', color: '#f59e0b', dashed: true }
      ],
      faces: [
        { id: 'cross-section-face', points: ['M', 'N', 'Q', 'P'], color: '#10b981', opacity: 0.5, label: 'Thiết diện MNPQ' }
      ],
      cameraPreset: { x: 5.5, y: 4.5, z: 6 }
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Xác định các đoạn giao tuyến có sẵn',
        titleEn: 'Step 1: Identify Existing Trace Segments',
        content: 'Mặt phẳng (MNP) cắt mặt (ABC) theo đoạn MN (vì M ∈ AB, N ∈ AC). Đồng thời cắt mặt (ABD) theo đoạn MP (vì M ∈ AB, P ∈ BD).',
        contentEn: 'Plane (MNP) cuts face (ABC) along segment MN and face (ABD) along segment MP.',
        geometryReasoning: '(MNP) ∩ (ABC) = MN; (MNP) ∩ (ABD) = MP.',
        geometryReasoningEn: '(MNP) ∩ (ABC) = MN; (MNP) ∩ (ABD) = MP.',
        highlightElements: {
          points: ['M', 'N', 'P'],
          edges: ['mn', 'mp']
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Mở rộng mặt phẳng tìm điểm ngoài cạnh BC',
        titleEn: 'Step 2: Extend Plane to Find Intersection with Line BC',
        content: 'Trong mặt phẳng (ABC), đường thẳng MN không song song với BC, do đó kéo dài MN cắt đường thẳng BC tại điểm I.',
        contentEn: 'In plane (ABC), lines MN and BC are not parallel, so extending MN intersects BC at point I.',
        geometryReasoning: 'Trong mp(ABC): Gọi I = MN ∩ BC. Vì I ∈ MN ⊂ (MNP) nên I ∈ (MNP). Mặt khác I ∈ BC ⊂ (BCD) nên I ∈ (BCD).',
        geometryReasoningEn: 'In plane (ABC): Let I = MN ∩ BC. Then I ∈ (MNP) and I ∈ (BCD).',
        highlightElements: {
          points: ['I', 'M', 'N', 'B', 'C'],
          showAuxiliary: true
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Tìm giao tuyến với mặt đáy (BCD)',
        titleEn: 'Step 3: Intersect with the Base Face (BCD)',
        content: 'Mặt phẳng (MNP) và mặt (BCD) có hai điểm chung là P và I. Do đó giao tuyến của chúng là đường thẳng PI. Đường thẳng PI cắt cạnh CD tại điểm Q.',
        contentEn: 'Planes (MNP) and (BCD) share points P and I. Thus their intersection line is PI, which meets edge CD at Q.',
        geometryReasoning: 'Trong mp(BCD): Nối PI cắt cạnh CD tại điểm Q = PI ∩ CD. Ta được đoạn giao tuyến PQ thuộc mặt (BCD).',
        geometryReasoningEn: 'In plane (BCD): Connect PI to cut CD at Q = PI ∩ CD. The trace segment on (BCD) is PQ.',
        highlightElements: {
          points: ['P', 'I', 'Q', 'C', 'D'],
          edges: ['pq'],
          showAuxiliary: true
        }
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Nối đoạn khép kín QN trên mặt (ACD)',
        titleEn: 'Step 4: Close the Polygon with Segment QN on Face (ACD)',
        content: 'Điểm Q thuộc CD ⊂ (ACD) và N thuộc AC ⊂ (ACD). Do đó đoạn QN chính là giao tuyến của (MNP) với mặt (ACD).',
        contentEn: 'Q ∈ CD ⊂ (ACD) and N ∈ AC ⊂ (ACD). Thus segment QN is the trace on face (ACD).',
        geometryReasoning: '(MNP) ∩ (ACD) = QN.',
        geometryReasoningEn: '(MNP) ∩ (ACD) = QN.',
        highlightElements: {
          points: ['Q', 'N'],
          edges: ['qn']
        }
      },
      {
        stepNumber: 5,
        title: 'Bước 5: Kết luận đa giác thiết diện',
        titleEn: 'Step 5: Conclude the Cross-Section Polygon',
        content: 'Bốn đoạn giao tuyến MN, NQ, QP, PM khép kín tạo thành thiết diện là tứ giác MNPQ.',
        contentEn: 'The four trace segments form a closed boundary: the cross-section is quadrilateral MNPQ.',
        geometryReasoning: 'Kết luận: Thiết diện của hình tứ diện ABCD khi cắt bởi mp(MNP) là tứ giác MNPQ.',
        geometryReasoningEn: 'Conclusion: The cross-section of ABCD cut by (MNP) is quadrilateral MNPQ.',
        highlightElements: {
          faces: ['cross-section-face'],
          edges: ['mn', 'mp', 'pq', 'qn'],
          showCrossSection: true
        }
      }
    ]
  },
  {
    id: 'prob-4',
    title: 'Chứng minh 3 điểm thẳng hàng trong không gian',
    titleEn: 'Prove Three Points are Collinear in Space',
    category: 'collinear_points',
    categoryLabel: 'Chứng minh 3 điểm thẳng hàng',
    categoryLabelEn: 'Collinear Points in Space',
    difficulty: 'Vận dụng cao',
    difficultyEn: 'Master',
    description: 'Phương pháp chuẩn mực: Muốn chứng minh 3 điểm phân biệt I, J, K thẳng hàng, ta chứng minh 3 điểm đó cùng thuộc giao tuyến của hai mặt phẳng phân biệt (P) và (Q).',
    descriptionEn: 'Standard method: To prove 3 distinct points I, J, K are collinear, show they all belong to the intersection line of two distinct planes (P) and (Q).',
    modelData: {
      id: 'model-collinear',
      title: 'Mô hình 3D Ba điểm thẳng hàng trên giao tuyến d',
      titleEn: '3D Model: Collinear Points on Intersection Line d',
      description: 'Ba điểm I, J, K cùng thuộc giao tuyến của hai mặt phẳng cắt nhau (P) và (Q) nên chúng thẳng hàng.',
      descriptionEn: 'Points I, J, K lie on the intersection line of planes (P) and (Q), proving they are collinear.',
      points: [
        { name: 'I', x: -1.8, y: -0.9, z: -1.2, color: '#ef4444' },
        { name: 'J', x: 0, y: 0, z: 0, color: '#f59e0b' },
        { name: 'K', x: 1.8, y: 0.9, z: 1.2, color: '#10b981' },
        { name: 'P_top', x: -2.5, y: 1.8, z: 0, color: '#94a3b8' },
        { name: 'Q_right', x: 2.5, y: -1.2, z: 0, color: '#94a3b8' }
      ],
      edges: [
        { id: 'line-ijk', from: 'I', to: 'K', color: '#f59e0b', label: 'd = (P) ∩ (Q)', highlighted: true }
      ],
      faces: [
        { id: 'plane-p', points: ['I', 'P_top', 'K'], color: '#3b82f6', opacity: 0.35, label: '(P)' },
        { id: 'plane-q', points: ['I', 'Q_right', 'K'], color: '#10b981', opacity: 0.35, label: '(Q)' }
      ],
      cameraPreset: { x: 5, y: 4, z: 5 }
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Tìm hai mặt phẳng phân biệt (P) và (Q)',
        titleEn: 'Step 1: Identify Two Distinct Planes (P) and (Q)',
        content: 'Xác định hai mặt phẳng phân biệt có chứa các yếu tố hình học liên quan đến 3 điểm I, J, K.',
        contentEn: 'Identify two distinct planes containing geometric elements linked to points I, J, K.',
        geometryReasoning: 'Gọi (P) và (Q) là hai mặt phẳng phân biệt chứa các cặp đường thẳng cắt nhau.',
        geometryReasoningEn: 'Let (P) and (Q) be distinct planes holding intersecting lines.',
        highlightElements: {
          faces: ['plane-p', 'plane-q']
        }
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Chứng minh cả 3 điểm đều là điểm chung',
        titleEn: 'Step 2: Prove All 3 Points are Common Points',
        content: 'Chứng minh I ∈ (P) và I ∈ (Q) ⟹ I ∈ (P) ∩ (Q). Tương tự J ∈ (P) ∩ (Q) và K ∈ (P) ∩ (Q).',
        contentEn: 'Show I ∈ (P) ∩ (Q), J ∈ (P) ∩ (Q), and K ∈ (P) ∩ (Q).',
        geometryReasoning: 'I, J, K đều thuộc tập hợp điểm chung của hai mặt phẳng phân biệt (P) và (Q).',
        geometryReasoningEn: 'Points I, J, K belong to the set of common points of planes (P) and (Q).',
        highlightElements: {
          points: ['I', 'J', 'K']
        }
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Kết luận thẳng hàng theo Tiên đề 4',
        titleEn: 'Step 3: Conclude Collinearity via Axiom 4',
        content: 'Theo Tiên đề 4, tập hợp tất cả các điểm chung của hai mặt phẳng phân biệt là một đường thẳng duy nhất d. Do I, J, K cùng thuộc giao tuyến d nên I, J, K thẳng hàng.',
        contentEn: 'By Axiom 4, common points of two distinct planes lie on a unique line d. Hence I, J, K are collinear.',
        geometryReasoning: 'Kết luận: I, J, K cùng thuộc đường thẳng d = (P) ∩ (Q) ⟹ 3 điểm I, J, K thẳng hàng.',
        geometryReasoningEn: 'Conclusion: I, J, K belong to line d = (P) ∩ (Q) ⟹ points I, J, K are collinear.',
        highlightElements: {
          points: ['I', 'J', 'K'],
          edges: ['line-ijk']
        }
      }
    ]
  }
];

/**
 * Multiple Choice Quizzes (Trắc nghiệm tương tác)
 */
export const QUIZ_QUESTIONS_DATA: QuizQuestion[] = [
  {
    id: 'quiz-1',
    question: 'Có bao nhiêu mặt phẳng đi qua ba điểm phân biệt thẳng hàng?',
    questionEn: 'How many planes pass through three distinct collinear points?',
    options: [
      { key: 'A', text: '1 mặt phẳng duy nhất', textEn: 'Exactly 1 plane' },
      { key: 'B', text: 'Vô số mặt phẳng', textEn: 'Infinitely many planes' },
      { key: 'C', text: 'Không có mặt phẳng nào', textEn: 'Zero planes' },
      { key: 'D', text: '3 mặt phẳng phân biệt', textEn: '3 distinct planes' }
    ],
    correctKey: 'B',
    explanation: 'Theo Tiên đề 2, ba điểm KHÔNG thẳng hàng mới xác định duy nhất 1 mặt phẳng. Nếu ba điểm thẳng hàng, chúng cùng nằm trên đường thẳng d, và có vô số mặt phẳng quay quanh đường thẳng d (tương tự các trang của một cuốn sách mở).',
    explanationEn: 'By Axiom 2, 3 NON-collinear points fix a single plane. If collinear, they lie on a line, and infinitely many planes rotate around that axis like pages in an open book.',
    axiomRef: 'Tiên đề 2'
  },
  {
    id: 'quiz-2',
    question: 'Nếu hai mặt phẳng phân biệt (P) và (Q) có một điểm chung A thì chúng có bao nhiêu điểm chung?',
    questionEn: 'If two distinct planes (P) and (Q) share a point A, how many common points do they have?',
    options: [
      { key: 'A', text: 'Chỉ có 1 điểm chung A', textEn: 'Only 1 common point A' },
      { key: 'B', text: 'Có đúng 2 điểm chung', textEn: 'Exactly 2 common points' },
      { key: 'C', text: 'Vô số điểm chung nằm trên một đường thẳng', textEn: 'Infinitely many points along a line' },
      { key: 'D', text: 'Vô số điểm chung nằm khắp mặt phẳng', textEn: 'Infinitely many points covering the plane' }
    ],
    correctKey: 'C',
    explanation: 'Theo Tiên đề 4: Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có một đường thẳng chung duy nhất chứa tất cả các điểm chung. Do một đường thẳng có vô số điểm nên hai mặt phẳng có vô số điểm chung thẳng hàng.',
    explanationEn: 'By Axiom 4: If two distinct planes share a point, they share a unique line containing all common points. A line contains infinite points.',
    axiomRef: 'Tiên đề 4'
  },
  {
    id: 'quiz-3',
    question: 'Cho bốn điểm A, B, C, D không đồng phẳng. Có thể xác định được bao nhiêu mặt phẳng phân biệt từ bốn điểm này?',
    questionEn: 'Given 4 non-coplanar points A, B, C, D. How many distinct planes can be formed by these 4 points?',
    options: [
      { key: 'A', text: '3 mặt phẳng', textEn: '3 planes' },
      { key: 'B', text: '4 mặt phẳng', textEn: '4 planes' },
      { key: 'C', text: '6 mặt phẳng', textEn: '6 planes' },
      { key: 'D', text: 'Vô số mặt phẳng', textEn: 'Infinitely many planes' }
    ],
    correctKey: 'B',
    explanation: 'Bốn điểm không đồng phẳng tạo thành 4 đỉnh của một tứ diện ABCD. Cứ 3 điểm không thẳng hàng tạo thành 1 mặt phẳng, số mặt phẳng là tổ hợp chập 3 của 4: C(4, 3) = 4 mặt phẳng: (ABC), (ABD), (ACD), (BCD).',
    explanationEn: 'Four non-coplanar points form vertices of a tetrahedron ABCD. Choosing 3 points gives C(4, 3) = 4 faces: (ABC), (ABD), (ACD), (BCD).',
    axiomRef: 'Tiên đề 2'
  },
  {
    id: 'quiz-4',
    question: 'Khẳng định nào sau đây là SAI?',
    questionEn: 'Which of the following statements is FALSE?',
    options: [
      { key: 'A', text: 'Một điểm và một đường thẳng luôn xác định duy nhất một mặt phẳng.', textEn: 'A point and a line always uniquely determine a plane.' },
      { key: 'B', text: 'Hai đường thẳng cắt nhau xác định duy nhất một mặt phẳng.', textEn: 'Two intersecting lines uniquely determine a plane.' },
      { key: 'C', text: 'Hai đường thẳng song song xác định duy nhất một mặt phẳng.', textEn: 'Two parallel lines uniquely determine a plane.' },
      { key: 'D', text: 'Ba điểm không thẳng hàng xác định duy nhất một mặt phẳng.', textEn: 'Three non-collinear points uniquely determine a plane.' }
    ],
    correctKey: 'A',
    explanation: 'Khẳng định A SAI vì nếu điểm đó NẰM TRÊN đường thẳng thì chỉ có 1 đường thẳng, khi đó có vô số mặt phẳng chứa nó. Điều kiện chính xác phải là: Một đường thẳng và một điểm KHÔNG THUỘC đường thẳng đó.',
    explanationEn: 'Statement A is FALSE because if the point lies on the line, infinitely many planes contain it. The condition requires the point NOT to belong to the line.',
    axiomRef: 'Cách xác định mặt phẳng'
  },
  {
    id: 'quiz-5',
    question: 'Khi tìm thiết diện của hình chóp bị cắt bởi một mặt phẳng, thiết diện thu được có thể là hình gì?',
    questionEn: 'When slicing a pyramid with a plane, what shapes can the cross-section be?',
    options: [
      { key: 'A', text: 'Luôn là hình tròn hoặc elip', textEn: 'Always a circle or ellipse' },
      { key: 'B', text: 'Một đa giác lồi có số cạnh từ 3 đến số mặt của hình chóp', textEn: 'A convex polygon with 3 to n sides' },
      { key: 'C', text: 'Chỉ có thể là tam giác', textEn: 'Only triangles' },
      { key: 'D', text: 'Chỉ có thể là tứ giác', textEn: 'Only quadrilaterals' }
    ],
    correctKey: 'B',
    explanation: 'Thiết diện của hình chóp khi cắt bởi một mặt phẳng là đa giác phẳng giới hạn bởi các đoạn giao tuyến giữa mặt phẳng cắt với các mặt của hình chóp. Do đó nó là đa giác có số cạnh ít nhất là 3 và nhiều nhất bằng số mặt của hình chóp.',
    explanationEn: 'The cross section is bounded by line segments where the cutting plane intersects the polyhedron faces, forming a polygon with 3 to n edges.',
    axiomRef: 'Phương pháp thiết diện'
  },
  {
    id: 'quiz-6',
    question: 'Để chứng minh ba điểm I, J, K thẳng hàng trong không gian, phương pháp phổ biến nhất là:',
    questionEn: 'To prove three points I, J, K are collinear in space, the most standard method is:',
    options: [
      { key: 'A', text: 'Chứng minh chúng cùng thuộc một mặt phẳng', textEn: 'Prove they lie in the same plane' },
      { key: 'B', text: 'Chứng minh IJ + JK = IK bằng thước đo', textEn: 'Show distance sum IJ + JK = IK' },
      { key: 'C', text: 'Chứng minh chúng là các điểm chung của hai mặt phẳng phân biệt', textEn: 'Prove they are all common points of two distinct planes' },
      { key: 'D', text: 'Chứng minh góc IJK = 90 độ', textEn: 'Show angle IJK = 90 degrees' }
    ],
    correctKey: 'C',
    explanation: 'Theo Tiên đề 4, hai mặt phẳng phân biệt nếu có điểm chung thì tập hợp tất cả các điểm chung là một đường thẳng duy nhất. Do đó, nếu chứng minh được I, J, K cùng thuộc giao tuyến của hai mặt phẳng phân biệt thì I, J, K chắc chắn thẳng hàng.',
    explanationEn: 'By Axiom 4, common points of two distinct planes form a unique line. Proving I, J, K all belong to this intersection line proves collinearity.',
    axiomRef: 'Tiên đề 4'
  }
];

/**
 * 3D Geometry Sandbox Solids
 */
export const SANDBOX_PRESETS: { [key: string]: GeometryModelData } = {
  tetrahedron: {
    id: 'preset-tetra',
    title: 'Hình tứ diện đều ABCD',
    titleEn: 'Regular Tetrahedron ABCD',
    description: 'Hình đa diện có 4 mặt đều là tam giác, 4 đỉnh và 6 cạnh.',
    descriptionEn: 'Polyhedron with 4 triangular faces, 4 vertices, and 6 edges.',
    points: [
      { name: 'A', x: 0, y: 2.8, z: 0, color: '#f59e0b' },
      { name: 'B', x: -2, y: 0, z: -1.2, color: '#3b82f6' },
      { name: 'C', x: 2, y: 0, z: -1.2, color: '#3b82f6' },
      { name: 'D', x: 0, y: 0, z: 2.2, color: '#3b82f6' },
    ],
    edges: [
      { id: 'ab', from: 'A', to: 'B', color: '#94a3b8' },
      { id: 'bc', from: 'B', to: 'C', dashed: true, color: '#64748b' },
      { id: 'ca', from: 'C', to: 'A', color: '#94a3b8' },
      { id: 'ad', from: 'A', to: 'D', color: '#94a3b8' },
      { id: 'bd', from: 'B', to: 'D', color: '#94a3b8' },
      { id: 'cd', from: 'C', to: 'D', color: '#94a3b8' },
    ],
    faces: [
      { id: 'f-abc', points: ['A', 'B', 'C'], color: '#3b82f6', opacity: 0.25 },
      { id: 'f-abd', points: ['A', 'B', 'D'], color: '#8b5cf6', opacity: 0.25 },
      { id: 'f-acd', points: ['A', 'C', 'D'], color: '#06b6d4', opacity: 0.25 },
      { id: 'f-bcd', points: ['B', 'C', 'D'], color: '#10b981', opacity: 0.25 },
    ],
    cameraPreset: { x: 5, y: 4, z: 5.5 }
  },
  pyramid_quad: {
    id: 'preset-pyramid-quad',
    title: 'Hình chóp tứ giác S.ABCD',
    titleEn: 'Quadrangular Pyramid S.ABCD',
    description: 'Hình chóp có đỉnh S và đáy ABCD là hình chữ nhật hoặc hình thang.',
    descriptionEn: 'Pyramid with apex S and base ABCD.',
    points: [
      { name: 'S', x: 0, y: 3.2, z: 0, color: '#f59e0b' },
      { name: 'A', x: -2.2, y: 0, z: -1.4, color: '#3b82f6' },
      { name: 'B', x: 2.2, y: 0, z: -1.4, color: '#3b82f6' },
      { name: 'C', x: 2.2, y: 0, z: 1.4, color: '#3b82f6' },
      { name: 'D', x: -2.2, y: 0, z: 1.4, color: '#3b82f6' },
    ],
    edges: [
      { id: 'ab', from: 'A', to: 'B', dashed: true, color: '#64748b' },
      { id: 'bc', from: 'B', to: 'C', color: '#94a3b8' },
      { id: 'cd', from: 'C', to: 'D', color: '#94a3b8' },
      { id: 'da', from: 'D', to: 'A', dashed: true, color: '#64748b' },
      { id: 'sa', from: 'S', to: 'A', dashed: true, color: '#64748b' },
      { id: 'sb', from: 'S', to: 'B', color: '#94a3b8' },
      { id: 'sc', from: 'S', to: 'C', color: '#94a3b8' },
      { id: 'sd', from: 'S', to: 'D', color: '#94a3b8' },
    ],
    faces: [
      { id: 'f-base', points: ['A', 'B', 'C', 'D'], color: '#475569', opacity: 0.25 },
      { id: 'f-sab', points: ['S', 'A', 'B'], color: '#3b82f6', opacity: 0.2 },
      { id: 'f-sbc', points: ['S', 'B', 'C'], color: '#10b981', opacity: 0.2 },
      { id: 'f-scd', points: ['S', 'C', 'D'], color: '#f59e0b', opacity: 0.2 },
      { id: 'f-sda', points: ['S', 'D', 'A'], color: '#8b5cf6', opacity: 0.2 },
    ],
    cameraPreset: { x: 6, y: 5, z: 6 }
  },
  box_prism: {
    id: 'preset-prism',
    title: 'Hình hộp chữ nhật ABCD.A\'B\'C\'D\'',
    titleEn: 'Parallelepiped ABCD.A\'B\'C\'D\'',
    description: 'Hình hộp có 6 mặt là hình chữ nhật, các mặt đối diện song song từng đôi một.',
    descriptionEn: 'Rectangular box with 6 faces and parallel opposing planes.',
    points: [
      // Bottom face
      { name: 'A', x: -1.8, y: -1.2, z: -1.2, color: '#3b82f6' },
      { name: 'B', x: 1.8, y: -1.2, z: -1.2, color: '#3b82f6' },
      { name: 'C', x: 1.8, y: -1.2, z: 1.2, color: '#3b82f6' },
      { name: 'D', x: -1.8, y: -1.2, z: 1.2, color: '#3b82f6' },
      // Top face
      { name: "A'", x: -1.8, y: 1.5, z: -1.2, color: '#f59e0b' },
      { name: "B'", x: 1.8, y: 1.5, z: -1.2, color: '#f59e0b' },
      { name: "C'", x: 1.8, y: 1.5, z: 1.2, color: '#f59e0b' },
      { name: "D'", x: -1.8, y: 1.5, z: 1.2, color: '#f59e0b' },
    ],
    edges: [
      { id: 'ab', from: 'A', to: 'B', dashed: true, color: '#64748b' },
      { id: 'bc', from: 'B', to: 'C', color: '#94a3b8' },
      { id: 'cd', from: 'C', to: 'D', color: '#94a3b8' },
      { id: 'da', from: 'D', to: 'A', dashed: true, color: '#64748b' },
      { id: "a'b'", from: "A'", to: "B'", color: '#94a3b8' },
      { id: "b'c'", from: "B'", to: "C'", color: '#94a3b8' },
      { id: "c'd'", from: "C'", to: "D'", color: '#94a3b8' },
      { id: "d'a'", from: "D'", to: "A'", color: '#94a3b8' },
      { id: "aa'", from: 'A', to: "A'", dashed: true, color: '#64748b' },
      { id: "bb'", from: 'B', to: "B'", color: '#94a3b8' },
      { id: "cc'", from: 'C', to: "C'", color: '#94a3b8' },
      { id: "dd'", from: 'D', to: "D'", color: '#94a3b8' },
    ],
    faces: [
      { id: 'f-top', points: ["A'", "B'", "C'", "D'"], color: '#3b82f6', opacity: 0.2 },
      { id: 'f-bottom', points: ['A', 'B', 'C', 'D'], color: '#475569', opacity: 0.2 },
      { id: 'f-front', points: ['D', 'C', "C'", "D'"], color: '#10b981', opacity: 0.2 },
      { id: 'f-back', points: ['A', 'B', "B'", "A'"], color: '#8b5cf6', opacity: 0.15 },
    ],
    cameraPreset: { x: 5.5, y: 4, z: 6 }
  }
};
