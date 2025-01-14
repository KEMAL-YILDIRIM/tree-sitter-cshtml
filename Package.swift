// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterCsHtml",
    products: [
        .library(name: "TreeSitterCsHtml", targets: ["TreeSitterCsHtml"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterCsHtml",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterCsHtmlTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterCsHtml",
            ],
            path: "bindings/swift/TreeSitterCsHtmlTests"
        )
    ],
    cLanguageStandard: .c11
)
