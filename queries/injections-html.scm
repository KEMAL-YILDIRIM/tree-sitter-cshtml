; Inject HTML with Razor expression support
((html_content) @injection.content
 (#set! injection.language "html")
 (#set! injection.include-children)
 (#set! injection.combined))

; HTML attributes that may contain Razor expressions
((html_content
  (html_element
    (html_attribute
      (html_attribute_value) @injection.content)))
 (#set! injection.language "html")
 (#match? @injection.content "@.*")
 (#set! injection.include-children))
