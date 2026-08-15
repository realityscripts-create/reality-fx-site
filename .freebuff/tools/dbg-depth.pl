#!/usr/bin/perl
use strict; use warnings;
my $file = $ARGV[0] or die "usage: dbg-depth.pl FILE [baseline]";
my $baseline = @ARGV > 1 ? $ARGV[1] : 3;
open my $f, "<", $file or die $!;
my @L = <$f>;
close $f;
my $depth = 0; my $inBlock = 0; my $inLine = 0; my $inStr = 0; my $sq = 0; my $inTpl = 0;
my $ln = 0;
for my $line (@L) {
  $ln++;
  my $i = 0; my $len = length $line;
  while ($i < $len) {
    my $ch = substr($line, $i, 1);
    if ($inBlock) { $inBlock = 0 if substr($line, $i, 2) eq "*/"; $i++; next; }
    if ($inLine) { last; }
    if (!$inStr && !$inTpl && !$sq) {
      if (substr($line, $i, 2) eq "/*") { $inBlock = 1; $i += 2; next; }
      if (substr($line, $i, 2) eq "//") { $inLine = 1; last; }
      if ($ch eq '"') { $inStr = 1; $i++; next; }
      if ($ch eq "'") { $sq = 1; $i++; next; }
      if ($ch eq '`') { $inTpl = 1; $i++; next; }
      $depth++ if $ch eq "{";
      $depth-- if $ch eq "}";
      $i++; next;
    }
    if ($inStr) { if ($ch eq "\\") { $i += 2; next; } $inStr = 0 if $ch eq '"'; $i++; next; }
    if ($sq) { if ($ch eq "\\") { $i += 2; next; } $sq = 0 if $ch eq "'"; $i++; next; }
    if ($inTpl) { if ($ch eq "\\") { $i += 2; next; } if ($ch eq '`') { $inTpl = 0; } $i++; next; }
  }
  if ($depth > $baseline) { print "line $ln depth=$depth: $line"; }
  if ($depth < 0) { print "line $ln NEGATIVE: $line"; $depth = 0; }
}
print "final depth: $depth\n";
