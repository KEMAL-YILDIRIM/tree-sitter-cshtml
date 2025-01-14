package tree_sitter_cshtml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_cshtml "github.com/kemal-yildirim/tree-sitter-cshtml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_cshtml.Language())
	if language == nil {
		t.Errorf("Error loading CsHtml grammar")
	}
}
