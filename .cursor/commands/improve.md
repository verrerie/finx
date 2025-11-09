# Improve Command

This command guides the AI agent through a systematic code review and improvement process at three levels: design, code quality (SOLID principles), and documentation.

## Core Principles

**Important: Improve only one thing at a time**

- If multiple improvements are found, pick the **most important one**
- If it's not clear which is most important, **ask for confirmation**
- After implementation, verify and fix any test, lint, or integration failures
- Focus on **simplicity over cleverness**
- Prioritize **maintainability, scalability, and engineer-friendliness**

## Workflow Steps

### 1. Review Current Codebase

Start by understanding the current state:

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

### 2. Review at Three Levels

Analyze the codebase systematically at each level:

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
- Use AI tool `codebase_search` to find complex patterns:
  - "Where are there overly complex implementations or patterns?"
  - "What parts of the codebase are difficult to understand or modify?"
- Use bash commands for manual analysis:
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
- Use AI tool `codebase_search` to find SOLID violations:
  - "Where are there SOLID principle violations?"
  - "What classes or functions have multiple responsibilities?"
- Use bash commands for manual analysis:
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
- Use AI tool `codebase_search` to find documentation issues:
  - "Where is documentation inconsistent with the codebase?"
- Use AI tool `glob_file_search` to find documentation files:
  - `glob_file_search "*.md"`
  - `glob_file_search "README.md"`
- Use bash commands for manual analysis:
  ```bash
  # Find all documentation files
  find . -name "*.md" -type f
  
  # Find README files
  find . -name "README.md" -type f
  
  # Check for outdated TODO/FIXME comments
  grep -r "TODO\|FIXME\|XXX" --include="*.ts" --include="*.md"
  ```

### 3. Identify Improvements

After reviewing all three levels, identify potential improvements:

**Prioritization Criteria:**
1. **Impact**: How much does this improve maintainability/scalability?
2. **Risk**: How likely is this to break existing functionality?
3. **Effort**: How much work is required?
4. **Dependencies**: Does this block other improvements?

**Selection Process:**
1. List all identified improvements
2. Rank by importance (impact × risk × effort)
3. **Pick the most important one**
4. If unclear, **ask user for confirmation**

**Example:**
```
Found improvements:
1. Extract large function into smaller, focused functions (High impact, Low risk)
2. Add missing documentation (Medium impact, Low risk)
3. Refactor complex class to follow SRP (High impact, Medium risk)

Most important: #1 - Extract large function (highest impact, lowest risk)
```

### 4. Implement the Improvement

Once the improvement is selected:

```bash
# Create a branch for the improvement
git checkout -b improve/<description>

# Make the changes
# ... implement improvement ...

# Verify changes
git diff
```

**Implementation Guidelines:**
- Make focused, single-purpose changes
- Keep changes small and understandable
- Follow existing code patterns and conventions
- Don't introduce breaking changes unless necessary
- Maintain backward compatibility when possible

### 5. Verify and Fix

After implementation, verify everything works:

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

### 6. Review and Commit

Once everything passes:

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

### 7. Create PR and Follow Merge Workflow

After pushing, create a PR and follow the merge workflow:

```bash
# Create PR
gh pr create --title "improve: <level> - <description>" --body "..."

# Follow merge workflow (see merge.md)
# - Review changes
# - Check CI status
# - Merge when ready
```

## Examples

### Example 1: Design Improvement

**Found:** Large service class handling multiple responsibilities
**Improvement:** Extract into smaller, focused services
**Impact:** High (improves maintainability and testability)
**Risk:** Medium (requires careful refactoring)

```bash
# 1. Review
codebase_search "What services have multiple responsibilities?"

# 2. Identify most important improvement
# Found: MarketDataService does data fetching AND caching
# Most important: Extract caching to separate service

# 3. Implement
git checkout -b improve/design-extract-cache-service
# ... extract caching logic ...

# 4. Verify
pnpm test
pnpm lint
pnpm build

# 5. Commit and push
git commit -m "improve: design - extract caching to separate service"
git push
```

### Example 2: SOLID Improvement

**Found:** Function violates Single Responsibility Principle
**Improvement:** Split into smaller, focused functions
**Impact:** High (improves testability and maintainability)
**Risk:** Low (internal refactoring)

```bash
# 1. Review
codebase_search "What functions have multiple responsibilities?"

# 2. Identify most important improvement
# Found: processMarketData() does validation, transformation, and saving
# Most important: Split into separate functions

# 3. Implement
git checkout -b improve/code-split-process-market-data
# ... split function ...

# 4. Verify
pnpm test
pnpm lint

# 5. Commit and push
git commit -m "improve: code - split processMarketData into focused functions"
git push
```

### Example 3: Documentation Improvement

**Found:** README is outdated and inconsistent with codebase
**Improvement:** Update README to match current implementation
**Impact:** Medium (improves developer experience)
**Risk:** Low (documentation only)

```bash
# 1. Review
read_file README.md
codebase_search "What has changed since README was written?"

# 2. Identify most important improvement
# Found: README shows old API structure
# Most important: Update API documentation section

# 3. Implement
git checkout -b improve/docs-update-readme-api
# ... update README ...

# 4. Verify
pnpm lint  # Check markdown if linter supports it

# 5. Commit and push
git commit -m "improve: docs - update README API documentation"
git push
```

## Important Notes

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

