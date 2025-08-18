;; HTML Injection
(html_block) @injection.content
(#set! injection.language "html")

;; C# Injections
(raw_csharp_statement) @injection.content
(#set! injection.language "c_sharp")

(raw_csharp) @injection.content
(#set! injection.language "c_sharp")

(for_expression) @injection.content
(#set! injection.language "c_sharp")