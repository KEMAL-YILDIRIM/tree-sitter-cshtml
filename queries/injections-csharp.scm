; C# injections for various Razor constructs

; Type references in @model, @inject directives
((csharp_type_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

; Using statements
((csharp_using_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

; Code blocks @{ ... }
((csharp_code_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

; Inline expressions @(...)
((csharp_expression_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

; Simple expressions @Model.Property
((csharp_simple_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

; Control structure expressions
((csharp_foreach_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

((csharp_for_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

((csharp_using_statement_injection) @injection.content
 (#set! injection.language "c_sharp")
 (#set! injection.include-children))

; HTML content injection
((html_content) @injection.content
 (#set! injection.language "html")
 (#set! injection.include-children))

; HTML in razor blocks (when not containing Razor syntax)
((razor_block 
  (html_content)) @injection.content
 (#set! injection.language "html")
 (#set! injection.include-children))
