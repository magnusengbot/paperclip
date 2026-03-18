import { describe, expect, it } from "vitest";
import {
  shouldAutoHandoffInReview,
  shouldClearStaleExecutionLockBeforeHandoff,
} from "../routes/issues.js";

describe("in_review handoff automation", () => {
  it("auto-handoffs only on transition into in_review when assignee differs from reviewer", () => {
    expect(
      shouldAutoHandoffInReview({
        fromStatus: "in_progress",
        toStatus: "in_review",
        assigneeAgentId: "agent-worker",
        reviewerAgentId: "agent-reviewer",
      }),
    ).toBe(true);

    expect(
      shouldAutoHandoffInReview({
        fromStatus: "in_review",
        toStatus: "in_review",
        assigneeAgentId: "agent-worker",
        reviewerAgentId: "agent-reviewer",
      }),
    ).toBe(false);

    expect(
      shouldAutoHandoffInReview({
        fromStatus: "in_progress",
        toStatus: "in_review",
        assigneeAgentId: "agent-reviewer",
        reviewerAgentId: "agent-reviewer",
      }),
    ).toBe(false);
  });

  it("clears stale execution lock only when handoff is happening and a lock exists", () => {
    expect(
      shouldClearStaleExecutionLockBeforeHandoff({
        autoHandoffToReviewer: true,
        executionRunId: "run-1",
      }),
    ).toBe(true);

    expect(
      shouldClearStaleExecutionLockBeforeHandoff({
        autoHandoffToReviewer: true,
        executionRunId: null,
      }),
    ).toBe(false);

    expect(
      shouldClearStaleExecutionLockBeforeHandoff({
        autoHandoffToReviewer: false,
        executionRunId: "run-1",
      }),
    ).toBe(false);
  });
});
