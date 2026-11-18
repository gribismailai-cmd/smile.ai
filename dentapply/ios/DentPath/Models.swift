import Foundation

// Mirrors web/schools.json. Optional fields reflect gaps in the research; never fill them with guesses.
struct Dataset: Codable { let meta: Meta; let schools: [School]; let resources: [Resource] }
struct Meta: Codable { let researchedOn: String; let method: String; let uOttawaNote: String }
struct Resource: Codable, Hashable { let label: String; let url: String; let note: String }

enum Confidence: String, Codable {
    case official, thirdParty = "third-party", dated, unknown
    var label: String { switch self { case .official: "official"; case .thirdParty: "3rd-party"; case .dated: "prior cycle"; case .unknown: "unverified" } }
}

struct DateRule: Codable, Hashable {
    let label: String; let month: Int?; let day: Int?; let year: Int?
    let confidence: Confidence; let note: String?

    /// Next occurrence on or after `today`. `projected` is true when the year was not stated by the source.
    func next(from today: Date = .now) -> (date: Date, projected: Bool)? {
        guard let m = month, let d = day else { return nil }
        let cal = Calendar.current
        let start = cal.startOfDay(for: today)
        var y = year ?? cal.component(.year, from: start)
        var projected = year == nil
        while let dt = cal.date(from: DateComponents(year: y, month: m, day: d)), dt < start { y += 1; projected = true }
        guard let dt = cal.date(from: DateComponents(year: y, month: m, day: d)) else { return nil }
        return (dt, projected)
    }
}

struct Requirement: Codable, Hashable {
    let required: Bool?; let rule: String?; let accepts: String?
    let minimum: Double?; let minimumIsApprox: Bool?; let reference: Double?; let confidence: Confidence
}
struct Source: Codable, Hashable { let label: String; let url: String; let tier: Confidence }

struct School: Codable, Identifiable, Hashable {
    let id, name, short, city, province, degree, language: String
    let ontarioStatus: String          // home | limited | not-eligible
    let ontarioStatusNote: String
    let deadline: DateRule?
    let otherDates: [DateRule]
    let gpaMin: Double?; let gpaMinConfidence: Confidence
    let gpaCompetitive: Double?; let gpaCompetitiveConfidence: Confidence; let gpaCompetitiveNote: String?
    let dat: Requirement; let casper: Requirement
    let interview: String?; let applicationRoute: String?
    let seats: Int?; let seatsConfidence: Confidence; let outOfProvinceSeats: Int?
    let requiresFrench: Bool?; let requires120Credits: Bool?
    let sources: [Source]
}

struct Profile: Codable, Equatable {
    var gpa = 3.80, datAA = 20.0, datPAT = 20.0
    var casperDone = false, french = false, has120Credits = true, quebecResident = false
    var isExample = true
}

enum FitLevel: Int, Comparable { case ok, info, warn, bad
    static func < (a: Self, b: Self) -> Bool { a.rawValue < b.rawValue } }
struct FitResult { let level: FitLevel; let label: String; let reasons: [String] }

/// Same rules as evaluate() in web/index.html. Compares against published minimums only; no admission prediction.
func evaluate(_ s: School, _ p: Profile) -> FitResult {
    var level = FitLevel.ok, reasons: [String] = [], checked = 0
    func bump(_ l: FitLevel) { level = max(level, l) }
    if s.ontarioStatus == "not-eligible" && !p.quebecResident { return .init(level: .bad, label: "Not eligible", reasons: [s.ontarioStatusNote]) }
    let blocked = (s.requiresFrench == true && !p.french) || (s.requires120Credits == true && !p.has120Credits)
    if s.requiresFrench == true && !p.french { reasons.append("Program taught in French."); bump(.bad) }
    if s.requires120Credits == true && !p.has120Credits { reasons.append("Needs a 120-credit bachelor's by July 31 of entry year."); bump(.bad) }
    if let min = s.gpaMin { checked += 1
        if p.gpa < min { reasons.append(String(format: "GPA %.2f is below the %.2f minimum.", p.gpa, min)); bump(.bad) }
        else if let c = s.gpaCompetitive, p.gpa < c { reasons.append(String(format: "Meets minimum; below the ~%.2f typical of interviewees (3rd-party).", c)); bump(.info) }
    }
    if let m = s.dat.minimum { checked += 1
        if p.datAA < m { reasons.append(String(format: "DAT AA %.1f is below the %.2f out-of-province cut-off.", p.datAA, m)); bump(.bad) } }
    if let r = s.dat.reference, p.datAA < r { reasons.append(String(format: "DAT AA below an older reported cut-off of %.1f (3rd-party).", r)); bump(.info) }
    if s.casper.required == true && !p.casperDone { reasons.append("CASPer required and not yet done."); bump(.warn) }
    if s.ontarioStatus == "limited" && level != .bad { reasons.append(s.ontarioStatusNote) }
    var label = ["Meets published minimums", "Meets minimums", "Action needed", "Below minimum"][level.rawValue]
    if level == .bad && blocked { label = "Blocked" }
    if checked == 0 && level <= .info { level = .info; label = "No minimum published"; reasons.insert("No GPA or DAT minimum found in research. Verify on the school site.", at: 0) }
    return .init(level: level, label: label, reasons: reasons)
}

/// OMSAS 4.0 values for uOttawa letter grades. Not yet checked against the official OUAC row for Ottawa.
let omsasScale: [(String, Double)] = [("A+",4.0),("A",3.9),("A-",3.7),("B+",3.3),("B",3.0),("C+",2.3),("C",2.0),("D+",1.3),("D",1.0),("E",0),("F",0)]
