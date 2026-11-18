import SwiftUI

@MainActor final class AppStore: ObservableObject {
    @Published private(set) var data: Dataset?
    @Published var loadError: String?
    @Published var profile: Profile { didSet { save(profile, "profile") } }
    @Published var checks: [String: Bool] { didSet { save(checks, "checks") } }

    static let checklist: [(id: String, title: String, detail: String)] = [
        ("prereq", "Map your uOttawa courses to each school's prerequisites", "U of T: done by end of May of entry year. Dalhousie: by May 1."),
        ("gpa", "Calculate your OMSAS-scale GPA", "U of T and Western publish a 3.00 minimum."),
        ("datreg", "Register for the Canadian DAT (CDA)", "Year-round at Prometric. Seats fill early in big cities."),
        ("dat", "Write the DAT", "UBC: by Aug 31. Alberta: by early Dec. Western needs the Reading Comprehension version."),
        ("casper", "Complete CASPer", "Required by U of T, Western and McGill."),
        ("lang", "English or French proficiency, if it applies", "U of T: within 24 months of Nov 1. UdeM and Laval teach in French."),
        ("transcripts", "Order official uOttawa transcripts", "Each school sets its own document deadline."),
        ("essays", "Draft personal statement and autobiographical sketch", "Requirements vary by school."),
        ("submit", "Submit applications", "Dalhousie Oct 1 · UBC Oct 10 · U of T / Western / Alberta Nov 1 · UdeM Nov 15"),
        ("interview", "Prepare for interviews and assessments", "Western interviews up to 200. Alberta has an in-person Pre-Entry Exam.")
    ]

    init() {
        profile = Self.load("profile") ?? Profile()
        checks = Self.load("checks") ?? [:]
        guard let url = Bundle.main.url(forResource: "schools", withExtension: "json") else { loadError = "schools.json is missing from the app bundle."; return }
        do { data = try JSONDecoder().decode(Dataset.self, from: Data(contentsOf: url)) }
        catch { loadError = "schools.json could not be read: \(error.localizedDescription)" }
    }

    var schools: [School] { data?.schools ?? [] }
    var doneCount: Int { Self.checklist.filter { checks[$0.id] == true }.count }

    struct Event: Identifiable { let id = UUID(); let school: School; let rule: DateRule; let date: Date; let projected: Bool; let isMain: Bool
        var days: Int { Calendar.current.dateComponents([.day], from: Calendar.current.startOfDay(for: .now), to: date).day ?? 0 } }

    var events: [Event] {
        schools.filter { $0.ontarioStatus != "not-eligible" }.flatMap { s -> [Event] in
            var e: [Event] = []
            if let d = s.deadline, let n = d.next() { e.append(.init(school: s, rule: d, date: n.date, projected: n.projected, isMain: true)) }
            for d in s.otherDates { if let n = d.next() { e.append(.init(school: s, rule: d, date: n.date, projected: n.projected, isMain: false)) } }
            return e
        }.sorted { $0.date < $1.date }
    }

    private func save<T: Encodable>(_ v: T, _ k: String) { UserDefaults.standard.set(try? JSONEncoder().encode(v), forKey: "dentpath.\(k)") }
    private static func load<T: Decodable>(_ k: String) -> T? {
        guard let d = UserDefaults.standard.data(forKey: "dentpath.\(k)") else { return nil }
        return try? JSONDecoder().decode(T.self, from: d)
    }
}
