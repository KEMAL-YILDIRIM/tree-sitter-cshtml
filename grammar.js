module.exports = grammar(
  {
    name: "cshtml",
    conflicts: ($) => [
      [$._block, $._html],
      [$.text, $.expression_block],
      [$._html, $.switch_case],
    ],
    externals: ($) => [],
    extras: ($) => [$.comment, /\s+/],
    word: ($) => $.identifier,

    rules: {
      document: ($) => repeat($._block),
      _block: ($) =>
        choice(
          $.page_directive,
          $.model_directive,
          $.using_directive,
          $.inject_directive,
          $.layout_directive,
          $.section_directive,
          $.code_block,
          $.functions_directive,
          $.expression_block,
          $.html_block,
          $.if_statement,
          $.switch_statement,
          $.for_statement,
          $.foreach_statement,
          $.while_statement,
          $.try_statement
        ),

      page_directive: ($) =>
        choice(
          seq("@page", $.page_directive_path, optional($._newline)),
          prec(-1, seq("@page", optional($._newline)))
        ),
      page_directive_path: ($) => seq('"', repeat(/[^"]/), '"'),
      
      model_directive: ($) =>
        seq(
          "@model",
          $.type_name,
          optional($._newline)
        ),
      
      using_directive: ($) =>
        seq(
          "@using",
          $.namespace_name,
          optional($._newline)
        ),
      
      inject_directive: ($) =>
        seq(
          "@inject",
          $.type_name,
          $.identifier,
          optional($._newline)
        ),
      
      layout_directive: ($) =>
        seq(
          "@layout",
          choice($.string_literal, $.identifier),
          optional($._newline)
        ),
      
      section_directive: ($) =>
        seq(
          "@section",
          $.identifier,
          "{",
          optional($.html_block),
          "}"
        ),
      
      type_name: ($) => /[a-zA-Z_][a-zA-Z0-9_.<>]*\??/,
      namespace_name: ($) => /[a-zA-Z_][a-zA-Z0-9_.]*/,
      string_literal: ($) => choice(
        seq('"', repeat(/[^"]/), '"'),
        seq("'", repeat(/[^']/), "'")
      ),
      code_block: ($) => seq("@{", repeat($.code_statement), "}"),
      code_statement: ($) => choice($.raw_csharp_statement),
      raw_csharp_statement: ($) => /[^}]+/,

      functions_directive: ($) =>
        seq("@functions", "{", repeat(choice($.csharp_code, $.csharp_block)), "}"),
      csharp_code: ($) => /[^{}]+/,
      csharp_block: ($) => seq("{", repeat(choice($.csharp_code, $.csharp_block)), "}"),
      expression_block: ($) =>
        choice(
          seq("@(", $._expression, ")"),
          $.implicit_expression
        ),
      implicit_expression: ($) =>
        seq("@", $.identifier_or_member_access),
      identifier_or_member_access: ($) =>
        choice(
          $.member_access_token,
          $.identifier
        ),
      member_access_token: ($) => /[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)+/,
      html_block: ($) => prec.right(repeat1($._html)),
      _html: ($) => choice(
        $.tag,
        $.text,
        $.expression_block
      ),
      comment: ($) => seq("@*", repeat(/[^*]*\*+([^@][^*]*\*+)* /), "@"),
      tag: ($) =>
        choice(
          seq(
            "<",
            field("name", $.tag_name),
            repeat($.attribute),
            choice(">", "/>")
          ),
          seq("</", field("name", $.tag_name), ">")
        ),
      tag_name: ($) => /[a-zA-Z0-9\-_]+/,
      attribute: ($) =>
        seq(
          field("name", $.attribute_name),
          optional(seq("=", field("value", $.attribute_value)))
        ),
      attribute_name: ($) => /[a-zA-Z0-9\-_]+/,
      attribute_value: ($) =>
        choice(
          seq('"', repeat(/[^"]/), '"'),
          seq("'", repeat(/[^']/), "'"),
          /[^ \t\r\n>]+/
        ),
      text: ($) => prec(-1, /[^<@]+/),

      // C# statements and expressions will be replaced with injections
      _statement: ($) => choice($.csharp_statement),
      _expression: ($) => choice($.raw_csharp),
      raw_csharp: ($) => /[^});\n]+/,
      csharp_statement: ($) => /[^}]+/,
      // Control structures
      if_statement: ($) =>
        prec.right(1,
          seq(
            "@if",
            "(",
            $._expression,
            ")",
            "{",
            optional($.html_block),
            "}",
            repeat($.else_if_clause),
            optional($.else_clause)
          )
        ),
      else_if_clause: ($) =>
        seq("else", "if", "(", $._expression, ")", "{", optional($.html_block), "}"),
      else_clause: ($) => seq("else", "{", optional($.html_block), "}"),
      switch_statement: ($) =>
        seq(
          "@switch",
          "(",
          $._expression,
          ")",
          "{",
          repeat($.switch_case),
          "}"
        ),
      switch_case: ($) =>
        choice(
          seq("case", $._expression, ":", repeat($._statement)),
          seq("default", ":", repeat($._statement))
        ),

      for_statement: ($) =>
        seq(
          "@for",
          "(",
          optional($.for_expression),
          ";",
          optional($.for_expression),
          ";",
          optional($.for_expression),
          ")",
          "{",
          optional($.html_block),
          "}"
        ),
      for_expression: ($) => /[^;)]+/,

      foreach_statement: ($) =>
        seq(
          "@foreach",
          "(",
          "var",
          $.identifier,
          "in",
          $._expression,
          ")",
          "{",
          optional($.html_block),
          "}"
        ),
      while_statement: ($) =>
        seq(
          "@while",
          "(",
          $._expression,
          ")",
          "{",
          optional($.html_block),
          "}"
        ),
      try_statement: ($) =>
        seq(
          "@try",
          "{",
          repeat($._block),
          "}",
          repeat($.catch_clause),
          optional($.finally_clause)
        ),
      catch_clause: ($) =>
        seq(
          "catch",
          optional(seq("(", $.identifier, optional($.identifier), ")")),
          "{",
          repeat($._block),
          "}"
        ),
      finally_clause: ($) => seq("finally", "{", repeat($._block), "}"),

      _newline: ($) => choice("\n", "\r", "\r\n"),
      identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
      parenthesized_expression: ($) =>
        seq("(", repeat($._expression), ")"),
      member_access: ($) =>
        prec.left(2, seq($.identifier, repeat1(seq(".", $.identifier)))),
    },
  }
);
