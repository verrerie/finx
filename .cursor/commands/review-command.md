# Review Command

This command reviews a command `.md` file for quality, consistency, conciseness, and AI usability.

## Core Principles

**Review Focus:**
- Quality for AI usage - Can an AI agent effectively follow these instructions?
- Consistency - Is it consistent with codebase and within itself?
- Conciseness - Avoid verbosity and noise
- Meaningfulness - Is it relevant and valuable?
- Actionability - Are examples useful and actionable for AI?

**Improvement Priority:**
- Focus on **major improvements** that significantly impact usability
- Mention minor improvements but don't focus on them
- Only implement improvements when user confirms

## Workflow Steps

### 1. Read and Understand the Command File

**Action Required:**

1. **Read the Command File:**
   - Read the entire command file to understand its purpose and structure
   - Note the command name and what it's supposed to do
   - Identify the main sections and workflow

2. **Understand Context:**
   - Check if similar commands exist in `.cursor/commands/`
   - Understand the codebase context if relevant
   - Note any dependencies or relationships to other commands

**Tool Usage:**
- Use `read_file()` to read the command file
- Use `list_dir()` to check for similar commands
- Use `codebase_search()` to understand codebase context

**Example Tool Calls:**
- `read_file(".cursor/commands/target-command.md")`
- `list_dir(".cursor/commands/")`
- `codebase_search("How does this command relate to the codebase?")`

### 2. Review for AI Usage Quality

**Action Required:**

1. **Check Actionability:**
   - Are instructions specific and actionable? (e.g., "do X" vs "consider X")
   - Are there clear "Action Required" sections?
   - Can an AI agent follow these instructions without ambiguity?

2. **Check Tool Usage:**
   - Are tool calls shown with correct syntax?
   - Are tool names and parameters clearly specified?
   - Are examples of tool usage provided?

3. **Check Workflow Clarity:**
   - Is the workflow step-by-step and sequential?
   - Are decision points clear (if/then logic)?
   - Are edge cases handled?

4. **Check Completeness:**
   - Are all necessary steps included?
   - Are error handling scenarios covered?
   - Are verification checklists provided?

### 3. Review for Consistency

**Action Required:**

1. **Internal Consistency:**
   - Is formatting consistent throughout?
   - Are section structures consistent?
   - Are examples consistent in style and format?
   - Are tool call syntaxes consistent?

2. **Codebase Consistency:**
   - Does it follow patterns from other command files?
   - Are naming conventions consistent?
   - Are workflow structures similar to other commands?
   - Does it use the same tool syntax as other commands?

3. **Cross-Reference Consistency:**
   - If it references other commands, are they correct?
   - If it references codebase files, are paths correct?
   - Are any referenced concepts accurate?

### 4. Review for Conciseness

**Action Required:**

1. **Check for Verbosity:**
   - Are there redundant explanations?
   - Are there repeated concepts?
   - Are there unnecessary sections?
   - Is information repeated in multiple places?

2. **Check for Noise:**
   - Are there irrelevant details?
   - Are there overly verbose examples?
   - Are there unnecessary comments or explanations?
   - Can sections be combined or simplified?

3. **Check for Clarity:**
   - Is the information dense but clear?
   - Can verbose sections be condensed without losing meaning?
   - Are examples concise but complete?

### 5. Review for Meaningfulness and Relevance

**Action Required:**

1. **Check Relevance:**
   - Is the command relevant to the codebase?
   - Does it serve a clear purpose?
   - Is it aligned with project goals?

2. **Check Meaningfulness:**
   - Does it provide value?
   - Are instructions meaningful (not just restating obvious things)?
   - Does it add something useful?

3. **Check Completeness:**
   - Are all necessary aspects covered?
   - Are important edge cases handled?
   - Is the command complete and usable?

### 6. Review Examples

**Action Required:**

1. **Check Actionability:**
   - Are examples showing actual tool calls?
   - Are examples realistic and usable?
   - Can an AI agent follow the examples?

2. **Check Usefulness:**
   - Do examples illustrate key concepts?
   - Are examples relevant to the command's purpose?
   - Do examples cover different scenarios?

3. **Check Completeness:**
   - Are examples complete (not truncated)?
   - Do examples show the full workflow?
   - Are examples consistent with the instructions?

### 7. Rate and Summarize

**Action Required:**

1. **Calculate Overall Rating:**
   - Rate each category using Rating Criteria (see below)
   - Consider weighting: AI Usage Quality (40%), Consistency (20%), Conciseness (15%), Meaningfulness (15%), Examples (10%)
   - Calculate weighted average: (AI × 0.4) + (Consistency × 0.2) + (Conciseness × 0.15) + (Meaningfulness × 0.15) + (Examples × 0.1)
   - Provide overall rating (0-10 scale)

**Rating Criteria:**
- **Excellent (9-10)**: Meets all criteria, highly usable, minimal issues
- **Good (7-8)**: Meets most criteria, minor issues that don't significantly impact usability
- **Fair (5-6)**: Meets some criteria, issues that affect usability
- **Poor (0-4)**: Major issues, significantly impacts usability

2. **Identify Major Improvements:**
   - List improvements that significantly impact usability
   - Prioritize by impact (high impact first)
   - Focus on actionable improvements

3. **Mention Minor Improvements:**
   - List minor improvements briefly
   - Don't focus on them
   - Can be addressed later if needed

4. **Present Summary:**
   - Overall rating and brief explanation
   - Major improvements (prioritized)
   - Minor improvements (brief list)
   - Recommendation: implement improvements or not

**Rating Format:**
```
## Review Summary

**Overall Rating: X.X/10**

### Category Ratings:
- AI Usage Quality: X/10
- Consistency: X/10
- Conciseness: X/10
- Meaningfulness: X/10
- Examples: X/10

### Major Improvements:
1. [High Impact] - [Description]
2. [High Impact] - [Description]
3. [Medium Impact] - [Description]

### Minor Improvements:
- [Minor issue 1]
- [Minor issue 2]

### Recommendation:
[Implement improvements / Command is good as-is]
```

### 7.5. Self-Reflection: When to Stop

**Action Required:**

Before proceeding to implementation, evaluate whether further improvements are worthwhile:

1. **Assess Improvement Value:**
   - Are the remaining improvements high-value or low-value?
   - Would implementing them significantly improve usability?
   - Is the command already at a good quality level (8.5+/10)?

2. **Check for Diminishing Returns:**
   - Are improvements becoming increasingly minor?
   - Is the effort-to-value ratio decreasing?
   - Would further changes add complexity without proportional benefit?

3. **Avoid Back-and-Forth Changes:**
   - Have improvements been made and then reverted?
   - Are changes conflicting with previous improvements?
   - Is there a pattern of repeated modifications?

4. **Verify Alignment with Core Principles:**
   - Do improvements conflict with the command's core principles?
   - Are changes making the command less usable for AI?
   - Would improvements reduce clarity or actionability?

5. **Consider Cover Complexity:**
   - Are improvements addressing edge cases that rarely occur?
   - Is the command becoming overly complex to cover all scenarios?
   - Would simpler, more focused improvements be better?

**Stop Criteria - Recommend stopping when:**
- Overall rating is 8.5/10 or higher AND remaining improvements are minor
- Remaining improvements are low-value (cosmetic, edge cases, or diminishing returns)
- Improvements would conflict with core principles (usability, actionability, clarity)
- Multiple rounds of improvements have been made without clear progress
- Further changes would add complexity without proportional benefit

**Continue Criteria - Proceed when:**
- Overall rating is below 8.5/10 AND major improvements are identified
- Improvements are high-value and significantly impact usability
- Improvements align with core principles and improve AI usability
- Clear, actionable improvements remain that don't add unnecessary complexity

**Decision Format:**
```
## Self-Reflection

**Current Rating:** X.X/10
**Remaining Improvements:** [List]
**Value Assessment:** [High/Medium/Low]
**Recommendation:** [Stop / Continue]

**Reasoning:**
- [Why stop or continue]
- [Key factors considered]
```

### 8. Ask for Confirmation Before Implementing

**Action Required:**

1. **Present Review Summary:**
   - Show overall rating
   - List major improvements
   - Mention minor improvements briefly
   - Provide recommendation

2. **Self-Reflect Before Asking:**
   - Evaluate if improvements are worthwhile (see Step 7.5)
   - If stopping is recommended, explain why and present current state
   - If continuing, proceed with confirmation request

3. **Ask for Confirmation:**
   - "Would you like me to implement these improvements?"
   - List what will be changed
   - Wait for user confirmation

4. **If Confirmed, Implement:**
   - Implement major improvements
   - Fix consistency issues
   - Remove verbosity
   - Improve examples
   - Verify changes don't break the command

5. **If Not Confirmed:**
   - Acknowledge the decision
   - Note that improvements can be implemented later
   - Save review summary if helpful

**Confirmation Prompt:**
```
I've reviewed [command-file].md and found:

Overall Rating: X.X/10

Major Improvements:
1. [Improvement 1]
2. [Improvement 2]
...

Minor Improvements:
- [Minor issue 1]
- [Minor issue 2]

Would you like me to implement these improvements?
- Yes: I'll implement the major improvements
- No: I'll leave the command as-is

Please confirm: [Yes/No]
```

## Review Checklist

Before presenting review, verify:
- [ ] All categories reviewed (AI Usage, Consistency, Conciseness, Meaningfulness, Examples)
- [ ] Ratings calculated for each category
- [ ] Overall rating calculated
- [ ] Major improvements identified and prioritized
- [ ] Minor improvements listed briefly
- [ ] Recommendation provided
- [ ] Confirmation requested before implementing

## Examples

### Example 1: Reviewing a New Command

**Command File:** `.cursor/commands/new-command.md`

**Review Process:**
1. Read the command file: `read_file(".cursor/commands/new-command.md")`
2. Check for similar commands: `list_dir(".cursor/commands/")`
3. Review for AI usage quality:
   - Check for "Action Required" sections in each step
   - Verify tool calls use correct syntax (e.g., `read_file()`, `list_dir()`)
   - Compare workflow structure to `improve.md` and `sentiment.md`
4. Check consistency with other commands:
   - Compare formatting and structure to other command files
   - Verify tool call syntax matches other commands
5. Check for verbosity:
   - Look for redundant explanations or repeated concepts
   - Identify sections that could be simplified
6. Check relevance and meaningfulness:
   - Verify command serves a clear purpose
   - Ensure instructions provide value
7. Review examples:
   - Check examples show actual tool calls with correct syntax
   - Verify examples are complete and realistic
8. Rate and summarize:
   - Calculate weighted average rating
   - Identify major improvements
9. Ask for confirmation

**Example Output:**
```
## Review Summary: new-command.md

**Overall Rating: 7.5/10**

### Category Ratings:
- AI Usage Quality: 8/10 - Good actionability, some ambiguities
- Consistency: 7/10 - Minor inconsistencies with other commands
- Conciseness: 8/10 - Mostly concise, some verbosity
- Meaningfulness: 8/10 - Relevant and valuable
- Examples: 7/10 - Good examples, could be more actionable

### Major Improvements:
1. [High Impact] Add "Action Required" sections to each step for consistency
2. [High Impact] Fix tool call syntax inconsistencies (bash vs Python style)
3. [Medium Impact] Remove redundant explanations in Step 3

### Minor Improvements:
- Add more examples for edge cases
- Improve formatting consistency in examples
- Add verification checklist

### Recommendation:
Implement improvements to reach 9/10 quality
```

### Example 2: Reviewing an Existing Command

**Command File:** `.cursor/commands/existing-command.md`

**Review Process:**
1. Read the command file: `read_file(".cursor/commands/existing-command.md")`
2. Compare to other commands: `list_dir(".cursor/commands/")`
3. Review for AI usage quality:
   - Verify "Action Required" sections exist
   - Check tool call syntax consistency (e.g., `read_file()`, `list_dir()`)
   - Compare workflow to other commands
4. Check for verbosity:
   - Look for redundant sections
   - Identify areas that could be condensed
5. Review examples:
   - Verify examples show actual tool calls with correct syntax
   - Check examples are complete and cover different scenarios
6. Rate and summarize:
   - Calculate weighted average rating
   - Identify major improvements (prioritize by impact)
7. Ask for confirmation

**Example Output:**
```
## Review Summary: existing-command.md

**Overall Rating: 8.5/10**

### Category Ratings:
- AI Usage Quality: 9/10 - Highly actionable, clear tool usage
- Consistency: 8/10 - Consistent with other commands, minor formatting differences
- Conciseness: 8/10 - Concise, minor verbosity in examples
- Meaningfulness: 9/10 - Highly relevant and valuable
- Examples: 8/10 - Good examples, could show more edge cases

### Major Improvements:
1. [Medium Impact] Add more examples for edge cases
2. [Medium Impact] Improve formatting consistency in examples section

### Minor Improvements:
- Add note about self-review scenarios (meta-review)
- Consider adding verification checklist

### Recommendation:
Command is good as-is, minor improvements optional
```

## Important Notes

- **Focus on major improvements** - Don't get bogged down in minor details
- **Only implement when confirmed** - Always ask before making changes
- **Be constructive** - Provide actionable feedback
- **Consider context** - Review in context of codebase and other commands
- **Prioritize usability** - Focus on what makes the command more usable for AI

## Error Handling

**If Command File Doesn't Exist:**
- Acknowledge the error
- Ask user to provide correct path
- Verify file exists before reviewing

**If Command File is Empty:**
- Note that file is empty
- Ask if user wants to create a new command
- Provide guidance if needed

**If Review is Unclear:**
- Ask user for clarification
- Focus on specific aspects if needed
- Provide partial review if helpful

**Note on Self-Review (Meta-Review):**
- When reviewing this command itself, follow the same process
- Be aware of potential circular dependencies
- Focus on objective criteria rather than subjective preferences
- Consider the command's purpose: reviewing other commands for AI usability

