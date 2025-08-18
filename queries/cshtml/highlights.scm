; Keywords and operators
"@" @operator
"@page" @keyword
"@if" @keyword.conditional
"@for" @keyword.repeat
"@foreach" @keyword.repeat
"@while" @keyword.repeat
"@functions" @keyword
"else" @keyword.conditional
"in" @keyword.repeat
"var" @keyword

; Directives
(page_directive_path) @string

; Punctuation
"{" @punctuation.bracket
"}" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket
";" @punctuation.delimiter

; Comments
(comment) @comment

; HTML
(tag_name) @tag
(attribute_name) @property
(attribute_value) @string
(text) @text

; C# content
(raw_csharp) @embedded
(raw_csharp_statement) @embedded
(for_expression) @embedded

; Identifiers
(identifier) @variable
(member_access_token) @variable.member 
