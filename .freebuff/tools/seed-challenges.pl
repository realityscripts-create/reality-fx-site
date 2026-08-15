use strict; use warnings;
# Seed the Trading Challenge leaderboards with realistic machine-scored results.
# Posts through the SAME /os/api/challenge/leaderboard rail the app uses, so every
# entry is signed exactly like a real student's assessment (sorted by score, capped).
use HTTP::Tiny;
use JSON::PP;

my $base = "http://127.0.0.1:49270/os/api/challenge/leaderboard";
my $http = HTTP::Tiny->new(timeout => 8);

# name => [challenge, studentId, score, verdict, returnPct, trades]
my @rows = (
  # ---- RFX FTMO Challenge (flagship: +8%, 10% DD, 5+ trades) ----
  [ "Sipho Ngubane",     "ftmo", "RFX-10488", 84, "PASS",   8.6, 6 ],
  [ "Naledi Khoza",      "ftmo", "RFX-10483", 71, "REVIEW", 4.9, 7 ],
  [ "Daniel Mwamba",     "ftmo", "RFX-1012",  63, "REVIEW", 3.1, 6 ],
  [ "Kgotso Molefe",     "ftmo", "RFX-1015",  58, "REVIEW", 1.2, 8 ],
  [ "Tariq Hassan",      "ftmo", "RFX-1018",  52, "REVIEW", -0.4, 5 ],
  # ---- Risk Management Challenge (+5%, 5% DD, 10+ trades) ----
  [ "Zanele Dube",       "risk", "RFX-10484", 91, "PASS",   5.3, 12 ],
  [ "Thandiwe Mokoena",  "risk", "RFX-10485", 76, "REVIEW", 3.6, 11 ],
  [ "Amara Okafor",      "risk", "RFX-1021",  68, "REVIEW", 2.0, 13 ],
  [ "Priya Naidoo",      "risk", "RFX-1024",  62, "REVIEW", 0.8, 10 ],
  [ "Lindiwe Sithole",   "risk", "RFX-1027",  57, "REVIEW", -0.9, 12 ],
  # ---- Consistency Challenge (15+ trades, 8% DD) ----
  [ "Sipho Ngubane",     "consistency", "RFX-10488", 88, "PASS",   4.1, 16 ],
  [ "Daniel Mwamba",     "consistency", "RFX-1012",  73, "REVIEW", 2.6, 15 ],
  [ "Priya Naidoo",      "consistency", "RFX-1024",  66, "REVIEW", 1.4, 17 ],
  [ "Tariq Hassan",      "consistency", "RFX-1018",  59, "REVIEW", 0.2, 15 ],
  # ---- Prop-Style Challenge (two-phase, 50k, 8% DD) ----
  [ "Zanele Dube",       "prop", "RFX-10484", 92, "PASS",  10.4, 9 ],
  [ "Amara Okafor",      "prop", "RFX-1021",  74, "REVIEW", 6.1, 8 ],
  [ "Kgotso Molefe",     "prop", "RFX-1015",  61, "REVIEW", 3.3, 9 ],
  [ "Lindiwe Sithole",   "prop", "RFX-1027",  54, "REVIEW", 1.0, 10 ],
);

my $ok = 0;
for my $r (@rows) {
    my ($name, $ch, $sid, $score, $verdict, $ret, $trades) = @$r;
    my $body = JSON::PP->new->utf8->encode({
        challenge => $ch, studentId => $sid, name => $name,
        score => $score, verdict => $verdict, returnPct => $ret, trades => $trades,
    });
    my $res = $http->post($base, { content => $body, headers => { "Content-Type" => "application/json" } });
    if ($res->{success}) { $ok++; }
    else { print "FAIL $name: $res->{status} $res->{reason}\n"; }
}
print "seeded $ok/" . scalar(@rows) . " leaderboard entries\n";
