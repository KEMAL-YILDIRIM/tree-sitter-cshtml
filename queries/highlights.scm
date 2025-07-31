; Keywords
( (at) @keyword)
( (keyword) @keyword)
( (if) @keyword.conditional)
( (else) @keyword.conditional)
( (switch) @keyword.conditional)
( (case) @keyword.conditional)
( (default) @keyword.conditional)
( (for) @keyword.repeat)
( (foreach) @keyword.repeat)
( (while) @keyword.repeat)
( (in) @keyword.repeat)
( (try) @keyword.exception)
( (catch) @keyword.exception)
( (finally) @keyword.exception)

; Directives
( (page_directive (at) @keyword) (string_literal) @string)
( (model_directive (at) @keyword) (type) @type)
( (using_directive (at) @keyword) (namespace) @namespace)
( (inject_directive (at) @keyword) (type) @type (identifier) @variable)
( (layout_directive (at) @keyword) (string_literal) @string)
( (section_directive (at) @keyword) (identifier) @function)

; Punctuation
( (open_brace) @punctuation.bracket)
( (close_brace) @punctuation.bracket)
( (open_paren) @punctuation.bracket)
( (close_paren) @punctuation.bracket)

; Comments
( (comment) @comment)

; HTML
( (tag_name) @tag)
( (attribute_name) @property)
( (attribute_value) @string)
( (text) @text) 