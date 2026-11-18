import SwiftUI

@main struct DentPathApp: App {
    @StateObject private var store = AppStore()
    var body: some Scene {
        WindowGroup {
            Group {
                if let err = store.loadError { ContentUnavailableView("Data not loaded", systemImage: "exclamationmark.triangle", description: Text(err)) }
                else {
                    TabView {
                        HomeView().tabItem { Label("Home", systemImage: "house") }
                        SchoolsView().tabItem { Label("Schools", systemImage: "graduationcap") }
                        FitView().tabItem { Label("Fit", systemImage: "chart.bar") }
                        PlanView().tabItem { Label("Plan", systemImage: "checklist") }
                    }
                }
            }
            .environmentObject(store)
            .tint(Color(red: 0.04, green: 0.48, blue: 0.46))
        }
    }
}
