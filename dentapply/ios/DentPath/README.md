# DentPath – native iOS (SwiftUI) source

Status: **not compiled.** This source was written in a Linux container with no Xcode. Expect small fixes on first build.

Requirements: Xcode 15+, iOS 17+ target (uses `ContentUnavailableView`, Swift 5.9 `switch` expressions).

Setup:
1. Xcode → File → New → Project → iOS App, name `DentPath`, interface SwiftUI.
2. Delete the generated `ContentView.swift` and `DentPathApp.swift`.
3. Drag the four `.swift` files from this folder into the project.
4. Drag `../../web/schools.json` into the project with "Copy items if needed" and the app target ticked.
5. Run on an iPhone simulator.

`evaluate()` in `Models.swift` mirrors `evaluate()` in `web/index.html`. Change both together.
