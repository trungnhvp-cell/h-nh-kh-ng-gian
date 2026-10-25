import test from 'node:test';
import assert from 'node:assert/strict';
import { AXIOMS_DATA, SOLVED_PROBLEMS_DATA, QUIZ_QUESTIONS_DATA } from '../src/data/curriculumData.ts';

test('5 Core Solid Geometry Axioms integrity test', () => {
  assert.equal(AXIOMS_DATA.length, 5, 'Should define exactly 5 axioms');
  AXIOMS_DATA.forEach((axiom, idx) => {
    assert.equal(axiom.number, idx + 1, `Axiom number should be ${idx + 1}`);
    assert.ok(axiom.statement.length > 10, 'Axiom statement must be comprehensive');
    assert.ok(axiom.modelData.points.length >= 2, '3D model must have points');
  });
});

test('Step-by-step solved problems completeness test', () => {
  assert.ok(SOLVED_PROBLEMS_DATA.length >= 4, 'Should contain at least 4 classic problems');
  SOLVED_PROBLEMS_DATA.forEach((problem) => {
    assert.ok(problem.steps.length >= 3, `Problem ${problem.id} should have at least 3 steps`);
    problem.steps.forEach((step) => {
      assert.ok(step.geometryReasoning.length > 5, 'Every step must include geometric deduction');
    });
  });
});

test('Quiz questions validity test', () => {
  assert.ok(QUIZ_QUESTIONS_DATA.length >= 6, 'Should have multiple-choice quiz questions');
  QUIZ_QUESTIONS_DATA.forEach((q) => {
    assert.equal(q.options.length, 4, 'Each quiz must have 4 options');
    const validKeys = q.options.map(o => o.key);
    assert.ok(validKeys.includes(q.correctKey), `Correct key ${q.correctKey} must exist in options`);
  });
});
