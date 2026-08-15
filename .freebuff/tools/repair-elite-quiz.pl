#!/usr/bin/env perl
# Repair: restore `quiz: [` openers and `],\n native:` closers that the buggy
# splice dropped from the ch1/ch2 elite blocks.
use strict; use warnings;
open my $f, "<", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
local $/; my $s = <$f>;

# --- ch1 elite opener ---
my $n1 = () = ($s =~ /\],\n      \n\{ q: "A strategy wins 40%/g);
$s =~ s/\],\n      \n\{ q: "A strategy wins 40%/\],\n      quiz: \[\n        \{ q: "A strategy wins 40%/g;
# --- ch1 elite closer ---
my $n2 = () = ($s =~ /\}\n      \[\n        \{\n          eyebrow: "Elite · Beyond the asset"/g);
$s =~ s/\}\n      \[\n        \{\n          eyebrow: "Elite · Beyond the asset"/\},\n      ],\n      native: [\n        {\n          eyebrow: "Elite · Beyond the asset"/g;

# --- ch2 elite opener ---
my $n3 = () = ($s =~ /\],\n      \n\{ q: "One standard lot is 100,000/g);
$s =~ s/\],\n      \n\{ q: "One standard lot is 100,000/\],\n      quiz: \[\n        \{ q: "One standard lot is 100,000/g;
# --- ch2 elite closer ---
my $n4 = () = ($s =~ /\}\n      \[\n        \{\n          eyebrow: "Elite · The language"/g);
$s =~ s/\}\n      \[\n        \{\n          eyebrow: "Elite · The language"/\},\n      ],\n      native: [\n        {\n          eyebrow: "Elite · The language"/g;

print "opener ch1 found: $n1, closer ch1 found: $n2, opener ch2 found: $n3, closer ch2 found: $n4\n";
open my $o, ">", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
print $o $s;
print "repaired OK\n";
