import SwiftUI

struct ConfTag: View { let c: Confidence
    var color: Color { switch c { case .official: .green; case .thirdParty: .blue; case .dated: .orange; case .unknown: .red } }
    var body: some View { Text(c.label).font(.caption2.monospaced()).padding(.horizontal, 5).padding(.vertical, 2)
        .overlay(RoundedRectangle(cornerRadius: 4).stroke(color.opacity(0.5))).foregroundStyle(color) }
}
struct StatusPill: View { let text: String; let level: FitLevel
    var color: Color { [.green, .blue, .orange, .red][level.rawValue] }
    var body: some View { Text(text).font(.caption.weight(.semibold)).padding(.horizontal, 8).padding(.vertical, 4)
        .background(color.opacity(0.15), in: Capsule()).foregroundStyle(color) }
}
let dateFmt: DateFormatter = { let f = DateFormatter(); f.dateStyle = .medium; return f }()

// MARK: Home
struct HomeView: View {
    @EnvironmentObject var store: AppStore
    var body: some View {
        NavigationStack {
            List {
                Section("Application readiness") {
                    Gauge(value: Double(store.doneCount), in: 0...Double(AppStore.checklist.count)) { Text("Steps") }
                        currentValueLabel: { Text("\(store.doneCount)/\(AppStore.checklist.count)") }
                        .gaugeStyle(.accessoryCircularCapacity).frame(maxWidth: .infinity)
                    if let next = AppStore.checklist.first(where: { store.checks[$0.id] != true }) { Text("Next: \(next.title)").font(.footnote).foregroundStyle(.secondary) }
                }
                Section("Next deadlines") {
                    ForEach(store.events.filter(\.isMain).prefix(5)) { e in
                        HStack { VStack(alignment: .leading) {
                                Text("\(e.school.short) · \(e.rule.label)").font(.subheadline.weight(.semibold))
                                HStack { Text(dateFmt.string(from: e.date) + (e.projected ? " · projected" : "")); ConfTag(c: e.rule.confidence) }.font(.caption).foregroundStyle(.secondary) }
                            Spacer(); VStack { Text("\(e.days)").font(.title3.bold().monospacedDigit()); Text("days").font(.caption2).foregroundStyle(.secondary) } }
                    }
                }
                Section { Text(store.data?.meta.uOttawaNote ?? "").font(.footnote)
                    Text("Not affiliated with the University of Ottawa or any dental faculty. Confirm every figure on the school's site.").font(.footnote).foregroundStyle(.secondary) }
            }.navigationTitle("DentPath")
        }
    }
}

// MARK: Schools
struct SchoolsView: View {
    @EnvironmentObject var store: AppStore
    @State private var filter = "all"
    var shown: [School] { store.schools.filter { filter == "all" || $0.ontarioStatus == filter } }
    var body: some View {
        NavigationStack {
            List(shown) { s in
                NavigationLink(value: s) { VStack(alignment: .leading, spacing: 4) {
                    HStack { Text(s.name).font(.headline); Spacer(); Text(s.province).font(.caption.monospaced()).foregroundStyle(.secondary) }
                    Text("\(s.degree) · \(s.language) · \(statusLabel(s.ontarioStatus))").font(.caption).foregroundStyle(.secondary)
                } }
            }
            .navigationDestination(for: School.self) { SchoolDetail(school: $0) }
            .toolbar { Picker("Filter", selection: $filter) { Text("All").tag("all"); Text("Ontario").tag("home"); Text("Out-of-province").tag("limited"); Text("Not eligible").tag("not-eligible") } }
            .navigationTitle("Dental schools")
        }
    }
}
func statusLabel(_ s: String) -> String { ["home": "Ontario school", "limited": "Out-of-province", "not-eligible": "Not open to Ontario"][s] ?? s }

struct SchoolDetail: View { let school: School
    var body: some View {
        List {
            Section { Text(school.ontarioStatusNote) } header: { Text(statusLabel(school.ontarioStatus)) }
            Section("Dates") {
                ForEach([school.deadline].compactMap { $0 } + school.otherDates, id: \.self) { d in
                    VStack(alignment: .leading) { HStack { Text(d.label); Spacer()
                        Text(d.next().map { dateFmt.string(from: $0.date) + ($0.projected ? " (proj.)" : "") } ?? "Not found"); ConfTag(c: d.confidence) }
                        if let n = d.note, !n.isEmpty { Text(n).font(.caption).foregroundStyle(.secondary) } }
                }
            }
            Section("Requirements") {
                row("Minimum GPA", school.gpaMin.map { String(format: "%.2f", $0) } ?? "Not published", school.gpaMinConfidence)
                if let c = school.gpaCompetitive { row("Competitive GPA", String(format: "~%.2f", c), school.gpaCompetitiveConfidence) }
                row("DAT", school.dat.required == true ? "Required" : school.dat.required == false ? "Not required" : "Unconfirmed", school.dat.confidence)
                if let r = school.dat.rule, !r.isEmpty { Text(r).font(.caption).foregroundStyle(.secondary) }
                row("CASPer", school.casper.required == true ? "Required" : school.casper.required == false ? "Not required" : "Unconfirmed", school.casper.confidence)
                if let s = school.seats { row("Seats", "\(s)", school.seatsConfidence) }
            }
            Section("Sources") { ForEach(school.sources, id: \.self) { s in
                if let u = URL(string: s.url) { HStack { Link(s.label, destination: u); Spacer(); ConfTag(c: s.tier) } } } }
        }.navigationTitle(school.short)
    }
    func row(_ k: String, _ v: String, _ c: Confidence) -> some View { HStack { Text(k).foregroundStyle(.secondary); Spacer(); Text(v).monospacedDigit(); ConfTag(c: c) } }
}

// MARK: Fit
struct FitView: View {
    @EnvironmentObject var store: AppStore
    var body: some View {
        NavigationStack {
            Form {
                Section { 
                    if store.profile.isExample { Text("Example profile. Replace with yours.").font(.caption).foregroundStyle(.orange) }
                    Stepper(value: binding(\.gpa), in: 0...4, step: 0.01) { LabeledContent("GPA (OMSAS 4.0)", value: String(format: "%.2f", store.profile.gpa)) }
                    Stepper(value: binding(\.datAA), in: 1...30, step: 0.1) { LabeledContent("DAT Academic Avg", value: String(format: "%.1f", store.profile.datAA)) }
                    Stepper(value: binding(\.datPAT), in: 1...30, step: 0.1) { LabeledContent("DAT PAT", value: String(format: "%.1f", store.profile.datPAT)) }
                    Toggle("CASPer completed", isOn: binding(\.casperDone))
                    Toggle("Can study in French", isOn: binding(\.french))
                    Toggle("120-credit bachelor's by entry", isOn: binding(\.has120Credits))
                    Toggle("Quebec resident status", isOn: binding(\.quebecResident))
                } header: { Text("Your profile") } footer: { Text("Compares with published minimums only. It does not predict admission.") }
                Section("Results by school") {
                    ForEach(store.schools.map { ($0, evaluate($0, store.profile)) }.sorted { $0.1.level < $1.1.level }, id: \.0.id) { s, r in
                        VStack(alignment: .leading, spacing: 4) {
                            HStack { Text(s.short).font(.headline); Spacer(); StatusPill(text: r.label, level: r.level) }
                            ForEach(r.reasons, id: \.self) { Text("• " + $0).font(.caption).foregroundStyle(.secondary) }
                        }
                    }
                }
            }.navigationTitle("Fit check")
        }
    }
    func binding<T>(_ kp: WritableKeyPath<Profile, T>) -> Binding<T> {
        Binding(get: { store.profile[keyPath: kp] }, set: { store.profile[keyPath: kp] = $0; store.profile.isExample = false })
    }
}

// MARK: Plan
struct PlanView: View {
    @EnvironmentObject var store: AppStore
    var body: some View {
        NavigationStack {
            List {
                Section("Checklist \(store.doneCount)/\(AppStore.checklist.count)") {
                    ForEach(AppStore.checklist, id: \.id) { item in
                        Button { store.checks[item.id] = !(store.checks[item.id] ?? false) } label: {
                            HStack(alignment: .top) {
                                Image(systemName: store.checks[item.id] == true ? "checkmark.square.fill" : "square").font(.title3)
                                VStack(alignment: .leading) { Text(item.title).strikethrough(store.checks[item.id] == true); Text(item.detail).font(.caption).foregroundStyle(.secondary) }
                            }
                        }.buttonStyle(.plain)
                    }
                }
                Section("Timeline") {
                    ForEach(store.events) { e in
                        HStack { VStack(alignment: .leading) { Text("\(e.school.short) · \(e.rule.label)").font(.subheadline)
                                Text(dateFmt.string(from: e.date) + (e.projected ? " · projected" : "")).font(.caption).foregroundStyle(.secondary) }
                            Spacer(); Text("\(e.days)d").monospacedDigit() }
                    }
                }
            }.navigationTitle("Plan")
        }
    }
}
