use strict; use warnings;
use JSON::PP;
local $/;
open my $f, "<", ".freebuff/tools/system-a-state.json" or die $!;
my $j = decode_json(<$f>);
for my $e (@{ $j->{enrollments} || [] }) {
    if (($e->{id} || "") eq "ENR-0048") {
        print "state=" . ($e->{state} || "-") . "\n";
        print "sid=" . ($e->{studentId} || "-") . "\n";
        print "personal=" . ($e->{registration}{personal} ? 1 : 0) . "\n";
        print "ageGate=" . ($e->{registration}{ageGate} || "-") . "\n";
        print "guardian=" . ($e->{registration}{guardian} ? 1 : 0) . "\n";
    }
}
