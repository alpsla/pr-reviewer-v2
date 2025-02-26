# Prompt Engineering Guidelines

This document outlines the prompt engineering approach for the PR Reviewer application.

## Prompt Structure

Our prompts follow a consistent structure to maximize LLM effectiveness:

```
[CONTEXT]
PR metadata, file context, and relevant information

[TASK]
Specific task for the LLM to perform

[FORMAT]
Required output format

[EXAMPLES]
Example inputs and outputs

[OUTPUT]
The LLM response starts here
```

## Base Templates

### Code Review Template

```
[CONTEXT]
You are performing a code review for a Pull Request with the following metadata:
Title: {pr_title}
Description: {pr_description}
Repository: {repo_name}
File: {file_path}
Language: {language}

The code changes are:
```diff
{diff_content}
```

[TASK]
Review this code change and identify issues in the following categories:
- Code quality (readability, maintainability)
- Potential bugs or edge cases
- Performance considerations
- Security vulnerabilities
- Architectural concerns
- Best practices for {language}

[FORMAT]
Respond in JSON format with the following structure:
{
  "summary": "Brief summary of the changes",
  "issues": [
    {
      "category": "One of: quality|bug|performance|security|architecture|best_practice",
      "severity": "One of: critical|high|medium|low|suggestion",
      "line_numbers": [line numbers affected],
      "description": "Description of the issue",
      "suggestion": "Suggested fix or improvement"
    }
  ],
  "positive_aspects": ["List of positive aspects of the code change"]
}

[EXAMPLES]
Input: A PR that adds a function without proper error handling
Output:
{
  "summary": "This PR adds a new user authentication function",
  "issues": [
    {
      "category": "bug",
      "severity": "high",
      "line_numbers": [24, 25],
      "description": "No error handling for network failures",
      "suggestion": "Add try/catch block and handle network exceptions"
    }
  ],
  "positive_aspects": ["Good function documentation", "Clear variable names"]
}
```

### Security Analysis Template

```
[CONTEXT]
You are performing a security analysis for a Pull Request with the following metadata:
Title: {pr_title}
Description: {pr_description}
Repository: {repo_name}
File: {file_path}
Language: {language}

The code changes are:
```diff
{diff_content}
```

[TASK]
Analyze this code for security vulnerabilities in the following categories:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication issues
- Authorization flaws
- Data validation problems
- Sensitive data exposure
- Cryptographic vulnerabilities
- {language}-specific security issues

[FORMAT]
Respond in JSON format with the following structure:
{
  "vulnerability_count": number,
  "vulnerabilities": [
    {
      "type": "Vulnerability type",
      "severity": "One of: critical|high|medium|low",
      "line_numbers": [line numbers affected],
      "description": "Description of the vulnerability",
      "impact": "Potential impact of exploitation",
      "remediation": "How to fix the vulnerability"
    }
  ],
  "overall_risk": "One of: critical|high|medium|low|none"
}
```

### Performance Review Template

```
[CONTEXT]
You are performing a performance review for a Pull Request with the following metadata:
Title: {pr_title}
Description: {pr_description}
Repository: {repo_name}
File: {file_path}
Language: {language}

The code changes are:
```diff
{diff_content}
```

[TASK]
Analyze this code for performance considerations:
- Time complexity issues
- Memory usage concerns
- Resource leaks
- Inefficient algorithms or data structures
- Database query performance
- {language}-specific performance best practices

[FORMAT]
Respond in JSON format with the following structure:
{
  "performance_issues": [
    {
      "type": "Issue type",
      "severity": "One of: critical|high|medium|low",
      "line_numbers": [line numbers affected],
      "description": "Description of the performance issue",
      "impact": "Expected performance impact",
      "recommendation": "How to improve performance"
    }
  ],
  "optimization_opportunities": [
    {
      "description": "Potential optimization",
      "expected_improvement": "Estimated improvement",
      "complexity": "Implementation complexity"
    }
  ]
}
```

## Language-Specific Customizations

### JavaScript/TypeScript

Add these sections to the base templates:

```
- Properly typed function parameters and return values
- Use of modern ES6+ features appropriately
- React-specific best practices (if applicable)
- Proper handling of asynchronous code
- Avoidance of type coercion issues
```

### Python

Add these sections to the base templates:

```
- PEP 8 compliance
- Type hints usage (if applicable)
- Proper exception handling
- Efficient use of Python's built-in functions and libraries
- Use of context managers where appropriate
```

### Java

Add these sections to the base templates:

```
- Proper exception handling and resource management
- Effective use of Java collections framework
- Thread safety considerations
- Java coding conventions
- Appropriate use of OOP principles
```

## Context Optimization

To work within LLM context limitations:

1. **Prioritize Relevant Files**:
   - Focus on changed files with the most modifications
   - Include adjacent files only when necessary for context

2. **Truncate Large Diffs**:
   - For large files, include only changed sections plus 5-10 lines of context
   - Provide summaries of omitted sections

3. **Batch Processing Strategy**:
   - Split large PRs into logical batches
   - Process files by relationship (e.g., all frontend changes together)
   - Summarize findings from each batch in final report

4. **Contextual Information Hierarchy**:
   - Always include: PR title, description, file path, language
   - Include when relevant: repository history, related PRs
   - Include when space permits: coding standards, project architecture

## Prompt Testing and Optimization

We continuously improve prompts through:

1. **A/B Testing**:
   - Test multiple prompt variations against the same code
   - Measure quality of results using objective metrics

2. **Quality Metrics**:
   - False positive rate (incorrect issues identified)
   - False negative rate (missed issues)
   - Relevance of suggestions
   - Specificity of recommendations

3. **Feedback Loop**:
   - Collect user feedback on LLM responses
   - Track accepted vs. rejected suggestions
   - Incorporate successful patterns into prompt templates

## Implementation Notes

When implementing these prompts:

1. **Dynamic Insertion**:
   - Use placeholders for dynamic content
   - Sanitize inputs to avoid prompt injection

2. **Progressive Refinement**:
   - Start with general analysis
   - Follow up with targeted prompts for areas of concern

3. **Response Validation**:
   - Validate JSON responses against schemas
   - Have fallback parsing for malformed responses

4. **Token Management**:
   - Track token usage per request
   - Implement adaptive context sizing based on token limits

5. **Error Handling**:
   - Plan for graceful degradation when LLM errors occur
   - Provide meaningful error messages without exposing prompt details
