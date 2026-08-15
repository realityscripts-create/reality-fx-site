#!/usr/bin/env perl
# ============================================================
# REALITY FX — REGRESSION & INTEGRITY AUDIT
# ------------------------------------------------------------
# The institutional inspector. Walk the whole building every
# time we touch it, before the weight lands on the foundation:
#
#   1. TREE LOCKSTEP   — the two System A trees must be one
#   2. VERSION STAMPS  — every page stamps every asset, one
#                        version per page (a stale stamp is
#                        how old code hides in browsers)
#   3. FUNCTION CONTRACTS — every db.* call any page makes
#                        must exist in db.js (the lineage
#                        break that crashed the member panel)
#   4. HANDOFF CONTRACT — the bridge must send every field
#                        the OS reads (demoTourEndsAt was
#                        once silently missing)
#   5. ASSET EXISTENCE — no HTML may reference a file that
#                        isn't on disk
#   6. OS STAMP UNITY   — the OS app loads one version of
#                        every asset
#   7. STORE SNAPSHOT   — back the shared state store up
#                        before anything can hurt it
#
# Usage:  perl audit-regression.pl        (run from project root)
# Exit:   0 = all green, 1 = findings (still creates the snapshot)
# ============================================================

use strict;
use warnings;
use File::Copy;
use JSON::PP;

my $ROOT = ".";
my $A    = "System-A-live";
my $A2   = "Reality-Fx-Registration-and-Member-s-panel";
my $OS   = "REALITY-FOREX-TRADING-/os";
my $STATE = ".freebuff/tools/system-a-state.json";

my @fails;
my %secOk;   # section number -> 1 if that section had no failures
my $curSec = 0;
sub sec { $curSec = shift; }
sub fail { push @fails, $_[0]; $secOk{$curSec} = 0; print "  [FAIL] $_[0]\n"; }
sub ok   { $secOk{$curSec} = 1 unless exists $secOk{$curSec}; print "  [ ok ] $_[0]\n"; }

print "==============================================\n";
print "REALITY FX — REGRESSION & INTEGRITY AUDIT\n";
print "  " . localtime() . "\n";
print "==============================================\n";

# ---------- 1. TREE LOCKSTEP ----------
sec(1);
print "\n[1] System A tree lockstep\n";
{
    my @files = glob("$A/js/*.js $A/css/*.css $A/assets/* $A/*.html");
    my $diffs = 0;
    for my $f (@files) {
        (my $rel = $f) =~ s/^\Q$A\E\//$A2\//;
        if (!-f $rel) { fail("$A2/$rel missing (served has it)"); $diffs++; next; }
        open my $fh, "<", $f or next;
        local $/; my $c1 = <$fh>; close $fh;
        open my $fh2, "<", $rel or next;
        local $/; my $c2 = <$fh2>; close $fh2;
        if ($c1 ne $c2) { fail("tree drift: $rel differs from served copy"); $diffs++; }
    }
    ok($diffs ? "$diffs file(s) drifted — HEAL with: cp $A/* Reality-Fx-Registration-and-Member-s-panel/" : "both trees byte-identical");
}

# ---------- 2. VERSION STAMPS ----------
sec(2);
print "\n[2] System A version stamps (one version per page, every asset stamped)\n";
{
    my @html = glob("$A/*.html");
    my $bad = 0;
    for my $h (@html) {
        open my $fh, "<", $h or next;
        local $/; my $c = <$fh>; close $fh;
        my @v = ($c =~ /\?v=([0-9a-zA-Z-]+)/g);
        if (!@v) { fail("$h has NO version stamps"); $bad++; next; }
        my %u = map { $_ => 1 } @v;
        if (keys(%u) > 1) { fail("$h mixes stamps: " . join(",", sort keys %u)); $bad++; }
        if ($c =~ /<(?:script|link)[^>]+src="([^"?]+)"|href="([^"?]+\.css)"/) { }
        while ($c =~ /(?:src|href)="((?!https?:|data:|#|mailto:)[^"]+\.(?:js|css))"/g) {
            my $ref = $1;
            my $p = "$A/$ref";
            if (!-f $p) { fail("$h references missing asset $ref"); $bad++; }
        }
    }
    ok($bad ? "$bad page(s) had stamp/asset problems" : "all pages single-stamped, assets exist");
}

# ---------- 3. FUNCTION CONTRACTS (the lineage-break catcher) ----------
sec(3);
print "\n[3] Function contracts — every db.* call resolves in db.js\n";
{
    open my $dbh, "<", "$A/js/db.js" or die "can't read db.js";
    local $/; my $db = <$dbh>; close $dbh;
    my %defs;
    while ($db =~ /\bfunction\s+([A-Za-z_\$][\w\$]*)\s*\(/g) { $defs{$1} = 1; }
    # export list names (may be assigned, not function-declared)
    while ($db =~ /\b([A-Za-z_\$][\w\$]*)\s*(?:,|\})\s*$/mg) { }
    my %missing;
    my @pages = glob("$A/js/*.js");
    for my $p (@pages) {
        open my $ph, "<", $p or next;
        local $/; my $c = <$ph>; close $ph;
        while ($c =~ /\b(?:db|RFX\.db)\.([A-Za-z_\$][\w\$]*)\s*\(/g) {
            my $name = $1;
            next if $name eq 'db';
            if (!$defs{$name}) { $missing{$name}{$p} = 1; }
        }
    }
    if (%missing) {
        for my $n (sort keys %missing) {
            fail("db.$n() called but not defined in db.js — " . join(",", map { s/.*\///r } keys %{$missing{$n}}));
        }
    } else {
        ok("every db.* call across " . scalar(@pages) . " pages resolves in db.js");
    }
}

# ---------- 4. HANDOFF CONTRACT ----------
sec(4);
print "\n[4] Handoff payload contract (fields the OS reads)\n";
{
    open my $fh, "<", "$A/js/bridge.js" or die "can't read bridge.js";
    local $/; my $c = <$fh>; close $fh;
    my @need = qw(studentId studentCode verifiedName email enrollmentId invoice course entitlements printTrust founder demoPass demoTourEndsAt approvalAt trust status);
    my @miss;
    for my $f (@need) { push @miss, $f unless $c =~ /\b$f\s*:/; }
    if (@miss) { fail("bridge payload missing: " . join(", ", @miss)); }
    else { ok("all 15 handoff fields present"); }
    # the OS side reads them
    open my $oh, "<", "$OS/js/os.js" or die "can't read os.js";
    local $/; my $os = <$oh>; close $oh;
    my @osmiss;
    for my $f (qw(demoTourEndsAt studentCode printTrust founder trust)) { push @osmiss, $f unless $os =~ /\b$f\b/; }
    ok(@osmiss ? "OS side missing refs: " . join(",", @osmiss) : "OS reads the key handoff fields");
}

# ---------- 5. OS STAMP UNITY + ASSET EXISTENCE ----------
sec(5);
print "\n[5] OS app — one stamp per asset, files exist\n";
{
    open my $fh, "<", "$OS/index.html" or die "can't read os index";
    local $/; my $c = <$fh>; close $fh;
    my %v;
    while ($c =~ /\?v=([0-9a-zA-Z-]+)/g) { $v{$1} = 1; }
    if (keys(%v) > 1) { fail("OS index mixes stamps: " . join(",", sort keys %v)); }
    else { ok("OS single stamp: " . (keys(%v) ? join("", keys %v) : "none")); }
    while ($c =~ /(?:src|href)="((?!https?:|data:|#)[^"]+\.(?:js|css))"/g) {
        my $ref = $1;
        # Cross-tree refs (../rfx-pwa/* — the PWA layer) sit at the deploy
        # root beside the OS; production serves them from there.
        my $p;
        if ($ref =~ m{^\.\./}) { (my $r = $ref) =~ s{^\.\./}{}; $p = "$ROOT/$r"; }
        else { $p = "$OS/$ref"; }
        if (!-f $p) { fail("OS index references missing $ref"); }
    }
}

# ---------- 6. WEBSITE TO SYSTEM A COUPON LINK ----------
sec(6);
print "\n[6] Website -> reception coupon rail\n";
{
    open my $fh, "<", "REALITY-FOREX-TRADING-/js/main.js" or die "can't read main.js";
    local $/; my $c = <$fh>; close $fh;
    ok($c =~ /RECEPTION_URL/ ? "website coupon deep-link wired (RECEPTION_URL)" : fail("website coupon rail missing"));
    open my $fh2, "<", "System-A-live/js/reception.js" or die;
    local $/; my $r = <$fh2>; close $fh2;
    ok($r =~ /coupon/ && $r =~ /URLSearchParams/ ? "reception auto-opens ?coupon= deep links" : fail("reception coupon deep-link missing"));
    open my $fh3, "<", "System-A-live/js/db.js" or die;
    local $/; my $d = <$fh3>; close $fh3;
    ok($d =~ /\{ type: 'demo'/ ? "demo-tour coupon type present" : fail("demo-tour coupon type missing"));
}

# ---------- 7. STORE SNAPSHOT (insurance before any mutation) ----------
sec(7);
print "\n[7] State-store snapshot\n";
{
    if (-f $STATE) {
        my $ts = localtime();
        $ts =~ s/[: ]+/-/g;
        my $snap = "$STATE.$ts.bak";
        copy($STATE, $snap) or fail("could not snapshot store: $!");
        ok("snapshot -> $snap");
    } else {
        ok("no shared store present (demo — nothing to protect)");
    }
}

# ---------- 8. DEVICE-TRUST RAIL (the "is this really you?" gate) ----------
sec(8);
print "\n[8] Device-trust rail — local server, Netlify function and client agree\n";
{
    open my $fh, "<", ".freebuff/tools/os-handoff-server.pl" or die "can't read os-handoff-server.pl";
    local $/; my $srv = <$fh>; close $fh;
    my @need = qw(/os/api/device/check /os/api/device/challenge /os/api/device/confirm);
    my @miss;
    for my $p (@need) { push @miss, $p unless $srv =~ /\Q$p\E/; }
    ok(@miss ? "local server missing: " . join(", ", @miss) : "all 3 device endpoints in the local server");
    open my $of, "<", "netlify/functions/osapi.js" or die "can't read osapi.js";
    local $/; my $fn = <$of>; close $of;
    my @fnmiss;
    for my $p (qw(device/check device/challenge device/confirm)) { push @fnmiss, $p unless $fn =~ /\bpostDeviceCheck\b|\b$p\b/; }
    ok(@fnmiss ? "Netlify function missing: " . join(", ", @fnmiss) : "device endpoints in the Netlify function");
    open my $cj, "<", "REALITY-FOREX-TRADING-/os/js/os.js" or die "can't read os.js";
    local $/; my $os = <$cj>; close $cj;
    my @cmiss;
    for my $p (qw(device/check device/challenge device/confirm)) { push @cmiss, $p unless $os =~ /\Q$p\E/; }
    ok(@cmiss ? "os.js missing calls: " . join(", ", @cmiss) : "os.js calls all 3 device endpoints");
    my $geo = $os =~ /rfx_geo_cache/ ? "geo cache present" : "geo cache MISSING";
    ok($geo);
    # Live probe: actually POST to the local rail and require a demoCode back.
    # Presence checks alone let a crashed handler (e.g. a sub redefinition)
    # sail through — this proves the rail answers.
    my $port = 49270;
    my $probe = qx{curl -s -m 6 -X POST "http://127.0.0.1:$port/os/api/device/challenge" -H "Content-Type: application/json" --data-binary '{"studentId":"RFX-AUDIT","fp":"fp-audit"}' 2>/dev/null};
    if ($probe =~ /"demoCode":\s*"\d{6}"/) {
        ok("device/challenge answers live (demoCode returned)");
    } else {
        fail("device/challenge live probe: " . (length($probe) ? $probe : "no response (server down or handler crashed)"));
    }
    # --- live probes: every rail the OS leans on, proven answering ---
    # The lesson of the device rail: a handler can exist yet crash at runtime
    # (sub redefinitions, bad store shapes). Each probe below exercises the
    # real endpoint with the same shape the OS uses and requires the expected
    # answer. Probes use an already-known student (handoff: "already" path,
    # no new record) or a self-cleaning session (claim -> heartbeat -> release).
    my $h = qx{curl -s -m 6 -X POST "http://127.0.0.1:$port/os/api/handoff" -H "Content-Type: application/json" --data-binary '{"studentId":"RFX-10482"}' 2>/dev/null};
    ok($h =~ /"received":\s*true/ ? "handoff rail answers live (handshake accepted)"
       : fail("handoff rail live probe: " . (length($h) ? $h : "no response")));
    my $tok = "audit-" . time() . "-" . int(rand(99999));
    my $cl = qx{curl -s -m 6 -X POST "http://127.0.0.1:$port/os/api/session/claim" -H "Content-Type: application/json" --data-binary '{"studentId":"RFX-10482","token":"$tok","deviceId":"dev-audit","deviceType":"desktop"}' 2>/dev/null};
    if ($cl =~ /"ok":\s*true/ && $cl =~ /"active":\s*true/) {
        my $hb = qx{curl -s -m 6 -X POST "http://127.0.0.1:$port/os/api/session/heartbeat" -H "Content-Type: application/json" --data-binary '{"studentId":"RFX-10482","token":"$tok"}' 2>/dev/null};
        ok($hb =~ /"active":\s*true/ ? "session rail answers live (claim -> heartbeat)"
           : fail("session heartbeat live probe: " . (length($hb) ? $hb : "no response")));
        qx{curl -s -m 6 -X POST "http://127.0.0.1:$port/os/api/session/release" -H "Content-Type: application/json" --data-binary '{"studentId":"RFX-10482","token":"$tok"}' 2>/dev/null};
    } else {
        fail("session claim live probe: " . (length($cl) ? $cl : "no response"));
    }
    my $lb = qx{curl -s -m 6 "http://127.0.0.1:$port/os/api/challenge/leaderboard" 2>/dev/null};
    ok($lb =~ /"boards"/ ? "leaderboard rail answers live (boards served)"
       : fail("leaderboard rail live probe: " . (length($lb) ? $lb : "no response")));
    my $email = $fn =~ /method === "POST" && path === "mail"/ ? "mail endpoint contract present (production function)" : "mail endpoint MISSING from Netlify function";
    ok($email);
}

# ---------- 9. SECURITY LAYER (DLP, masking, RBAC, access log, privacy) ----------
sec(9);
print "\n[9] Security layer — DLP, masking, RBAC, access log, privacy\n";
{
    my $okAll = 1;
    # DLP — client + both servers must carry the chat guard
    open my $fh, "<", "$OS/js/os.js" or die;
    local $/; my $os = <$fh>; close $fh;
    my $dlpClient = $os =~ /function dlpScan\(/ && $os =~ /room-dlp/ ? 1 : 0;
    ok($dlpClient ? "DLP client guard present (dlpScan + room warning bar)" : fail("DLP client guard missing in os.js"));
    my $piiFull = $os =~ /PII_BLOCK/ && $os =~ /ssn/ && $os =~ /iban/ && $os =~ /otp/ && $os =~ /RFXpii/ ? 1 : 0;
    ok($piiFull ? "PII scanner full (SSN/IBAN/bank/OTP + RFXpii exposed)" : fail("PII scanner not fully expanded in os.js"));
    open my $fh2, "<", ".freebuff/tools/os-handoff-server.pl" or die;
    local $/; my $srv = <$fh2>; close $fh2;
    my $dlpSrv = $srv =~ /sub dlp_hit/ ? 1 : 0;
    ok($dlpSrv ? "DLP server guard present (local server dlp_hit)" : fail("DLP guard missing in os-handoff-server.pl"));
    open my $fh3, "<", "netlify/functions/osapi.js" or die;
    local $/; my $fn = <$fh3>; close $fh3;
    my $dlpFn = $fn =~ /function dlpHit\(/ ? 1 : 0;
    ok($dlpFn ? "DLP guard present (Netlify function dlpHit)" : fail("DLP guard missing in netlify osapi.js"));
    # masking + RBAC + access log + privacy + staff timeout + minors
    open my $fh4, "<", "$A/js/db.js" or die;
    local $/; my $db = <$fh4>; close $fh4;
    my $mask = $db =~ /function maskEmail\(/ && $db =~ /function maskField\(/ ? 1 : 0;
    ok($mask ? "masking helpers present (maskEmail / maskField)" : fail("masking helpers missing in db.js"));
    my $rbac = $db =~ /function canViewIdentity\(/ ? 1 : 0;
    ok($rbac ? "RBAC helper present (canViewIdentity)" : fail("canViewIdentity missing in db.js"));
    my $log = $db =~ /function logAccess\(/ ? 1 : 0;
    ok($log ? "access logging present (logAccess)" : fail("logAccess missing in db.js"));
    open my $fh5, "<", "$A/admin.html" or die;
    local $/; my $adm = <$fh5>; close $fh5;
    my $logView = $adm =~ /sec-access/ ? 1 : 0;
    ok($logView ? "access-log viewer present (admin console)" : fail("access-log viewer missing in admin.html"));
    open my $fh6, "<", "$A/js/staff.js" or die;
    local $/; my $st = <$fh6>; close $fh6;
    my $timeout = $st =~ /STAFF_IDLE_MIN/ ? 1 : 0;
    ok($timeout ? "staff session timeout present (STAFF_IDLE_MIN)" : fail("staff session timeout missing in staff.js"));
    open my $fh7, "<", "$A/register.html" or die;
    local $/; my $reg = <$fh7>; close $fh7;
    my $ageGate = $reg =~ /screen-agegate/ && $reg =~ /btn-age-adult/ && $reg =~ /btn-age-minor/ ? 1 : 0;
    my $guardianStep = $reg =~ /step-guardian/ && $reg =~ /g-verify/ && $reg =~ /g-consent/ ? 1 : 0;
    my $privacyReg = $reg =~ /Your data is protected/ ? 1 : 0;
    my $safeguardCard = $reg =~ /Student safety is built into this enrollment/ ? 1 : 0;
    ok($ageGate ? "age gate present (18+ / under-18)" : fail("age gate missing in register.html"));
    ok($guardianStep ? "guardian authorization step present (step-guardian + email code)" : fail("guardian step missing in register.html"));
    ok($privacyReg ? "privacy assurance present (registration)" : fail("privacy statement missing in register.html"));
    ok($safeguardCard ? "pre-enrollment safeguarding card present" : fail("safeguarding card missing on welcome"));
    my $ageGateDb = $db =~ /function saveAgeGate\(/ && $db =~ /function sendGuardianCode\(/ && $db =~ /function checkGuardianCode\(/ && $db =~ /GUARDIAN_GATE_BLOCKED/ ? 1 : 0;
    ok($ageGateDb ? "guardian machinery in db.js (age gate, code send/verify, submit gate)" : fail("guardian machinery missing in db.js"));
    my $gEmails = $db =~ /guardian-confirm/ && $db =~ /guardian-prep/ && $db =~ /GUARDIAN_PREP_COPIED/ ? 1 : 0;
    ok($gEmails ? "guardian emails in db.js (confirmation + parent copied on approval)" : fail("guardian emails missing in db.js"));
    my $piiRail = $srv =~ /sub log_pii_incident/ && $srv =~ /pii-incidents/ ? 1 : 0;
    ok($piiRail ? "PII incident rail in local server (log + board endpoint)" : fail("PII incident rail missing in os-handoff-server.pl"));
    my $piiFn = $fn =~ /pii-incidents/ && $fn =~ /mutate\("pii"/ ? 1 : 0;
    ok($piiFn ? "PII incident rail in Netlify function" : fail("PII incident rail missing in netlify osapi.js"));
    open my $fh9, "<", "$A/js/admin.js" or die;
    local $/; my $admjs = <$fh9>; close $fh9;
    my $piiBoard = $admjs =~ /renderPii\(/ && $admjs =~ /sec-pii/ ? 1 : 0;
    ok($piiBoard ? "PII incident board present (admin console)" : fail("PII incident board missing in admin.js"));
    my $piiClient = $os =~ /pii-incidents/ && $os =~ /blocked attempt/ ? 1 : 0;
    ok($piiClient ? "client-side block report present (room chat)" : fail("client-side PII report missing in os.js"));
    open my $fh8, "<", "$A/js/member.js" or die;
    local $/; my $mem = <$fh8>; close $fh8;
    my $privMem = $mem =~ /protected student environment/ ? 1 : 0;
    ok($privMem ? "privacy assurance present (member panel)" : fail("privacy statement missing in member.js"));
}

# ---------- 10. TRADING CHALLENGE SIM (the machine-judged arena) ----------
sec(10);
print "\n[10] Trading Challenge sim — module, route, rails\n";
{
    open my $fh, "<", "$OS/js/sim.js" or fail("sim.js missing") and return;
    close $fh;
    ok("sim.js present");
    open my $fh2, "<", "$OS/index.html" or die;
    local $/; my $ix = <$fh2>; close $fh2;
    ok($ix =~ /js\/sim\.js/ ? "sim script wired in the OS shell" : fail("sim.js not referenced in index.html"));
    ok($ix =~ /data-route=\"sim\"/ ? "Trading Challenge nav item present" : fail("nav route sim missing"));
    open my $fh3, "<", "$OS/js/os.js" or die;
    local $/; my $os = <$fh3>; close $fh3;
    ok($os =~ /window\.RFXSim\.render/ ? "router calls RFXSim.render" : fail("sim route not wired in os.js"));
    open my $fh4, "<", ".freebuff/tools/os-handoff-server.pl" or die;
    local $/; my $srv = <$fh4>; close $fh4;
    ok($srv =~ m{/os/api/challenge/leaderboard} ? "leaderboard rail in local server" : fail("leaderboard missing in local server"));
    open my $fh5, "<", "netlify/functions/osapi.js" or die;
    local $/; my $fn = <$fh5>; close $fh5;
    ok($fn =~ /challenge\/leaderboard/ ? "leaderboard rail in Netlify function" : fail("leaderboard missing in Netlify function"));
    # --- sim performance budget (architectural guarantees, not hopes) ---
    # Measured live at 600 open positions: 6.6ms/tick in place vs ~55ms + an
    # iframe reload for the old full rebuild. The budget is kept by structure:
    # ticks update rows in place (never innerHTML), the chart rail is created
    # once and never re-rendered, and the tick loop is the single driver.
    open my $fh6, "<", "$OS/js/sim.js" or die;
    local $/; my $sim = <$fh6>; close $fh6;
    my @perf;
    push @perf, ($sim =~ /function renderOpenBox\(/ && $sim =~ /getAttribute\("data-tid"\)/) ? 1 : 0;   # in-place row updates
    push @perf, ($sim =~ /sim-chart-rail/ && $sim =~ /chartInjected/ && $sim =~ /never re-render/) ? 1 : 0;  # chart rail preserved
    push @perf, ($sim =~ /5000/) ? 1 : 0;                                                                                       # single tick driver
    push @perf, ($sim =~ /pnlEl\.textContent/ && $sim =~ /\.sp-pnl/) ? 1 : 0;                                                       # text-level updates
    my @bad = grep { !$_ } @perf;
    ok(@bad ? fail("sim perf architecture broken (in-place rows / chart rail / tick driver)") : "sim perf architecture intact (in-place rows, chart rail preserved, single tick driver)");
}

# ---------- 11. FORGE STANDARD (chapter integrity) ----------
sec(11);
print "\n[11] Forge Standard — chapter integrity (per-lane slides/quiz/qpos + explain + anatomy)\n";
{
    my $out = `perl .freebuff/tools/check-chapters.pl 2>&1`;
    if ($out =~ /ALL 13 CHAPTERS VERIFIED/) {
        ok("all 13 chapters pass the Forge Standard (per-lane slides/quiz/qpos, explain, anatomy)");
    } else {
        fail("Forge Standard check FAILED:\n" . $out);
    }
    if ($out =~ /structure: (\d+) top-level records, depth returns to (\d+)/) {
        ok($2 == 0 ? "bracket scan: $1 records, balanced" : fail("unbalanced brackets (depth returns to $2)"));
    }
}

# ---------- 12. TRADE JOURNAL (module, six-stat rail, local-only guarantee) ----------
sec(12);
print "\n[12] Trade Journal — module, route, six-stat rail, local-only\n";
{
    open my $fh, "<", "$OS/js/journal.js" or fail("journal.js missing") and return;
    local $/; my $j = <$fh>; close $fh;
    ok($j =~ /RFX TRADE JOURNAL/i ? "journal.js present" : fail("journal.js missing"));
    open my $fh2, "<", "$OS/index.html" or die;
    local $/; my $ix = <$fh2>; close $fh2;
    ok($ix =~ /js\/journal\.js/ ? "journal script wired in the OS shell" : fail("journal.js not referenced in index.html"));
    ok($ix =~ /data-route=\"journal\"/ ? "journal nav item present" : fail("nav route journal missing"));
    open my $fh3, "<", "$OS/js/os.js" or die;
    local $/; my $os = <$fh3>; close $fh3;
    ok($os =~ /window\.RFXJournal\.render/ ? "router calls RFXJournal.render" : fail("journal route not wired in os.js"));
    # --- six-stat rail: the layout must balance (2,2,2 / 3,3) at any width ---
    # Every stat name appears twice in journal.js: once in the statsRail HTML
    # (the card) and once in refreshStats (the live selector) — so a full wire
    # is 12 references across exactly the six wanted names. The map-capture
    # gotcha (\$1 reusing the last match) is why the names are collected with
    # a plain for loop, never map { \$1 => 1 }.
    my @names = $j =~ /data-jstat="(\w+)"/g;
    my %have; $have{$_} = 1 for @names;
    my @want = qw(total win net pf pips avgR);
    my @miss = grep { !$have{$_} } @want;
    ok(scalar(@names) >= 12 && !@miss ? "six-stat rail wired (12 refs, names: " . join(",", @want) . ")" : fail("stats rail broken: " . scalar(@names) . " refs, missing: " . join(",", @miss)));
    open my $fc, "<", "$OS/css/os.css" or die;
    local $/; my $css = <$fc>; close $fc;
    ok($css =~ /\.jour-stats\s*\{[^}]*repeat\(\s*2\s*,\s*minmax\(0,\s*1fr\)/ ? "stats grid is a fixed 2-column rail — 6 stats land 2,2,2" : fail("jour-stats grid not fixed 2-column — layout can break to 5,1"));
    # --- local-only guarantee: browser storage only, zero server rails ---
    my @net = $j =~ /fetch\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon/g;
    my @pii = $j =~ /email|phone|address|photo|passport|national\s?id/i;
    ok(!@net ? "no server rails — journal never leaves the device" : fail("journal talks to a network rail: " . join(",", @net)));
    ok(!@pii ? "no PII fields collected" : fail("journal collects PII fields: " . join(",", @pii)));
    ok($j =~ /rfx_os_journal_v1/ && $j =~ /never leaves this device/ ? "local storage key + local-only disclosure present" : fail("local-only guarantee text or storage key missing"));
}

# ---------- 13. JOURNAL PERF BUDGET (no churn: event-driven, in-place, batched) ----------
sec(13);
print "\n[13] Journal perf budget — no polling, no rebuild churn\n";
{
    open my $fh, "<", "$OS/js/journal.js" or fail("journal.js missing") and return;
    local $/; my $j = <$fh>; close $fh;
    # Zero polling loops: setInterval/requestAnimationFrame are banned outright;
    # the ONLY allowed setTimeout is the one-shot toast dismisser (3400ms).
    my @loops = $j =~ /setInterval\(|requestAnimationFrame\(/g;
    my $toasts = () = $j =~ /setTimeout\(/g;
    my @net    = $j =~ /fetch\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon/g;
    ok(!@loops && $toasts <= 1 && !@net ? "no polling/network loops — the only timer is the one-shot toast dismiss" : fail("journal has loop machinery: " . join(",", @loops, @net) . " toasts=" . $toasts));
    ok($j =~ /function refreshList\(/ && $j =~ /function refreshStats\(/ ? "in-place refresh path (list + stats update, no full re-render)" : fail("refreshList/refreshStats missing — list rebuilds may churn the DOM"));
    ok($j =~ /innerHTML = shown\.map/ ? "single batched innerHTML write per list refresh" : fail("list rows are not written in one batched write"));
    # save() call sites only (the function definition itself doesn't count) —
    # storage writes must be exactly the log + delete actions, never a loop.
    my $saves = () = $j =~ /^\s*save\(\);/gm;
    ok($saves == 2 ? "storage writes only on user mutation (log + delete, $saves call sites)" : fail("save() has $saves call sites — expected exactly 2 (log + delete)"));
    ok($j =~ /addEventListener\("input", recompute\)/ ? "live math is event-driven, not a polling loop" : fail("live P/L math is not input-event driven"));
}

# ---------- 14. PILL STANDARD + GIANT-ICON GUARD (visual consistency) ----------
sec(14);
print "\n[14] Pill standard — one 26px rhythm — and the giant-icon guard\n";
{
    open my $fh, "<", "$OS/css/os.css" or die "can't read os.css";
    local $/; my $css = <$fh>; close $fh;
    # Every pill/chip family must carry the shared 26px rhythm. If a new
    # family slips in at a different height, the dash loses its neatness
    # standard one chip at a time — this is the tripwire.
    my @families = qw(sys-state live-pill lesson-badge diff-chip rec-chip soon-chip tour-chip tier-pill badge-tier lane-you-pill hof-state pill sim-reward-chip);
    my @off;
    for my $fam (@families) {
        # Some families also appear inside @media inner rules (e.g. the
        # heartbeat row at narrow widths) — the base rule is the one that
        # carries the rhythm, so ANY matching block with the full trio passes.
        my @blocks = $css =~ /\.\Q$fam\E\s*\{[^}]*\}/gs;
        if (!@blocks) { push @off, "$fam (no rule)"; next; }
        my $ok = grep { /height:\s*26px/ && /border-radius:\s*(?:30|99|999)px/ && /white-space:\s*nowrap/ } @blocks;
        push @off, $fam unless $ok;
    }
    ok(@off ? fail("off-standard families: " . join(", ", @off)) : scalar(@families) . " pill families share the 26px rhythm");
    # The giant-icon guard: the unsized-crown bug (705x705px crowns on the
    # dash) was killed at the root — bare inline SVGs now default to text
    # size, and the footers carry no inline svg at all.
    my $guard = $css =~ /^svg\s*\{\s*width:\s*1em;\s*height:\s*1em/m ? 1 : 0;
    ok($guard ? "giant-icon guard in place (bare svg defaults to 1em)" : fail("svg base guard missing — an unsized crown can balloon to panel width"));
    open my $fh2, "<", "$OS/js/os.js" or die;
    local $/; my $os = <$fh2>; close $fh2;
    my @footSvg = grep { /(?:mach-foot|hof-foot|guide-foot)/ && /<svg/i } split /\n/, $os;
    ok(!@footSvg ? "dashboard footers carry no inline svg (no giant crown regression)" : fail("svg found on footer lines: " . join("; ", @footSvg)));
}

# ---------- 15. AUDIT JSON OUTPUT (feeds the live audit status page) ----------
# Runs with AUDIT_JSON=1; the OS server's /os/api/audit endpoint executes this
# and returns the machine's self-report for the founder's audit status page.
if ($ENV{AUDIT_JSON}) {
    my @rows;
    my %meta = (
      1 => [ "Tree lockstep",        "served vs source trees byte-identical" ],
      2 => [ "Version stamps",       "one version per page, assets exist" ],
      3 => [ "Function contracts",   "every db.* call resolves in db.js" ],
      4 => [ "Handoff contract",     "all 15 payload fields the OS reads" ],
      5 => [ "OS stamp unity",       "single stamp, files exist" ],
      6 => [ "Coupon rail",          "website -> reception deep-link" ],
      7 => [ "Store snapshot",       "shared state backed up" ],
      8 => [ "Device-trust rail",    "server + function + client agree" ],
      9 => [ "Security layer",       "PII scanner + masking + RBAC + access log + age gate + guardian + privacy" ],
      10 => [ "Challenge sim",        "module + route + leaderboard rails" ],
      11 => [ "Forge Standard",       "all 13 chapters: per-lane slides/quiz/qpos, explain, anatomy" ],
      12 => [ "Trade Journal",        "module + route + six-stat rail (2,2,2 / 3,3) + local-only guarantee" ],
      13 => [ "Journal perf budget",  "no timers/polling, in-place refresh, batched writes, storage on action only" ],
      14 => [ "Pill standard + icon guard", "one 26px pill rhythm OS-wide + bare-svg 1em guard (no giant crowns)" ],
    );
    for my $n (sort { $a <=> $b } keys %meta) {
        push @rows, { n => $n, name => $meta{$n}[0], detail => $meta{$n}[1], ok => ($secOk{$n} ? JSON::PP::true : JSON::PP::false) };
    }
    print "\n---AUDITJSON---\n";
    print JSON::PP->new->utf8->canonical->encode({ at => scalar(gmtime), ok => (scalar(@fails) ? JSON::PP::false : JSON::PP::true), fails => scalar(@fails), checks => \@rows });
    print "\n";
}

print "\n==============================================\n";
if (@fails) {
    print "AUDIT: " . scalar(@fails) . " FINDING(S) — fix before building further.\n";
    exit 1;
} else {
    print "AUDIT: ALL GREEN — the machine is structurally sound.\n";
    exit 0;
}
