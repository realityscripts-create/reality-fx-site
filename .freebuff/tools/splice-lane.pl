#!/usr/bin/perl
use strict; use warnings;
# usage: perl splice-lane.pl <data.js> <fragment.js> <anchor-file> <replacement-file>
# Replaces the anchor text (read from anchor-file) with the replacement text
# (read from replacement-file) — first occurrence only, exactly once.
my ($dataPath, $fragPath, $anchorPath, $replPath) = @ARGV;
die "usage: splice-lane.pl <data> <fragment> <anchor> <replacement>" unless @ARGV == 4;
open my $f, "<:raw", $dataPath or die "data: $!";
my $data = do { local $/; <$f> }; close $f;
open my $g, "<:raw", $fragPath or die "frag: $!";
my $frag = do { local $/; <$g> }; close $g;
open my $a, "<:raw", $anchorPath or die "anchor: $!";
my $anchor = do { local $/; <$a> }; close $a;
open my $r, "<:raw", $replPath or die "repl: $!";
my $repl = do { local $/; <$r> }; close $r;
# $frag is interpolated literally via /e (no escape processing on variable values)
$repl =~ s/__FRAG__/$frag/;
my $n = ($data =~ s/\Q$anchor\E/$repl/e);
die "ANCHOR NOT FOUND" unless $n == 1;
open my $h, ">:raw", $dataPath or die "write: $!";
print $h $data; close $h;
print "spliced ok\n";
