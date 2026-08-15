#!/usr/bin/env perl
use strict; use warnings;
open my $f, "<", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
local $/; my $s = <$f>;

my $n1 = () = ($s =~ /" \} \[\n        \{\n          eyebrow: "Elite · Beyond the asset"/g);
$s =~ s/" \} \[\n        \{\n          eyebrow: "Elite · Beyond the asset"/" }\n      ],\n      native: [\n        {\n          eyebrow: "Elite · Beyond the asset"/g;

my $n2 = () = ($s =~ /" \} \[\n        \{\n          eyebrow: "Elite · The language"/g);
$s =~ s/" \} \[\n        \{\n          eyebrow: "Elite · The language"/" }\n      ],\n      native: [\n        {\n          eyebrow: "Elite · The language"/g;

print "ch1 closer found: $n1, ch2 closer found: $n2\n";
open my $o, ">", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
print $o $s;
print "closers repaired\n";
