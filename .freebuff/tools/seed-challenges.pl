use strict; use warnings;
# Seed the Trading Challenge leaderboard with ONE honest entry.
# Posts through the SAME /os/api/challenge/leaderboard rail the app uses, so the
# entry is signed exactly like a real student's assessment.
#
# The founder's standard (Aug 2026): the wall shows that the challenge has been
# TRIED and that passing is POSSIBLE — never that it has already been done by
# many. Exactly one person, one PASS, once. Every other board stays empty:
# "No completed assessments yet — the first name on this wall becomes the
# standard." Never seed mass victories; they are demotivating and fake.
use HTTP::Tiny;
use JSON::PP;

my $base = "http://127.0.0.1:49270/os/api/challenge/leaderboard";
my $http = HTTP::Tiny->new(timeout => 8);

# name => [challenge, studentId, score, verdict, returnPct, trades]
my @rows = (
  # ---- ONE entry: the flagship FTMO challenge, passed once ----
  [ "Sipho Ngubane", "ftmo", "RFX-10488", 84, "PASS", 8.6, 6 ],
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
print "seeded $ok/" . scalar(@rows) . " leaderboard entry\n";
