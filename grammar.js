/**
 * @file C# html parser for cshtml and razor files
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'cshtml',

  // Use external scanners from HTML and C#
  externals: ($) => [
    $._html_scanner,
    $._csharp_scanner
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.html_content,
      $.razor_directive,
      $.razor_expression,
      $.razor_block
    )),

    html_content: $ => /[^@]+/,

    razor_directive: $ => seq(
      '@',
      choice(
        'page',
        'model',
        'using',
        'inject',
        'implements',
        'inherits'
      ),
      optional($._csharp_expression)
    ),

    razor_expression: $ => seq(
      '@',
      choice(
        $._csharp_expression,
        seq('(', $._csharp_expression, ')')
      )
    ),

    razor_block: $ => seq(
      '@{',
      repeat($._csharp_statement),
      '}'
    ),

    _csharp_expression: $ => external('c_sharp_expression'),
    _csharp_statement: $ => external('c_sharp_statement')
  }
})
