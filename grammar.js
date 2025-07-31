module.exports = grammar(
  {
    name: "cshtml",
    conflicts: ($) => [
      [$._block, $._html],
    ],
    externals: ($) => [$._eof],
    extras: ($) => [$.comment, /\s+/],
    word: ($) => $.identifier,

    rules: {
      document: ($) => repeat($._block),
      _block: ($) =>
        choice(
          $.page_directive,
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
        seq(
          "@page",
          $.page_directive_path,
          optional($._newline)
        ),
      page_directive_path: ($) => seq('"', repeat(/[^"]/), '"'),
      code_block: ($) => seq("@{", repeat($._statement), "}"),

      functions_directive: ($) =>
        seq("@functions", "{", repeat($._statement), "}"),
      expression_block: ($) =>
        choice(
          seq("@(", repeat($._expression), ")"),
          seq(
            "@",
            choice(
              $.member_access,
              $.identifier,
              $.parenthesized_expression
            )
          )
        ),
      html_block: ($) => prec.right(repeat1($._html)),
      _html: ($) => choice(
        seq($.tag),
        seq($.text),
        seq($.expression_block)
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
      text: ($) => /[^<>@ \t\r\n][^<>@]*/,

      // C# statements and expressions will be replaced with injections
      _statement: ($) => choice($.raw_csharp), // Placeholder
      _expression: ($) => choice($.raw_csharp), // Placeholder
      raw_csharp: ($) => prec.right(repeat1(/./)), // Catch-all for now
      // Control structures
      if_statement: ($) =>
        prec.right(
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
        seq("else if", "(", $._expression, ")", "{", optional($.html_block), "}"),
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
        seq(
          choice("case", "default"),
          optional($._expression),
          ":",
          repeat($._statement)
        ),

      for_statement: ($) =>
        seq(
          "@for",
          "(",
          optional($._expression),
          ";",
          optional($._expression),
          ";",
          optional($._expression),
          ")",
          "{",
          optional($.html_block),
          "}"
        ),

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
        seq($.identifier, repeat1(seq(".", $.identifier))),
    },
  }
);
