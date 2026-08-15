#!/usr/bin/env perl
# Generic tier-deck splice. Usage:
#   perl splice-tier.pl <blockFile> <anchor>   e.g.
#   perl splice-tier.pl .freebuff/tools/ch1-challenging-block.js 'id: 2, title: "Fx Terminology & Concepts"'
# Inserts the block as the LAST key of the chapter whose closing brace precedes <anchor>.
use strict; use warnings;

my ($blockFile, $anchor) = @ARGV;
die "usage: perl splice-tier.pl <blockFile> <anchor>\n" unless $blockFile && $anchor;

open my $f, "<", $blockFile or die "cannot read $blockFile: $!";
local $/; my $block = <$f>;
open my $d, "<", "REALITY-FOREX-TRADING-/os/js/data.js" or die "cannot read data.js: $!";
local $/; my $data = <$d>;

my $pos = index($data, $anchor);
die "anchor not found: $anchor" if $pos < 0;
my $pre = substr($data, 0, $pos);
my $closePos = rindex($pre, "  },\n");
die "chapter close not found" if $closePos < 0;

my $clean = $block;
$clean =~ s/,\s*\z//;
$clean =~ s/\s+\z//;

my $insert = ",\n" . $clean . "\n";
my $out = substr($data, 0, $closePos) . $insert . substr($data, $closePos);
open my $o, ">", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
print $o $out;
print "spliced OK\n";
