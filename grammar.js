module.exports = grammar({
  name: "cshtml",

  extras: ($) => [/\s/, $.razor_comment],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) =>
      choice(
        $.html_content,
        $.razor_directive,
        $.razor_code_block,
        $.razor_expression,
        $.razor_control_structure,
        $.text,
      ),

    // HTML content sections - will be injected by HTML parser
    html_content: ($) =>
      prec.right(
        repeat1(
          choice(
            /[^@]+/,
            seq("@", choice("@@", /[^a-zA-Z_{(]/)), // Escaped @ or non-Razor @
          ),
        ),
      ),

    // Razor directives
    razor_directive: ($) =>
      seq(
        "@",
        choice(
          $.page_directive,
          $.model_directive,
          $.using_directive,
          $.inject_directive,
          $.layout_directive,
          $.section_directive,
        ),
      ),

    page_directive: ($) => seq("page", optional(seq(/\s+/, $.string_literal))),

    model_directive: ($) => seq("model", /\s+/, $.csharp_type_injection),

    using_directive: ($) => seq("using", /\s+/, $.csharp_using_injection),

    inject_directive: ($) =>
      seq("inject", /\s+/, $.csharp_type_injection, /\s+/, $.identifier),

    layout_directive: ($) =>
      seq("layout", optional(seq(/\s+/, choice($.string_literal, "null")))),

    section_directive: ($) =>
      seq(
        "section",
        /\s+/,
        $.identifier,
        optional(seq(/\s+/, "{", repeat($._item), "}")),
      ),

    // Code blocks @{ ... }
    razor_code_block: ($) => seq("@{", $.csharp_code_injection, "}"),

    // Inline expressions
    razor_expression: ($) =>
      choice(
        seq("@(", $.csharp_expression_injection, ")"),
        seq("@", $.csharp_simple_injection),
      ),

    // Control structures
    razor_control_structure: ($) =>
      choice(
        $.razor_if,
        $.razor_foreach,
        $.razor_for,
        $.razor_while,
        $.razor_using,
        $.razor_try,
        $.razor_switch,
      ),

    razor_try: ($) =>
      seq(
        "@try",
        "{",
        $.razor_block,
        "}",
        "catch",
        "{",
        $.razor_block,
        "}",
        optional(seq(
        "finally",
        "{",
        $.razor_block,
        "}",
        )),
      ),

    razor_if: ($) =>
      seq(
        "@if",
        "(",
        $.csharp_expression_injection,
        ")",
        $.razor_block,
        optional(repeat($.razor_else_if)),
        optional($.razor_else),
      ),

    razor_else_if: ($) =>
      seq(
        "else",
        /\s+/,
        "if",
        "(",
        $.csharp_expression_injection,
        ")",
        $.razor_block,
      ),

    razor_else: ($) => seq("else", $.razor_block),

    razor_foreach: ($) =>
      seq("@foreach", "(", $.csharp_foreach_injection, ")", $.razor_block),

    razor_for: ($) =>
      seq("@for", "(", $.csharp_for_injection, ")", $.razor_block),

    razor_while: ($) =>
      seq("@while", "(", $.csharp_expression_injection, ")", $.razor_block),

    razor_using: ($) =>
      seq(
        "@using",
        "(",
        $.csharp_using_statement_injection,
        ")",
        $.razor_block,
      ),

    razor_switch: ($) =>
      seq(
        "@switch",
        "(",
        $.csharp_expression_injection,
        ")",
        "{",
        repeat(choice($.razor_case, $.razor_default)),
        "}",
      ),

    razor_case: ($) =>
      seq("case", $.csharp_expression_injection, ":", repeat($._item)),

    razor_default: ($) => seq("default:", repeat($._item)),

    razor_block: ($) => choice(seq("{", repeat($._item), "}"), $._item),

    // Injection points for C# content
    csharp_type_injection: ($) => /[^\r\n@]+/,
    csharp_using_injection: ($) => /[^\r\n@;]+/,
    csharp_code_injection: ($) => /[^}]*/,
    csharp_expression_injection: ($) => /[^)]+/,
    csharp_simple_injection: ($) =>
      /[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/,
    csharp_foreach_injection: ($) => /[^)]+/,
    csharp_for_injection: ($) => /[^)]+/,
    csharp_using_statement_injection: ($) => /[^)]+/,

    // Basic tokens
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    string_literal: ($) =>
      choice(seq('"', /[^"]*/, '"'), seq("'", /[^']*/, "'")),
    text: ($) => /[^@<]+/,

    // Razor comments
    razor_comment: ($) => seq("@*", /[^*]*\*+([^@*][^*]*\*+)*/, "@"),
  },
});
