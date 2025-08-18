# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tree-sitter parser for C# HTML (cshtml) Razor files, which combine HTML markup with C# code in ASP.NET applications. The grammar handles Razor syntax including directives, code blocks, expressions, and control flow statements while injecting C# and HTML parsers for their respective sections.

## Development Commands

### Building and Testing
- `tree-sitter generate` - Generate parser from grammar.js
- `tree-sitter build` - Build the parser library
- `tree-sitter test` - Run all corpus tests
- `tree-sitter build --wasm` - Build WebAssembly version
- `tree-sitter playground` - Launch interactive playground
- `npm test` - Run Node.js binding tests
- `make` - Build C library (Unix/Linux/macOS only)
- `make test` - Run tests via Makefile

### Node.js Development
- `npm run prestart` - Build WASM for playground
- `npm run start` - Launch tree-sitter playground
- `npm install` - Install dependencies and build native bindings

### Language Bindings
- **Rust**: `cargo build`, `cargo test`
- **Python**: Tests in `bindings/python/tests/`
- **Go**: Tests in `bindings/go/binding_test.go`
- **Swift**: Tests in `bindings/swift/TreeSitterCsHtmlTests/`

## Architecture

### Core Grammar Structure
- **grammar.js**: Main grammar definition with cshtml rules
- **src/scanner.c**: External scanner for context-sensitive parsing
- **src/parser.c**: Generated LR parser (auto-generated, don't edit)
- **src/grammar.json**: Generated grammar metadata (auto-generated)

### Language Injections
The parser uses tree-sitter-c-sharp and tree-sitter-html for embedded content:
- **queries/injections-csharp.scm**: Injects C# parser for code blocks and expressions
- **queries/injections-html.scm**: Injects HTML parser for markup sections
- **queries/highlights.scm**: Syntax highlighting queries for editors

### Key Grammar Features
- Razor directives (`@page`, `@model`, `@using`, etc.)
- Code blocks (`@{ ... }`) with full C# syntax
- Expression blocks (`@(...)` and implicit `@variable`)
- Control flow (`@if`, `@for`, `@foreach`, `@while`, `@switch`)
- HTML content with Razor expressions embedded

### Test Structure
- **test/corpus/razor.txt**: Parser test cases in tree-sitter format
- Tests follow tree-sitter corpus format: test name, input, expected tree

### Multi-Language Bindings
The parser generates bindings for C, Go, Node.js, Python, Rust, and Swift. Each binding includes:
- Generated parser code
- Language-specific wrapper/binding code
- Test files demonstrating usage

## Key Dependencies
- **tree-sitter-c-sharp**: C# language parsing for code sections
- **tree-sitter-html**: HTML parsing for markup sections
- **tree-sitter-cli**: Development and testing tools

## Development Notes
- Grammar conflicts are explicitly declared in grammar.js conflicts section
- External scanner handles context-sensitive parsing (currently minimal)
- The parser focuses on structural parsing; semantic analysis happens in language servers
- Windows development requires WSL or similar environment (Makefile doesn't support Windows)