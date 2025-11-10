# Improve Command

This command guides the AI agent through a systematic code review and improvement process at three levels: design, code quality (SOLID principles), and documentation.

## Core Principles

**Important: Improve only one thing at a time**

- **Priority: New changes first** - Always prioritize improvements to new changes (including uncommitted, unpushed and pushed changes) compared to remote main branch
- **General improvements only when no new changes** - Only proceed with general codebase improvements when there are no new changes compared to main
- If multiple improvements are found, pick the **most important one**
- If it's not clear which is most important, **ask for confirmation**
- After implementation, verify and fix any test, lint, or integration failures
- Focus on **simplicity over cleverness**
- Prioritize **maintainability, scalability, and engineer-friendliness**

## Workflow Steps

### 1. Review Current Codebase

**Action Required:**

1. **Check Current State:**
   - Check current branch and status
   - Check for uncommitted and unpushed changes
   - Run tests to establish baseline
   - Run linter to check current state

2. **Verify Baseline:**
   - Ensure all tests pass
   - Verify no linting errors
   - Confirm build succeeds
   - Check integration tests pass (if applicable)

**Tool Usage:**
- Use bash commands for git operations and test/lint checks
- Use `codebase_search()` if needed to understand codebase structure

**Example Tool Calls:**
- `codebase_search("How is the codebase structured?")`

**Example Commands:**
```bash
# Check current branch and status
git status

# Review recent changes
git log --oneline -10

# Check for any uncommitted changes
git status --porcelain

# Run tests to establish baseline
pnpm test

# Run linter to check current state
pnpm lint
```

**Baseline Verification:**
- [ ] All tests pass
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Integration tests pass (if applicable)

### 2. Check for New Changes Compared to Main

**Action Required:**

1. **Check for Changes:**
   - Check if there are changes compared to main
   - Review what files have changed
   - See commit history compared to main

2. **Determine Review Path:**
   - **If new changes exist**: Focus improvements on new changes only
   - **If no new changes**: Proceed with general codebase review

**Tool Usage:**
- Use bash commands for git operations

**Example Commands:**
```bash
# Check if there are changes compared to main
git diff main --name-only

# Review what files have changed
git diff main --stat

# See commit history compared to main
git log --oneline main..HEAD
```

**Decision Logic:**

1. **If there are new changes compared to main:**
   - **PRIORITY**: Focus improvements on the new changes
   - Review only the files that changed compared to main
   - Skip general codebase review
   - Proceed to Step 3: Review New Changes at Three Levels

2. **If there are NO new changes compared to main:**
   - Proceed with general codebase review
   - Review entire codebase at three levels
   - Proceed to Step 3: Review at Three Levels (General)

**Files to Review:**
- If new changes exist: Only review files in `git diff main --name-only`
- If no new changes: Review entire codebase

### 3. Review at Three Levels

**Action Required:**

1. **Determine Review Scope:**
   - If new changes exist: Review only changed files
   - If no new changes: Review entire codebase

2. **Review at Three Levels:**
   - Level 1: Design Review
   - Level 2: Code Quality Review (SOLID Principles)
   - Level 3: Documentation Review

**Tool Usage:**
- Use bash commands for git operations and file analysis
- Use `codebase_search()` to find issues
- Use `glob_file_search()` to find documentation files

**Example Tool Calls:**
- `codebase_search("What design issues exist in [file]?")`
- `codebase_search("Where are there overly complex implementations?")`
- `glob_file_search("*.md")`
- `glob_file_search("README.md")`

**Review Scope:**
- **If new changes exist**: Review only files that changed compared to main
- **If no new changes**: Review entire codebase

```bash
# Get list of changed files (if new changes exist)
git diff main --name-only

# Review specific changed files
git diff main <file1> <file2>
```

#### Level 1: Design Review

**Focus Areas:**
- **Maintainability**: Is the code easy to understand and modify?
- **Scalability**: Can the code handle growth without major refactoring?
- **Engineer-friendly**: Is the code approachable for new team members?
- **Simplicity**: Is the solution straightforward, avoiding unnecessary complexity?

**Questions to Ask:**
- Are there overly complex patterns that could be simplified?
- Is the architecture clear and easy to follow?
- Are there tight couplings that make changes difficult?
- Is the code organized in a logical, discoverable way?
- Are there abstractions that add more complexity than value?

**Tools:**
- Review changed files: `git diff main <file>` (if new changes exist)
- Use `codebase_search()` to find design issues
- Use bash commands for manual analysis

**Example Tool Calls:**
- **If new changes**: `codebase_search("What design issues exist in [changed file]?")`
- **If new changes**: `codebase_search("Are there overly complex patterns in [changed file]?")`
- **If no new changes**: `codebase_search("Where are there overly complex implementations or patterns?")`
- **If no new changes**: `codebase_search("What parts of the codebase are difficult to understand or modify?")`

**Bash Commands:**
  ```bash
  # Find large files (potential complexity)
  find . -name "*.ts" -type f -exec wc -l {} \; | sort -rn | head -10
  
  # Find files with many functions/classes
  grep -r "^(export )?(class|function|const.*=.*function)" --include="*.ts" | wc -l
  ```

#### Level 2: Code Quality Review (SOLID Principles)

**Focus Areas:**

**S - Single Responsibility Principle**
- Each class/function should have one reason to change
- Functions should do one thing well

**O - Open/Closed Principle**
- Open for extension, closed for modification
- Use interfaces and abstractions appropriately

**L - Liskov Substitution Principle**
- Subtypes must be substitutable for their base types
- Interfaces should be properly implemented

**I - Interface Segregation Principle**
- Clients shouldn't depend on methods they don't use
- Keep interfaces focused and minimal

**D - Dependency Inversion Principle**
- Depend on abstractions, not concretions
- High-level modules shouldn't depend on low-level modules

**Questions to Ask:**
- Are there classes/functions doing too many things?
- Are there violations of single responsibility?
- Are dependencies properly abstracted?
- Are interfaces too large or too specific?

**Tools:**
- Review changed files: `git diff main <file>` (if new changes exist)
- Use `codebase_search()` to find SOLID violations
- Use bash commands for manual analysis

**Example Tool Calls:**
- **If new changes**: `codebase_search("What SOLID principle violations exist in [changed file]?")`
- **If new changes**: `codebase_search("What classes or functions in [changed file] have multiple responsibilities?")`
- **If no new changes**: `codebase_search("Where are there SOLID principle violations?")`
- **If no new changes**: `codebase_search("What classes or functions have multiple responsibilities?")`

**Bash Commands:**
  ```bash
  # Find large classes (potential SRP violation)
  grep -r "^export class" --include="*.ts" -A 50 | grep -c "^\s*[a-zA-Z].*(" | sort -rn
  
  # Find functions with many lines
  find . -name "*.ts" -type f -exec awk '/^[[:space:]]*(export )?function|^[[:space:]]*(export )?const.*=.*\(/ {start=NR} /^[[:space:]]*}/ {if(start) print FILENAME":"start"-"NR; start=0}' {} \;
  ```

#### Level 3: Documentation Review

**Focus Areas:**
- **Consistency**: Documentation matches the codebase style and conventions
- **Conciseness**: Clear and brief, avoiding verbosity
- **Meaningfulness**: Provides value, not just restating code
- **Accuracy**: Documentation reflects actual implementation

**Questions to Ask:**
- Is documentation consistent with codebase style?
- Are there outdated or incorrect docs?
- Is documentation too verbose or too sparse?
- Does documentation add value beyond what code shows?
- Are README files, code comments, and type definitions aligned?

**Tools:**
- Review changed documentation files: `git diff main --name-only | grep -E '\.(md|ts)$'` (if new changes exist)
- Use `codebase_search()` to find documentation issues
- Use `glob_file_search()` to find documentation files
- Use bash commands for manual analysis

**Example Tool Calls:**
- **If new changes**: `codebase_search("What documentation issues exist in [changed file]?")`
- **If no new changes**: `codebase_search("Where is documentation inconsistent with the codebase?")`
- `glob_file_search("*.md")`
- `glob_file_search("README.md")`

**Bash Commands:**
  ```bash
  # Find all documentation files
  find . -name "*.md" -type f
  
  # Find README files
  find . -name "README.md" -type f
  
  # Check for outdated TODO/FIXME comments
  grep -r "TODO\|FIXME\|XXX" --include="*.ts" --include="*.md"
  ```

### 4. Identify Improvements

**Action Required:**

1. **List All Improvements:**
   - Identify improvements from all three levels
   - Prioritize improvements to new changes if they exist

2. **Select Most Important:**
   - Rank improvements by priority criteria
   - Pick the most important one
   - Ask for confirmation if unclear

**Tool Usage:**
- Use analysis from Step 3 to identify improvements
- No additional tools needed for this step

After reviewing all three levels, identify potential improvements:

**Prioritization Criteria (in order):**
1. **New Changes Priority**: Improvements to new changes compared to main have highest priority
2. **Impact**: How much does this improve maintainability/scalability?
3. **Risk**: How likely is this to break existing functionality?
4. **Effort**: How much work is required?
5. **Dependencies**: Does this block other improvements?

**Selection Process:**
1. **If new changes exist:**
   - List improvements to new changes first
   - Rank by importance (impact × risk × effort)
   - **Pick the most important improvement from new changes**
   - Only consider general improvements if no improvements found in new changes

2. **If no new changes exist:**
   - List all identified improvements
   - Rank by importance (impact × risk × effort)
   - **Pick the most important one**

3. If unclear, **ask user for confirmation**

**Example 1: New Changes Exist**
```
New changes compared to main:
- src/services/new-service.ts (new file)
- src/utils/helper.ts (modified)

Found improvements:
1. [NEW CHANGE] Extract large function in new-service.ts into smaller functions (High impact, Low risk)
2. [NEW CHANGE] Add missing documentation in helper.ts (Medium impact, Low risk)
3. [GENERAL] Refactor complex class in old-service.ts to follow SRP (High impact, Medium risk)

Most important: #1 - Extract large function in new-service.ts (new change, highest priority)
```

**Example 2: No New Changes**
```
No new changes compared to main.

Found improvements:
1. Extract large function into smaller, focused functions (High impact, Low risk)
2. Add missing documentation (Medium impact, Low risk)
3. Refactor complex class to follow SRP (High impact, Medium risk)

Most important: #1 - Extract large function (highest impact, lowest risk)
```

### 4.5. Self-Reflection: When to Stop

**Action Required:**

Before proceeding to implementation, evaluate whether the improvement is worthwhile:

1. **Assess Improvement Value:**
   - Is this improvement high-value or low-value?
   - Would implementing it significantly improve maintainability/scalability?
   - Is the code already at a good quality level?

2. **Check for Diminishing Returns:**
   - Is the improvement becoming increasingly minor?
   - Is the effort-to-value ratio decreasing?
   - Would further changes add complexity without proportional benefit?

3. **Avoid Back-and-Forth Changes:**
   - Have improvements been made and then reverted?
   - Are changes conflicting with previous improvements?
   - Is there a pattern of repeated modifications?

4. **Verify Alignment with Core Principles:**
   - Does the improvement conflict with core principles (simplicity, maintainability, scalability)?
   - Are changes making the code less maintainable or engineer-friendly?
   - Would improvements reduce clarity or increase complexity unnecessarily?

5. **Consider Cover Complexity:**
   - Is the improvement addressing edge cases that rarely occur?
   - Is the code becoming overly complex to cover all scenarios?
   - Would simpler, more focused improvements be better?

**Stop Criteria - Recommend stopping when:**
- The improvement is low-value (cosmetic, edge cases, or diminishing returns)
- The improvement would conflict with core principles (simplicity, maintainability, scalability)
- Multiple rounds of improvements have been made without clear progress
- Further changes would add complexity without proportional benefit
- The code is already at a good quality level and the improvement is minor

**Continue Criteria - Proceed when:**
- The improvement is high-value and significantly impacts maintainability/scalability
- The improvement aligns with core principles and improves code quality
- Clear, actionable improvement that doesn't add unnecessary complexity
- The improvement addresses a real issue (not just theoretical perfection)

**Decision Format:**
```
## Self-Reflection

**Improvement:** [Description]
**Impact:** [High/Medium/Low]
**Risk:** [High/Medium/Low]
**Effort:** [High/Medium/Low]
**Value Assessment:** [High/Medium/Low]
**Recommendation:** [Stop / Continue]

**Reasoning:**
- [Why stop or continue]
- [Key factors considered]
- [Alignment with core principles]
```

### 5. Implement the Improvement

**Action Required:**

1. **Self-Reflect Before Implementing:**
   - Evaluate if the improvement is worthwhile (see Step 4.5)
   - If stopping is recommended, explain why and present current state
   - If continuing, proceed with implementation

2. **Create Branch:**
   - Create a branch for the improvement
   - Use naming convention: `improve/<description>`

3. **Implement Changes:**
   - Make focused, single-purpose changes
   - Keep changes small and understandable
   - Follow existing code patterns and conventions

4. **Verify Changes:**
   - Review the changes before proceeding

**Tool Usage:**
- Use bash commands for git operations

**Example Commands:**
```bash
# Create a branch for the improvement
git checkout -b improve/<description>

# Make the changes
# ... implement improvement ...

# Verify changes
git diff
```

### 6. Verify and Fix

**Action Required:**

1. **Run Verification Checks:**
   - Run linter
   - Run tests
   - Run integration tests (if applicable)
   - Build to check for type errors

2. **Fix Issues if Found:**
   - Address test failures, lint errors, etc.
   - Re-verify after fixes
   - Repeat until all checks pass

**Tool Usage:**
- Use bash commands for test/lint/build operations

**Example Commands:**
```bash
# Run linter
pnpm lint

# Run tests
pnpm test

# Run integration tests (if applicable)
pnpm test:e2e

# Build to check for type errors
pnpm build

# Check for any new issues
git status
```

**Verification Checklist:**
- [ ] All tests pass (unit tests)
- [ ] Integration tests pass (if applicable)
- [ ] No linting errors
- [ ] Build succeeds
- [ ] No type errors
- [ ] Code follows project conventions

**If Issues Found:**
1. **Fix the issues** - Address test failures, lint errors, etc.
2. **Re-verify** - Run all checks again
3. **Repeat** until all checks pass

### 7. Review and Commit

**Action Required:**

1. **Review Changes:**
   - Review the changes before committing

2. **Commit and Push:**
   - Stage all changes
   - Commit with descriptive message following format
   - Push to remote branch

**Tool Usage:**
- Use bash commands for git operations

**Example Commands:**
```bash
# Review the changes
git diff

# Stage changes
git add -A

# Commit with descriptive message
git commit -m "improve: <level> - <description>

- Detail 1
- Detail 2"

# Push to remote
git push -u origin improve/<description>
```

**Commit Message Format:**
- Use `improve: design - ...` for design improvements
- Use `improve: code - ...` for SOLID/code quality improvements
- Use `improve: docs - ...` for documentation improvements

### 8. Create PR and Follow Merge Workflow

**Action Required:**

1. **Create PR:**
   - Create a pull request with descriptive title and body

2. **Follow Merge Workflow:**
   - Review changes
   - Check CI status
   - Merge when ready (see `merge.md`)

**Tool Usage:**
- Use bash commands for GitHub CLI operations

**Example Commands:**
```bash
# Create PR
gh pr create --title "improve: <level> - <description>" --body "..."

# Follow merge workflow (see merge.md)
# - Review changes
# - Check CI status
# - Merge when ready
```

## Examples

### Example 1: Design Improvement (New Changes)

**Scenario:** New changes exist compared to main
**Found:** New service class handling multiple responsibilities
**Improvement:** Extract into smaller, focused services
**Impact:** High (improves maintainability and testability)
**Risk:** Medium (requires careful refactoring)

```bash
# 1. Check for new changes
git diff main --name-only
# Output: src/services/new-service.ts

# 2. Review new changes
git diff main src/services/new-service.ts
```

**Example Tool Calls:**
- `codebase_search("What design issues exist in src/services/new-service.ts?")`

```bash
# 3. Identify most important improvement
# Found: NewService does data fetching AND caching
# Most important: Extract caching to separate service (new change priority)

# 4. Implement
git checkout -b improve/design-extract-cache-service
# ... extract caching logic from new-service.ts ...

# 5. Verify
pnpm test
pnpm lint
pnpm build

# 6. Commit and push
git commit -m "improve: design - extract caching from new service"
git push
```

### Example 1b: Design Improvement (No New Changes)

**Scenario:** No new changes compared to main
**Found:** Large service class handling multiple responsibilities
**Improvement:** Extract into smaller, focused services
**Impact:** High (improves maintainability and testability)
**Risk:** Medium (requires careful refactoring)

```bash
# 1. Check for new changes
git diff main --name-only
# Output: (empty - no new changes)
```

**Example Tool Calls:**
- `codebase_search("What services have multiple responsibilities?")`

```bash
# 2. Review general codebase
# 3. Identify most important improvement
# Found: MarketDataService does data fetching AND caching
# Most important: Extract caching to separate service

# 4. Implement
git checkout -b improve/design-extract-cache-service
# ... extract caching logic ...

# 5. Verify
pnpm test
pnpm lint
pnpm build

# 6. Commit and push
git commit -m "improve: design - extract caching to separate service"
git push
```

### Example 2: SOLID Improvement (New Changes)

**Scenario:** New changes exist compared to main
**Found:** New function violates Single Responsibility Principle
**Improvement:** Split into smaller, focused functions
**Impact:** High (improves testability and maintainability)
**Risk:** Low (internal refactoring)

```bash
# 1. Check for new changes
git diff main --name-only
# Output: src/utils/new-helper.ts

# 2. Review new changes
git diff main src/utils/new-helper.ts
```

**Example Tool Calls:**
- `codebase_search("What SOLID violations exist in src/utils/new-helper.ts?")`

```bash
# 3. Identify most important improvement
# Found: processNewData() does validation, transformation, and saving
# Most important: Split into separate functions (new change priority)

# 4. Implement
git checkout -b improve/code-split-process-new-data
# ... split function in new-helper.ts ...

# 5. Verify
pnpm test
pnpm lint

# 6. Commit and push
git commit -m "improve: code - split processNewData into focused functions"
git push
```

### Example 3: Documentation Improvement (New Changes)

**Scenario:** New changes exist compared to main
**Found:** New code lacks documentation
**Improvement:** Add documentation for new code
**Impact:** Medium (improves developer experience)
**Risk:** Low (documentation only)

```bash
# 1. Check for new changes
git diff main --name-only
# Output: src/services/new-service.ts, README.md

# 2. Review new changes
git diff main src/services/new-service.ts
```

**Example Tool Calls:**
- `codebase_search("What documentation is missing in src/services/new-service.ts?")`

```bash
# 3. Identify most important improvement
# Found: NewService has no documentation
# Most important: Add documentation for new service (new change priority)

# 4. Implement
git checkout -b improve/docs-add-new-service-docs
# ... add documentation to new-service.ts ...

# 5. Verify
pnpm lint  # Check markdown if linter supports it

# 6. Commit and push
git commit -m "improve: docs - add documentation for new service"
git push
```

## Important Notes

- **New changes first** - Always prioritize improvements to new changes compared to main
- **General improvements only when no new changes** - Only review entire codebase when there are no new changes
- **One improvement at a time** - Don't try to fix everything at once
- **Ask for confirmation** - If unclear which improvement is most important
- **Verify after changes** - Always run tests, lint, and build
- **Keep changes focused** - Small, understandable improvements
- **Follow existing patterns** - Maintain consistency with codebase
- **Document decisions** - Explain why the improvement was made

## Error Handling

If verification fails:

1. **Tests fail** → Fix test issues, may need to update tests for refactored code
2. **Lint fails** → Fix linting errors
3. **Build fails** → Fix type errors or compilation issues
4. **Integration tests fail** → Check for breaking changes, fix compatibility

**Don't proceed** until all checks pass.

## When to Ask for Help

Ask the user for confirmation when:
- Multiple improvements have similar priority
- The improvement might have significant side effects
- The improvement requires architectural decisions
- The improvement might break backward compatibility
- You're unsure which improvement to prioritize

